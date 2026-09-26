import { HashService } from './hashService.js';

export class PatentService {
  constructor() {
    this.patents = [];
    this.auditLogs = [];
    this.initSeedData();
  }

  initSeedData() {
    const seedPatents = [
      {
        patentId: 1,
        title: "Zero-Knowledge Rollup Verification Engine for Decentralized Identity",
        inventorDetails: "Dr. Elena Rostova, Cryptography Labs, Zurich",
        inventorAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        currentOwner: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        technicalField: "Applied Cryptography, Zero-Knowledge Succinct Non-Interactive Arguments of Knowledge (zk-SNARKs)",
        technicalProblem: "High computational gas cost and verification latency when validating decentralized identities on Layer-1 blockchains.",
        technicalSolution: "Recursive polynomial proof aggregation over elliptic curve BN254 with pre-compiled verification gates reducing verification complexity to O(1).",
        description: "A novel architecture utilizing Plonky2 recursive proving systems to bundle up to 10,000 identity claims into a single succinct proof verifiable on EVM chains.",
        ipfsMetadataURI: "ipfs://bafybeic7w4k9lmz94p8q2n3kd8v8x1patentdoc",
        metadataHash: "0x8f3c7e42d991bfa3e4a2c5108b3e817a942b083e1c6674910cf2e718b532901a",
        registeredDate: "2025-11-14",
        submissionTimestamp: 1731580800000,
        grantTimestamp: 1734172800000,
        expirationDate: "2045-11-14",
        status: "Active",
        claims: {
          USPTO: { requested: true, status: "Approved", remarks: "Novel non-obvious recursive gate structure verified by patent examiner US-4412.", officer: "0x11a6dB8497a849abd3c0b73643E8Fd4f103D9fd5", timestamp: 1732012800000 },
          JPO: { requested: true, status: "Approved", remarks: "Complies with JPO Technical Software Guidelines Article 29.", officer: "0xe9782Bb57c404CBD6b11742b42d4D78fe630999B", timestamp: 1733049600000 },
          EPO: { requested: true, status: "Approved", remarks: "Novel technical effect recognized under EPC Article 52(2).", officer: "0x90F79bf6EB2c4f870365E785982E1f101E93b906", timestamp: 1734172800000 }
        },
        transferRequest: null
      },
      {
        patentId: 2,
        title: "Autonomous Microgrid Peer-to-Peer Energy Settlement Protocol",
        inventorDetails: "Kenji Sato, Tokyo Renewable Systems Institute",
        inventorAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
        currentOwner: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
        technicalField: "Decentralized Smart Grids, Distributed Ledger Technology (DLT)",
        technicalProblem: "Lack of trustless sub-second bi-directional metering settlement across high-frequency residential solar battery microgrids.",
        technicalSolution: "State channel mesh network coupled with automated localized automated market maker (AMM) pricing curves calibrated to regional grid frequency drops.",
        description: "Enables distributed smart meters to execute bilateral micro-transactions for kilowatt-hour delivery without central utility arbitration.",
        ipfsMetadataURI: "ipfs://bafybeich93k1lm48p8q9n3kd4v7x2patentdoc",
        metadataHash: "0x4b78a9c1e309f872d82910ba98ef014a5b67c891e456209812f3e4d567a89012",
        registeredDate: "2026-01-20",
        submissionTimestamp: 1768867200000,
        grantTimestamp: null,
        expirationDate: null,
        status: "UnderExamination",
        claims: {
          USPTO: { requested: true, status: "Approved", remarks: "Claim 1-4 allowed. Priority date verified.", officer: "0x11a6dB8497a849abd3c0b73643E8Fd4f103D9fd5", timestamp: 1770000000000 },
          JPO: { requested: true, status: "Pending", remarks: "Under examination by JPO Energy Technology Division.", officer: null, timestamp: null },
          EPO: { requested: true, status: "Pending", remarks: "Formal search report completed, substantive review in progress.", officer: null, timestamp: null }
        },
        transferRequest: null
      },
      {
        patentId: 3,
        title: "Cryptographic DNA Sequence Watermarking for Synthetic Biology Synthesis",
        inventorDetails: "Dr. Marcus Vance & Dr. Sarah Lin, Cambridge Synthetic Bio",
        inventorAddress: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
        currentOwner: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
        technicalField: "Bioinformatics, Synthetic Genomics, Intellectual Property Watermarking",
        technicalProblem: "Illicit replication and unauthorized gene synthesis of proprietary biocatalytic enzyme plasmids.",
        technicalSolution: "Degenerate codon encoding that embeds verifiable digital signatures inside non-coding nucleotide intervals without altering protein tertiary folding.",
        description: "A method to embed cryptographic public key signatures into biological DNA sequences to track provenance and detect biopiracy.",
        ipfsMetadataURI: "ipfs://bafybeid992k1l894p8q1n3kd9v3x5patentdoc",
        metadataHash: "0x1a9c3e4b78f9208a45de768910c2e3458901fa34bc56789012de3456789f0123",
        registeredDate: "2026-02-10",
        submissionTimestamp: 1770681600000,
        grantTimestamp: 1771804800000,
        expirationDate: "2046-02-10",
        status: "TransferPending",
        claims: {
          USPTO: { requested: true, status: "Approved", remarks: "Patentability affirmed following Alice/Mayo step 2 scrutiny.", officer: "0x11a6dB8497a849abd3c0b73643E8Fd4f103D9fd5", timestamp: 1771200000000 },
          JPO: { requested: false, status: "None", remarks: "", officer: null, timestamp: null },
          EPO: { requested: true, status: "Approved", remarks: "Industrial applicability acknowledged under EPC Rule 28.", officer: "0x90F79bf6EB2c4f870365E785982E1f101E93b906", timestamp: 1771804800000 }
        },
        transferRequest: {
          proposedOwner: "0xB444f386DaE8baC4Cdc508385331214F5aBC8d31",
          proposedOwnerName: "Global BioTech Holdings Ltd.",
          legalAgreementHash: "0x994821ea345b8014f780e921d743a18e904b561c",
          requestTimestamp: 1772064000000,
          status: "PendingWIPOApproval"
        }
      }
    ];

    this.patents = seedPatents;
  }

