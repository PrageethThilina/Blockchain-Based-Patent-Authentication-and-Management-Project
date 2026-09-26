import express from 'express';
import jwt from 'jsonwebtoken';
import { ethers } from 'ethers';
import { config } from '../config/config.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Pre-configured institutional demo accounts for seamless multi-role demonstration
export const DEMO_ACCOUNTS = {
  INVENTOR: {
    walletAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    role: "INVENTOR",
    name: "Dr. Elena Rostova (Registered Inventor)",
    jurisdiction: "Global"
  },
  USPTO: {
    walletAddress: "0x11a6dB8497a849abd3c0b73643E8Fd4f103D9fd5",
    role: "USPTO",
    name: "USPTO Patent Examination Division",
    jurisdiction: "United States"
  },
  JPO: {
    walletAddress: "0xe9782Bb57c404CBD6b11742b42d4D78fe630999B",
    role: "JPO",
    name: "Japan Patent Office (特許庁)",
    jurisdiction: "Japan"
  },
  EPO: {
    walletAddress: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    role: "EPO",
    name: "European Patent Office",
    jurisdiction: "European Union"
  },
  WIPO: {
    walletAddress: "0xB444f386DaE8baC4Cdc508385331214F5aBC8d31",
    role: "WIPO",
    name: "World Intellectual Property Organization (WIPO)",
    jurisdiction: "International PCT"
  },
  ADMIN: {
    walletAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    role: "ADMIN",
    name: "Patent Registry Super Admin",
    jurisdiction: "Root Authority"
  }
};

const activeNonces = new Map();

/**
 * @route POST /api/v1/auth/login
 * @desc Quick demo login or role switch
 */
router.post('/login', (req, res) => {
  const { role, customAddress } = req.body;
  const targetRole = (role || 'INVENTOR').toUpperCase();
  const accountInfo = DEMO_ACCOUNTS[targetRole] || DEMO_ACCOUNTS.INVENTOR;

  const walletAddress = customAddress || accountInfo.walletAddress;

  const token = jwt.sign(
    {
      walletAddress,
      role: targetRole,
      name: accountInfo.name,
      jurisdiction: accountInfo.jurisdiction
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

  return res.json({
    success: true,
    token,
    user: {
      walletAddress,
      role: targetRole,
      name: accountInfo.name,
      jurisdiction: accountInfo.jurisdiction
    }
  });
});

/**
 * @route POST /api/v1/auth/challenge
 * @desc Generate SIWE challenge nonce
 */
router.post('/challenge', (req, res) => {
  const { walletAddress } = req.body;
  if (!walletAddress) {
    return res.status(400).json({ success: false, message: 'walletAddress is required.' });
  }

  const nonce = `Sign this message to authenticate with PatentRegistry2026: ${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  activeNonces.set(walletAddress.toLowerCase(), nonce);

  return res.json({
    success: true,
    walletAddress,
    nonce,
    message: nonce
  });
});

/**
 * @route POST /api/v1/auth/verify-signature
 * @desc Cryptographic SIWE signature verification (EIP-191 / EIP-4361)
 */
router.post('/verify-signature', (req, res) => {
  const { walletAddress, signature, role } = req.body;

  if (!walletAddress || !signature) {
    return res.status(400).json({ success: false, message: 'walletAddress and signature are required.' });
  }

  const expectedNonce = activeNonces.get(walletAddress.toLowerCase());
  if (!expectedNonce) {
    return res.status(400).json({ success: false, message: 'No active challenge found for this address. Request /challenge first.' });
  }

  try {
    const recoveredAddress = ethers.verifyMessage(expectedNonce, signature);
    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(401).json({ success: false, message: 'Cryptographic signature verification failed.' });
    }

    activeNonces.delete(walletAddress.toLowerCase());

    const assignedRole = role || 'INVENTOR';
    const accountMeta = DEMO_ACCOUNTS[assignedRole.toUpperCase()] || {
      name: `External Wallet (${walletAddress.substring(0, 6)}...${walletAddress.substring(38)})`,
      jurisdiction: 'Custom'
    };

    const token = jwt.sign(
      {
        walletAddress,
        role: assignedRole.toUpperCase(),
        name: accountMeta.name,
        jurisdiction: accountMeta.jurisdiction
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    return res.json({
      success: true,
      token,
      user: {
        walletAddress,
        role: assignedRole.toUpperCase(),
        name: accountMeta.name,
        jurisdiction: accountMeta.jurisdiction
      }
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: `Signature validation error: ${err.message}` });
  }
});

/**
 * @route GET /api/v1/auth/me
 * @desc Current session profile
 */
router.get('/me', authenticateToken, (req, res) => {
  return res.json({
    success: true,
    user: req.user
  });
});

export default router;
