// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title PatentRegistryV2
 * @notice Enterprise-grade decentralized patent registry and lifecycle management system.
 * @dev Implements role-based access control, gas-optimized off-chain metadata verification,
 *      multi-jurisdiction claim processing (USPTO, JPO, EPO), and WIPO-certified ownership transfer.
 * @author Senior Blockchain & Security Engineer Portfolio
 */

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }
}

abstract contract ReentrancyGuard {
    uint256 private constant NOT_ENTERED = 1;
    uint256 private constant ENTERED = 2;
    uint256 private _status;

    error ReentrancyGuardReentrantCall();

    constructor() {
        _status = NOT_ENTERED;
    }

    modifier nonReentrant() {
        if (_status == ENTERED) revert ReentrancyGuardReentrantCall();
        _status = ENTERED;
        _;
        _status = NOT_ENTERED;
    }
}

abstract contract AccessControl is Context {
    struct RoleData {
        mapping(address => bool) hasRole;
        bytes32 adminRole;
    }

    mapping(bytes32 => RoleData) private _roles;

    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;

    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);

    error AccessControlUnauthorizedAccount(address account, bytes32 neededRole);

    modifier onlyRole(bytes32 role) {
        _checkRole(role);
        _;
    }

    function hasRole(bytes32 role, address account) public view virtual returns (bool) {
        return _roles[role].hasRole[account];
    }

    function _checkRole(bytes32 role) internal view virtual {
        _checkRole(role, _msgSender());
    }

    function _checkRole(bytes32 role, address account) internal view virtual {
        if (!hasRole(role, account)) {
            revert AccessControlUnauthorizedAccount(account, role);
        }
    }

    function _grantRole(bytes32 role, address account) internal virtual {
        if (!hasRole(role, account)) {
            _roles[role].hasRole[account] = true;
            emit RoleGranted(role, account, _msgSender());
        }
    }

    function _revokeRole(bytes32 role, address account) internal virtual {
        if (hasRole(role, account)) {
            _roles[role].hasRole[account] = false;
            emit RoleRevoked(role, account, _msgSender());
        }
    }

    function grantRole(bytes32 role, address account) public virtual onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(role, account);
    }

    function revokeRole(bytes32 role, address account) public virtual onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(role, account);
    }
}

