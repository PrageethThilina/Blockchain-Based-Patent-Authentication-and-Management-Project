import express from 'express';
import { patentService } from '../services/patentService.js';
import { HashService } from '../services/hashService.js';

const router = express.Router();

/**
 * @route GET /api/v1/verify/:query
 * @desc Publicly verify patent authenticity by Patent ID or SHA-256 metadata hash
 */
router.get('/:query', (req, res) => {
  const query = req.params.query.trim();
  const patent = patentService.getPatentByHash(query);

  if (!patent) {
    return res.status(404).json({
      success: false,
      isValid: false,
      message: `No authentic patent record found matching query '${query}'. Possible counterfeit or unregistered specification.`
    });
  }

  return res.json({
    success: true,
    isValid: true,
    certificate: {
      patentId: patent.patentId,
      title: patent.title,
      status: patent.status,
      originalInventor: patent.inventorAddress,
      inventorDetails: patent.inventorDetails,
      currentOwner: patent.currentOwner,
      registeredDate: patent.registeredDate,
      expirationDate: patent.expirationDate || "Pending Grant",
      ipfsMetadataURI: patent.ipfsMetadataURI,
      metadataHash: patent.metadataHash,
      jurisdictionApprovals: {
        USPTO: patent.claims.USPTO?.status || 'None',
        JPO: patent.claims.JPO?.status || 'None',
        EPO: patent.claims.EPO?.status || 'None'
      },
      verifiedAt: new Date().toISOString(),
      authenticityStatus: "CRYPTOGRAPHICALLY_VERIFIED"
    }
  });
});

/**
 * @route POST /api/v1/verify/payload
 * @desc Re-hashes a candidate specification document to prove tamper-resistance
 */
router.post('/payload', (req, res) => {
  const { title, technicalField, technicalProblem, technicalSolution, description, inventorAddress } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, message: 'Specification title is required for hashing.' });
  }

  const computedHash = HashService.generateMetadataHash(req.body);
  const patent = patentService.getPatentByHash(computedHash);

  return res.json({
    success: true,
    computedHash,
    isMatchFound: !!patent,
    matchedPatent: patent ? {
      patentId: patent.patentId,
      title: patent.title,
      currentOwner: patent.currentOwner,
      status: patent.status
    } : null,
    message: patent ? 'Integrity Verified: Document matches on-chain registered specification!' : 'No match found: This document hash has not been anchored to the blockchain.'
  });
});

export default router;
