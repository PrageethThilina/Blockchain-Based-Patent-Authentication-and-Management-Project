pragma solidity >=0.5.0;

// Smart Contract
// Use truffle compile to compile the smart contract
// use truffle migrate --reset comand to create a new copy of the smart contract on the blockchain
// Use truffle test to run test
contract Patent {

    // keep track of how many patents exist in the smart contract
    uint public patentCount = 0;


    // create and map to store this invention data on the blockchain, use an id as a key, and the value will be a Invention struct
    mapping(uint => InventionDetails) public inventiondetails;

    // Invention Details data structure(stores all the attributes of a Invention)
    struct InventionDetails{
        uint patent_id;
        string invention_title;
        string inventor_details;
        address inventor;
        string technical_field;
        string technical_problem;
		string technical_solution;
        string invention_description;
    }


    // create and map to store this patent data on the blockchain, use an id as a key, and the value will be a Patent Details struct
    mapping(uint => PatentDetails) public patentdetails;

    // Patent Details data structure(stores all the attributes of a Patent details)
    struct PatentDetails{
        uint patent_id;
        string registered_date;
        string end_date;
        string license_details;
        string renewal_status;
        string patent_status;
    }

    // create and map to store this checking patent claims data on the blockchain, use an id as a key, and the value will be a Check Patent claims struct
    mapping(uint => checkPatentClaims) public checkpatentclaims;

    // Check Patent Claims data structure(stores all the checking Patent claims)
    struct checkPatentClaims{
        uint patent_id;
        bool USPTO;
        bool JPO;
        bool EPO;
        string USPTO_Approval;
        string JPO_Approval;
        string EPO_Approval;
    }

    // create and map to store this checking patent claims data on the blockchain, use an id as a key, and the value will be a Check Patent claims struct
    mapping(uint => transferOwnershipDetails) public transferownershipdetails;

    // Check Patent Claims data structure(stores all the checking Patent claims)
    struct transferOwnershipDetails{
        uint patent_id;
        bool transfer_ownership;
        string new_owner;
        string new_owner_details;
    }

    // Event after adding invention details
    event addInventionDetails(
        string invention_title,
        string inventor_details,
        address inventor,
        string technical_field,
        string technical_problem,
		string technical_solution,
        string invention_description
    );

    // Event after adding patent details
    event addPatentDetails(  
        uint patent_id,
        string registered_date,
        string end_date,
        string license_details,
        string renewal_status,
        string patent_status
    );

    // Event after adding patent claims
    event addCheckPatentClaims(  
        bool USPTO,
        bool JPO,
        bool EPO,
        string USPTO_Approval,
        string JPO_Approval,
        string EPO_Approval
    );

    // Event after adding patent claims
    event addTransferOwnershipDetails(  
        bool transfer_ownership,
        string new_owner,
        string new_owner_details
    );

    // Function for register a patent
    function registerPatent(string memory _invention_title, string memory _inventor_details, string memory _technical_field, string memory _technical_problem, string memory _technical_solution, string memory _invention_description, string memory _registered_date, string memory _end_date, string memory _license_details, string memory _renewal_status, string memory _patent_status, bool _USPTO, bool _JPO, bool _EPO) public {
        // Require a valid  invention title
        require(bytes(_invention_title).length > 0, "Require invention title");
        // Require a valid  inventor details
        require(bytes(_inventor_details).length > 0, "Require inventor details");
        // Require a valid  technical field description
        require(bytes(_technical_field).length > 0, "Require technical field description");
        // Require a valid  Technical Problem Details
        require(bytes(_technical_problem).length > 0, "Require technical problem");
        // Require a valid  Technical solution details
        require(bytes(_technical_solution).length > 0, "Require technical solution");
        // Require a valid  invention description details
        require(bytes(_invention_description).length > 0, "Require invention description");      

        // Increment product count
        patentCount ++;

        handlePatentClaims(_USPTO, _JPO, _EPO);

        // Add Invention details
        inventiondetails[patentCount] = InventionDetails(patentCount, _invention_title, _inventor_details, msg.sender, _technical_field, _technical_problem, _technical_solution, _invention_description);
        // Add Patent details
        patentdetails[patentCount] = PatentDetails(patentCount, _registered_date, _end_date, _license_details, _renewal_status, _patent_status);
        // Update the patent end data and status
        checkOwnershipTransfer(patentCount);

        // Trigger an event
        emit addInventionDetails(_invention_title, _inventor_details, msg.sender, _technical_field, _technical_problem, _technical_solution, _invention_description);
        // Trigger an event
        emit addPatentDetails(patentCount, _registered_date, _end_date, _license_details, _renewal_status, _patent_status);
    }

    //Function for handle patent claims
    function handlePatentClaims(bool _USPTO, bool _JPO, bool _EPO) public {

        string memory _USPTO_Status;
        string memory _JPO_Status;
        string memory _EPO_Status;

        if(_USPTO == true){
            _USPTO_Status = "Pending";
        }
        else{
            _USPTO_Status = "NULL";
        }
        if(_JPO == true){
            _JPO_Status = "Pending";
        }
        else{
            _JPO_Status = "NULL";
        }
        if(_EPO == true){
            _EPO_Status = "Pending";
        }
        else{
            _EPO_Status = "NULL";
        }

        // Add Patent check patent claims details
        checkpatentclaims[patentCount] = checkPatentClaims(patentCount, _USPTO, _JPO, _EPO, _USPTO_Status, _JPO_Status, _EPO_Status);

        // Trigger an event
        emit addCheckPatentClaims(_USPTO, _JPO, _EPO, _USPTO_Status, _JPO_Status, _EPO_Status);
    }

     function checkOwnershipTransfer(uint patent_id) public {
        transferOwnershipDetails memory transferownershipdetail = transferownershipdetails[patent_id];
        transferownershipdetails[patent_id] = transferOwnershipDetails(patent_id, transferownershipdetail.transfer_ownership, transferownershipdetail.new_owner, transferownershipdetail.new_owner_details);
     }

    function acceptPatentApplicationByUSPTO(uint patent_id) public {
        // Fetch the Invention Details
        InventionDetails memory inventiondetail = inventiondetails[patent_id];
        // Fetch the Patent Details
        checkPatentClaims memory checkpatentclaim = checkpatentclaims[patent_id];
        // Fetch the patent owner
        address _inventor = inventiondetail.inventor;
        // Make sure the patent has a valid id
        require(inventiondetail.patent_id > 0 && inventiondetail.patent_id <= patentCount);
        // Require that the patent has not been accepted already
        require(checkpatentclaim.USPTO);
        // Require that the patent examiner is not the inventor
        require(_inventor != msg.sender);
        // Mark as approved by USPTO
        checkpatentclaim.USPTO_Approval = "Approved";
        // Update the product
        checkpatentclaims[patent_id] = checkpatentclaim;
        // Trigger an event
        emit addCheckPatentClaims(checkpatentclaim.USPTO, checkpatentclaim.JPO, checkpatentclaim.EPO, checkpatentclaim.USPTO_Approval, checkpatentclaim.JPO_Approval, checkpatentclaim.EPO_Approval);
    }
    
    function acceptPatentApplicationByJPO(uint patent_id, string memory _end_date) public {
        // Fetch the Invention Details
        InventionDetails memory inventiondetail = inventiondetails[patent_id];
        // Fetch the Patent Details
        PatentDetails memory patentdetail = patentdetails[patent_id];
        // Fetch the Patent Claim Details
        checkPatentClaims memory checkpatentclaim = checkpatentclaims[patent_id];
        // Fetch the Patent ownership Details
        transferOwnershipDetails memory transferownershipdetail = transferownershipdetails[patent_id];
        // Fetch the patent owner
        address _inventor = inventiondetail.inventor;
        // Make sure the patent has a valid id
        require(inventiondetail.patent_id > 0 && inventiondetail.patent_id <= patentCount);
        // Require that the patent has not been accepted already
        require(checkpatentclaim.JPO);
        // Require that the patent examiner is not the inventor
        require(_inventor != msg.sender);

        // Mark as approved by JPO
        checkpatentclaim.JPO_Approval = "Approved";
        patentdetail.end_date = _end_date;
        patentdetail.renewal_status = "Active";
        patentdetail.patent_status = "Active";
        transferownershipdetail.transfer_ownership = true;
        transferownershipdetail.new_owner = "-";
        transferownershipdetail.new_owner_details = "-";

        // Update the patent claims
        checkpatentclaims[patent_id] = checkpatentclaim;
        // Update the patent end data and status
        patentdetails[patent_id] = patentdetail;
        // Update the patent end data and status
        transferownershipdetails[patent_id] = transferownershipdetail;
        // Trigger an event
        emit addCheckPatentClaims(checkpatentclaim.USPTO, checkpatentclaim.JPO, checkpatentclaim.EPO, checkpatentclaim.USPTO_Approval, checkpatentclaim.JPO_Approval, checkpatentclaim.EPO_Approval);
    }

    function ownershipTransfer(uint patent_id, string memory _new_owner, string memory _new_owner_details) public {

        // Fetch the Invention Details
        InventionDetails memory inventiondetail = inventiondetails[patent_id];
         // Fetch the Patent ownership Details
        transferOwnershipDetails memory transferownershipdetail = transferownershipdetails[patent_id];

        // Fetch the patent owner
        address _inventor = inventiondetail.inventor;
        // Make sure the patent has a valid id
        require(inventiondetail.patent_id > 0 && inventiondetail.patent_id <= patentCount);
        // Require that the patent has not been accepted already
        require(transferownershipdetail.transfer_ownership);
        // Require that the patent examiner is not the inventor
        require(_inventor == msg.sender);

        transferownershipdetail.new_owner = _new_owner;
        transferownershipdetail.new_owner_details = _new_owner_details;

        // Update the patent end data and status
        transferownershipdetails[patent_id] = transferownershipdetail;
    }
}