  getAllPatents(filters = {}) {
    let result = [...this.patents];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.technicalField.toLowerCase().includes(q) ||
        p.inventorDetails.toLowerCase().includes(q) ||
        p.patentId.toString() === q ||
        p.metadataHash.toLowerCase().includes(q)
      );
    }

    if (filters.status) {
      result = result.filter(p => p.status.toLowerCase() === filters.status.toLowerCase());
    }

    if (filters.jurisdiction) {
      const jur = filters.jurisdiction.toUpperCase();
      result = result.filter(p => p.claims[jur] && p.claims[jur].requested);
    }

    if (filters.owner) {
      result = result.filter(p => p.currentOwner.toLowerCase() === filters.owner.toLowerCase());
    }

    if (filters.pendingFor) {
      const office = filters.pendingFor.toUpperCase();
      result = result.filter(p => p.claims[office]?.status === 'Pending');
    }

    // Sort by ID descending
    result.sort((a, b) => b.patentId - a.patentId);

    const page = parseInt(filters.page, 10) || 1;
    const limit = parseInt(filters.limit, 10) || 10;
    const total = result.length;
    const paginated = result.slice((page - 1) * limit, page * limit);

    return {
      patents: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1
    };
  }

  getPatentById(id) {
    const patent = this.patents.find(p => p.patentId === parseInt(id, 10));
    return patent || null;
  }

  getPatentByHash(hash) {
    const cleanHash = hash.trim().toLowerCase();
    return this.patents.find(p =>
      p.metadataHash.toLowerCase() === cleanHash ||
      p.patentId.toString() === cleanHash
    ) || null;
  }

  registerPatent(payload, user) {
    const newId = this.patents.length + 1;
    const metadataHash = HashService.generateMetadataHash(payload);
    const ipfsURI = HashService.generateIpfsCID(payload);
    const today = new Date().toISOString().split('T')[0];

    const newPatent = {
      patentId: newId,
      title: payload.title,
      inventorDetails: payload.inventorDetails,
      inventorAddress: user.walletAddress,
      currentOwner: user.walletAddress,
      technicalField: payload.technicalField,
      technicalProblem: payload.technicalProblem,
      technicalSolution: payload.technicalSolution,
      description: payload.description,
      ipfsMetadataURI: ipfsURI,
      metadataHash: metadataHash,
      registeredDate: today,
      submissionTimestamp: Date.now(),
      grantTimestamp: null,
      expirationDate: null,
      status: "Submitted",
      claims: {
        USPTO: {
          requested: !!payload.claimUSPTO,
          status: payload.claimUSPTO ? "Pending" : "None",
          remarks: "",
          officer: null,
          timestamp: null
        },
        JPO: {
          requested: !!payload.claimJPO,
          status: payload.claimJPO ? "Pending" : "None",
          remarks: "",
          officer: null,
          timestamp: null
        },
        EPO: {
          requested: !!payload.claimEPO,
          status: payload.claimEPO ? "Pending" : "None",
          remarks: "",
          officer: null,
          timestamp: null
        }
      },
      transferRequest: null
    };

    this.patents.unshift(newPatent);

    this.logAction({
      type: "PATENT_REGISTERED",
      patentId: newId,
      actor: user.walletAddress,
      role: user.role,
      details: `Registered patent '${payload.title}' with hash ${metadataHash}`
    });

    return newPatent;
  }

  reviewClaim(patentId, office, approved, remarks, user) {
    const patent = this.getPatentById(patentId);
    if (!patent) throw new Error("Patent not found");

    const normOffice = office.toUpperCase();
    if (!patent.claims[normOffice] || !patent.claims[normOffice].requested) {
      throw new Error(`Jurisdiction ${normOffice} was not requested for this patent.`);
    }

    patent.claims[normOffice].status = approved ? "Approved" : "Rejected";
    patent.claims[normOffice].remarks = remarks || (approved ? "Approved upon examination." : "Rejected upon examination.");
    patent.claims[normOffice].officer = user.walletAddress;
    patent.claims[normOffice].timestamp = Date.now();

    // Check if any jurisdiction has approved
    const anyApproved = Object.values(patent.claims).some(c => c.status === "Approved");
    if (anyApproved && patent.status !== "Active") {
      patent.status = "Active";
      patent.grantTimestamp = Date.now();
      const expDate = new Date();
      expDate.setFullYear(expDate.getFullYear() + 20);
      patent.expirationDate = expDate.toISOString().split('T')[0];
    } else if (!anyApproved && patent.status === "Submitted") {
      patent.status = "UnderExamination";
    }

    this.logAction({
      type: "CLAIM_REVIEWED",
      patentId,
      actor: user.walletAddress,
      role: user.role,
      office: normOffice,
      outcome: approved ? "Approved" : "Rejected",
      remarks
    });

    return patent;
  }

  initiateTransfer(patentId, proposedOwner, proposedOwnerName, legalAgreementHash, user) {
    const patent = this.getPatentById(patentId);
    if (!patent) throw new Error("Patent not found");
    if (patent.currentOwner.toLowerCase() !== user.walletAddress.toLowerCase()) {
      throw new Error("Only current patent owner can initiate ownership transfer.");
    }
    if (patent.status !== "Active") {
      throw new Error("Only Active patents can be transferred.");
    }

    patent.status = "TransferPending";
    patent.transferRequest = {
      proposedOwner,
      proposedOwnerName: proposedOwnerName || "Designated Entity",
      legalAgreementHash: legalAgreementHash || HashService.generateKeccakHash(proposedOwner + Date.now()),
      requestTimestamp: Date.now(),
      status: "PendingWIPOApproval"
    };

    this.logAction({
      type: "TRANSFER_REQUESTED",
      patentId,
      actor: user.walletAddress,
      proposedOwner,
      legalAgreementHash: patent.transferRequest.legalAgreementHash
    });

    return patent;
  }

  finalizeTransfer(patentId, approved, remarks, user) {
    const patent = this.getPatentById(patentId);
    if (!patent) throw new Error("Patent not found");
    if (!patent.transferRequest || patent.status !== "TransferPending") {
      throw new Error("No pending transfer request found for this patent.");
    }

    const previousOwner = patent.currentOwner;
    const newOwner = patent.transferRequest.proposedOwner;

    if (approved) {
      patent.currentOwner = newOwner;
      patent.status = "Active";
      patent.transferRequest = null;
    } else {
      patent.status = "Active";
      patent.transferRequest = null;
    }

    this.logAction({
      type: "TRANSFER_FINALIZED",
      patentId,
      actor: user.walletAddress,
      role: user.role,
      outcome: approved ? "Approved" : "Rejected",
      from: previousOwner,
      to: approved ? newOwner : previousOwner,
      remarks
    });

    return patent;
  }

  logAction(entry) {
    this.auditLogs.unshift({
      ...entry,
      timestamp: Date.now(),
      id: this.auditLogs.length + 1
    });
  }

  getAnalyticsStats() {
    const total = this.patents.length;
    const active = this.patents.filter(p => p.status === "Active").length;
    const underReview = this.patents.filter(p => p.status === "UnderExamination" || p.status === "Submitted").length;
    const transferPending = this.patents.filter(p => p.status === "TransferPending").length;

    const usptoPending = this.patents.filter(p => p.claims.USPTO?.status === "Pending").length;
    const jpoPending = this.patents.filter(p => p.claims.JPO?.status === "Pending").length;
    const epoPending = this.patents.filter(p => p.claims.EPO?.status === "Pending").length;

    return {
      totalPatents: total,
      activePatents: active,
      underExamination: underReview,
      transferPending,
      pendingByOffice: {
        USPTO: usptoPending,
        JPO: jpoPending,
        EPO: epoPending
      },
      auditLogs: this.auditLogs.slice(0, 10)
    };
  }
}

export const patentService = new PatentService();
