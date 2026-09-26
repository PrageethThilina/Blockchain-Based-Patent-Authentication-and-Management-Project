import express from 'express';
import { patentService } from '../services/patentService.js';
import { authenticateToken, requireRoles, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route GET /api/v1/patents
 * @desc Search, filter, and list patents (Publicly accessible with optional personalized flags)
 */
router.get('/', optionalAuth, (req, res) => {
  try {
    const { search, status, jurisdiction, owner, pendingFor, page, limit } = req.query;
    const result = patentService.getAllPatents({
      search,
      status,
      jurisdiction,
      owner,
      pendingFor,
      page,
      limit
    });
    return res.json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @route GET /api/v1/patents/analytics/stats
 * @desc Aggregated metrics and audit logs
 */
router.get('/analytics/stats', (req, res) => {
  try {
    const stats = patentService.getAnalyticsStats();
    return res.json({ success: true, stats });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @route GET /api/v1/patents/:id
 * @desc Get single patent by ID
 */
router.get('/:id', (req, res) => {
  try {
    const patent = patentService.getPatentById(req.params.id);
    if (!patent) {
      return res.status(404).json({ success: false, message: `Patent #${req.params.id} not found.` });
    }
    return res.json({ success: true, patent });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @route POST /api/v1/patents
 * @desc Register a new patent application with decentralized hash generation
 * @access Authenticated (INVENTOR or ADMIN)
 */
router.post('/', authenticateToken, requireRoles('INVENTOR', 'ADMIN'), (req, res) => {
  try {
    const { title, inventorDetails, technicalField, technicalProblem, technicalSolution, description, claimUSPTO, claimJPO, claimEPO } = req.body;

    if (!title || !technicalProblem || !technicalSolution) {
      return res.status(400).json({
        success: false,
        message: 'Missing required patent specification fields (title, technicalProblem, technicalSolution).'
      });
    }

    const newPatent = patentService.registerPatent(req.body, req.user);
    return res.status(201).json({
      success: true,
      message: 'Patent successfully registered and anchored.',
      patent: newPatent
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @route PATCH /api/v1/patents/:id/claims/:office
 * @desc Review jurisdiction claims (USPTO, JPO, EPO)
 * @access Restricted by Role (e.g. only USPTO can approve USPTO claim)
 */
router.patch('/:id/claims/:office', authenticateToken, (req, res, next) => {
  const office = req.params.office.toUpperCase();
  // Role check matching office or ADMIN
  const roleCheck = requireRoles(office, 'ADMIN');
  return roleCheck(req, res, next);
}, (req, res) => {
  try {
    const { approved, remarks } = req.body;
    const office = req.params.office.toUpperCase();

    const updatedPatent = patentService.reviewClaim(
      req.params.id,
      office,
      approved === true || approved === 'true',
      remarks,
      req.user
    );

    return res.json({
      success: true,
      message: `Jurisdiction claim for ${office} evaluated as ${approved ? 'APPROVED' : 'REJECTED'}.`,
      patent: updatedPatent
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * @route POST /api/v1/patents/:id/transfer
 * @desc Current patent owner initiates ownership transfer
 * @access Authenticated Patent Owner
 */
router.post('/:id/transfer', authenticateToken, (req, res) => {
  try {
    const { proposedOwner, proposedOwnerName, legalAgreementHash } = req.body;
    if (!proposedOwner) {
      return res.status(400).json({ success: false, message: 'proposedOwner address is required.' });
    }

    const updatedPatent = patentService.initiateTransfer(
      req.params.id,
      proposedOwner,
      proposedOwnerName,
      legalAgreementHash,
      req.user
    );

    return res.json({
      success: true,
      message: 'Ownership transfer request initiated. Awaiting WIPO certification.',
      patent: updatedPatent
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * @route PATCH /api/v1/patents/:id/transfer/wipo
 * @desc WIPO reviews and finalizes international ownership transfer
 * @access Restricted to WIPO or ADMIN
 */
router.patch('/:id/transfer/wipo', authenticateToken, requireRoles('WIPO', 'ADMIN'), (req, res) => {
  try {
    const { approved, remarks } = req.body;

    const updatedPatent = patentService.finalizeTransfer(
      req.params.id,
      approved === true || approved === 'true',
      remarks,
      req.user
    );

    return res.json({
      success: true,
      message: `WIPO ownership transfer ${approved ? 'CERTIFIED & FINALIZED' : 'REJECTED'}.`,
      patent: updatedPatent
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
});

export default router;