contract PatentRegistryV2 is Context, AccessControl, ReentrancyGuard {
    // --- Roles ---
    bytes32 public constant USPTO_OFFICER_ROLE = keccak256("USPTO_OFFICER_ROLE");
    bytes32 public constant JPO_OFFICER_ROLE   = keccak256("JPO_OFFICER_ROLE");
    bytes32 public constant EPO_OFFICER_ROLE   = keccak256("EPO_OFFICER_ROLE");
    bytes32 public constant WIPO_OFFICER_ROLE  = keccak256("WIPO_OFFICER_ROLE");
    bytes32 public constant INVENTOR_ROLE      = keccak256("INVENTOR_ROLE");

    // --- Enums ---
    enum ClaimStatus { None, Pending, Approved, Rejected }
    enum PatentStatus { Submitted, UnderExamination, Active, TransferPending, Transferred, Revoked }

    // --- Structs ---
    struct PatentRecord {
        uint256 patentId;
        string title;
        address currentOwner;
        address originalInventor;
        string ipfsMetadataURI;       // Decentralized specification storage (IPFS/Arweave)
        bytes32 metadataHash;         // Cryptographic SHA-256 / Keccak hash of specifications
        uint256 submissionTimestamp;
        uint256 grantTimestamp;
        uint256 expirationTimestamp;
        PatentStatus status;
    }

    struct JurisdictionClaims {
        ClaimStatus usptoStatus;
        ClaimStatus jpoStatus;
        ClaimStatus epoStatus;
        string usptoRemarks;
        string jpoRemarks;
        string epoRemarks;
        uint256 lastUpdated;
    }

    struct TransferRequest {
        address proposedOwner;
        string legalTransferHash;
        uint256 requestTimestamp;
        bool active;
    }

    // --- State Storage ---
    uint256 public patentCounter;
    mapping(uint256 => PatentRecord) public patents;
    mapping(uint256 => JurisdictionClaims) public claims;
    mapping(uint256 => TransferRequest) public transferRequests;

    // --- Custom Errors ---
    error InvalidPatentId(uint256 id);
    error NotPatentOwner(uint256 id, address caller);
    error InvalidPatentStatus(uint256 id, PatentStatus status);
    error EmptyMetadataHash();
    error EmptyTitle();
    error ZeroAddress();
    error ClaimNotRequested(string office);
    error NoPendingTransfer(uint256 id);

    // --- Events ---
    event PatentRegistered(
        uint256 indexed patentId,
        address indexed inventor,
        string title,
        bytes32 indexed metadataHash,
        string ipfsURI
    );

    event ClaimUpdated(
        uint256 indexed patentId,
        string office,
        ClaimStatus indexed status,
        address indexed officer,
        string remarks
    );

    event PatentActivated(uint256 indexed patentId, uint256 expirationDate);

    event TransferInitiated(
        uint256 indexed patentId,
        address indexed fromOwner,
        address indexed toOwner,
        string legalHash
    );

    event TransferFinalized(
        uint256 indexed patentId,
        address indexed oldOwner,
        address indexed newOwner,
        address indexed approvedByWipo
    );

    constructor(address initialAdmin) {
        if (initialAdmin == address(0)) revert ZeroAddress();
        _grantRole(DEFAULT_ADMIN_ROLE, initialAdmin);
        // Initially grant admin all office roles for easy testnet bootstrap
        _grantRole(USPTO_OFFICER_ROLE, initialAdmin);
        _grantRole(JPO_OFFICER_ROLE, initialAdmin);
        _grantRole(EPO_OFFICER_ROLE, initialAdmin);
        _grantRole(WIPO_OFFICER_ROLE, initialAdmin);
    }

    /**
     * @notice Registers a new patent application on-chain with off-chain cryptographic metadata verification.
     * @param title Patent Title
     * @param ipfsURI IPFS gateway URL / CID pointing to full specifications & claims documentation
     * @param metadataHash SHA-256 / Keccak-256 hash of the patent specifications for tamper-proof validation
     * @param claimUSPTO Request examination from USPTO
     * @param claimJPO Request examination from JPO
     * @param claimEPO Request examination from EPO
     */
    function registerPatent(
        string calldata title,
        string calldata ipfsURI,
        bytes32 metadataHash,
        bool claimUSPTO,
        bool claimJPO,
        bool claimEPO
    ) external nonReentrant returns (uint256) {
        if (bytes(title).length == 0) revert EmptyTitle();
        if (metadataHash == bytes32(0)) revert EmptyMetadataHash();

        unchecked {
            patentCounter++;
        }
        uint256 newId = patentCounter;

        patents[newId] = PatentRecord({
            patentId: newId,
            title: title,
            currentOwner: _msgSender(),
            originalInventor: _msgSender(),
            ipfsMetadataURI: ipfsURI,
            metadataHash: metadataHash,
            submissionTimestamp: block.timestamp,
            grantTimestamp: 0,
            expirationTimestamp: 0,
            status: PatentStatus.Submitted
        });

        claims[newId] = JurisdictionClaims({
            usptoStatus: claimUSPTO ? ClaimStatus.Pending : ClaimStatus.None,
            jpoStatus: claimJPO ? ClaimStatus.Pending : ClaimStatus.None,
            epoStatus: claimEPO ? ClaimStatus.Pending : ClaimStatus.None,
            usptoRemarks: "",
            jpoRemarks: "",
            epoRemarks: "",
            lastUpdated: block.timestamp
        });

        _grantRole(INVENTOR_ROLE, _msgSender());

        emit PatentRegistered(newId, _msgSender(), title, metadataHash, ipfsURI);
        return newId;
    }

    /**
     * @notice Review and approve/reject patent claims for USPTO jurisdiction.
     */
    function reviewClaimUSPTO(
        uint256 patentId,
        bool approve,
        string calldata remarks
    ) external onlyRole(USPTO_OFFICER_ROLE) {
        if (patentId == 0 || patentId > patentCounter) revert InvalidPatentId(patentId);
        JurisdictionClaims storage c = claims[patentId];
        if (c.usptoStatus == ClaimStatus.None) revert ClaimNotRequested("USPTO");

        c.usptoStatus = approve ? ClaimStatus.Approved : ClaimStatus.Rejected;
        c.usptoRemarks = remarks;
        c.lastUpdated = block.timestamp;

        _evaluatePatentStatus(patentId);

        emit ClaimUpdated(patentId, "USPTO", c.usptoStatus, _msgSender(), remarks);
    }

    /**
     * @notice Review and approve/reject patent claims for JPO jurisdiction.
     */
    function reviewClaimJPO(
        uint256 patentId,
        bool approve,
        string calldata remarks
    ) external onlyRole(JPO_OFFICER_ROLE) {
        if (patentId == 0 || patentId > patentCounter) revert InvalidPatentId(patentId);
        JurisdictionClaims storage c = claims[patentId];
        if (c.jpoStatus == ClaimStatus.None) revert ClaimNotRequested("JPO");

        c.jpoStatus = approve ? ClaimStatus.Approved : ClaimStatus.Rejected;
        c.jpoRemarks = remarks;
        c.lastUpdated = block.timestamp;

        _evaluatePatentStatus(patentId);

        emit ClaimUpdated(patentId, "JPO", c.jpoStatus, _msgSender(), remarks);
    }

    /**
     * @notice Review and approve/reject patent claims for EPO jurisdiction.
     */
    function reviewClaimEPO(
        uint256 patentId,
        bool approve,
        string calldata remarks
    ) external onlyRole(EPO_OFFICER_ROLE) {
        if (patentId == 0 || patentId > patentCounter) revert InvalidPatentId(patentId);
        JurisdictionClaims storage c = claims[patentId];
        if (c.epoStatus == ClaimStatus.None) revert ClaimNotRequested("EPO");

        c.epoStatus = approve ? ClaimStatus.Approved : ClaimStatus.Rejected;
        c.epoRemarks = remarks;
        c.lastUpdated = block.timestamp;

        _evaluatePatentStatus(patentId);

        emit ClaimUpdated(patentId, "EPO", c.epoStatus, _msgSender(), remarks);
    }

    /**
     * @dev Automatically updates patent lifecycle status to Active once at least one requested office approves.
     */
    function _evaluatePatentStatus(uint256 patentId) internal {
        PatentRecord storage p = patents[patentId];
        JurisdictionClaims storage c = claims[patentId];

        bool anyApproved = (c.usptoStatus == ClaimStatus.Approved ||
                            c.jpoStatus == ClaimStatus.Approved ||
                            c.epoStatus == ClaimStatus.Approved);

        if (anyApproved && p.status != PatentStatus.Active) {
            p.status = PatentStatus.Active;
            p.grantTimestamp = block.timestamp;
            p.expirationTimestamp = block.timestamp + (20 * 365 days); // Standard 20-year term
            emit PatentActivated(patentId, p.expirationTimestamp);
        } else if (!anyApproved && p.status == PatentStatus.Submitted) {
            p.status = PatentStatus.UnderExamination;
        }
    }

    /**
     * @notice Current patent owner initiates an ownership transfer request.
     * @param patentId Patent Identifier
     * @param proposedNewOwner Recipient address
     * @param legalAgreementHash Hash of notarized transfer agreement
     */
    function initiateOwnershipTransfer(
        uint256 patentId,
        address proposedNewOwner,
        string calldata legalAgreementHash
    ) external nonReentrant {
        if (patentId == 0 || patentId > patentCounter) revert InvalidPatentId(patentId);
        if (proposedNewOwner == address(0)) revert ZeroAddress();

        PatentRecord storage p = patents[patentId];
        if (p.currentOwner != _msgSender()) revert NotPatentOwner(patentId, _msgSender());
        if (p.status != PatentStatus.Active) revert InvalidPatentStatus(patentId, p.status);

        p.status = PatentStatus.TransferPending;
        transferRequests[patentId] = TransferRequest({
            proposedOwner: proposedNewOwner,
            legalTransferHash: legalAgreementHash,
            requestTimestamp: block.timestamp,
            active: true
        });

        emit TransferInitiated(patentId, _msgSender(), proposedNewOwner, legalAgreementHash);
    }

    /**
     * @notice WIPO Officer reviews and finalizes the international patent ownership transfer.
     */
    function finalizeOwnershipTransferWIPO(
        uint256 patentId,
        bool approve
    ) external onlyRole(WIPO_OFFICER_ROLE) nonReentrant {
        if (patentId == 0 || patentId > patentCounter) revert InvalidPatentId(patentId);

        PatentRecord storage p = patents[patentId];
        TransferRequest storage req = transferRequests[patentId];

        if (!req.active || p.status != PatentStatus.TransferPending) {
            revert NoPendingTransfer(patentId);
        }

        address previousOwner = p.currentOwner;

        if (approve) {
            p.currentOwner = req.proposedOwner;
            p.status = PatentStatus.Active;
            req.active = false;
            emit TransferFinalized(patentId, previousOwner, req.proposedOwner, _msgSender());
        } else {
            p.status = PatentStatus.Active;
            req.active = false;
        }
    }

    /**
     * @notice High-performance batch getter to eliminate frontend RPC sequential waterfalls.
     */
    function getPatentsBatch(
        uint256 startIndex,
        uint256 pageSize
    ) external view returns (PatentRecord[] memory batch, JurisdictionClaims[] memory claimsBatch) {
        if (startIndex == 0 || startIndex > patentCounter) {
            return (new PatentRecord[](0), new JurisdictionClaims[](0));
        }

        uint256 end = startIndex + pageSize - 1;
        if (end > patentCounter) {
            end = patentCounter;
        }

        uint256 size = end - startIndex + 1;
        batch = new PatentRecord[](size);
        claimsBatch = new JurisdictionClaims[](size);

        for (uint256 i = 0; i < size; i++) {
            uint256 currentId = startIndex + i;
            batch[i] = patents[currentId];
            claimsBatch[i] = claims[currentId];
        }
    }

    /**
     * @notice Public verification endpoint to cryptographically confirm patent authenticity.
     */
    function verifyPatentAuthenticity(
        uint256 patentId,
        bytes32 candidateHash
    ) external view returns (bool isValid, PatentRecord memory record) {
        if (patentId == 0 || patentId > patentCounter) {
            return (false, record);
        }
        record = patents[patentId];
        isValid = (record.metadataHash == candidateHash && record.status != PatentStatus.Revoked);
    }
}
