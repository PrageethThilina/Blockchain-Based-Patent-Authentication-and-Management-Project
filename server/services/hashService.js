import crypto from 'crypto';
import { ethers } from 'ethers';

/**
 * Service for cryptographic metadata hashing, IPFS CID simulation, and tamper verification
 */
export class HashService {
  /**
   * Generates a deterministic SHA-256 hash of patent specifications
   * @param {Object} patentData 
   * @returns {string} Hex hash string prefixed with 0x
   */
  static generateMetadataHash(patentData) {
    const payload = JSON.stringify({
      title: patentData.title?.trim(),
      technicalField: patentData.technicalField?.trim(),
      technicalProblem: patentData.technicalProblem?.trim(),
      technicalSolution: patentData.technicalSolution?.trim(),
      description: patentData.description?.trim(),
      inventorDetails: patentData.inventorDetails?.trim(),
      inventorAddress: patentData.inventorAddress?.toLowerCase()
    });

    const sha256Hash = crypto.createHash('sha256').update(payload).digest('hex');
    return `0x${sha256Hash}`;
  }

  /**
   * Generates an Ethereum Keccak-256 hash
   */
  static generateKeccakHash(dataString) {
    return ethers.keccak256(ethers.toUtf8Bytes(dataString));
  }

  /**
   * Generates simulated IPFS Content Identifier (CIDv1) based on payload hash
   */
  static generateIpfsCID(patentData) {
    const hash = crypto.createHash('sha256')
      .update(JSON.stringify(patentData))
      .digest('base64url')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
    return `ipfs://bafybeic${hash.slice(0, 36)}patentdoc`;
  }

  /**
   * Verifies candidate payload against registered on-chain hash
   */
  static verifyIntegrity(candidateData, registeredHash) {
    const computedHash = this.generateMetadataHash(candidateData);
    return {
      isValid: computedHash.toLowerCase() === registeredHash.toLowerCase(),
      computedHash,
      registeredHash
    };
  }
}
