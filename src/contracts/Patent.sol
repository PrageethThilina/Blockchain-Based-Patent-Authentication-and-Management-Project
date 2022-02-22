pragma solidity >=0.5.0;

// Smart Contract
// Use truffle compile to compile the smart contract
// use truffle migrate --reset comand to create a new copy of the smart contract on the blockchain
// Use truffle test to run test
contract Patent {

    // address public uspto_examiner; 
        
    // constructor() public {
    //     uspto_examiner = msg.sender; 
    // }
    
    // modifier onlyExaminer() { 
    //     require(msg.sender == uspto_examiner, "Action can only be performed by Patent Examiner");
    //     _;
    // }

    // keep track of how many patents exist in the smart contract
    uint public patentCount = 0;

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

    // create and map to store this invention data on the blockchain, use an id as a key, and the value will be a Invention struct
    mapping(uint => InventionDetails) public inventiondetails;

    // Patent Details data structure(stores all the attributes of a Patent details)
    struct PatentDetails{
        uint patent_id;
        string registered_date;
        string end_date;
        string license_details;
        string renewal_status;
        string patent_status;
    }

    // create and map to store this patent data on the blockchain, use an id as a key, and the value will be a Patent Details struct
    mapping(uint => PatentDetails) public patentdetails;

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
    mapping(uint => checkPatentClaims) public checkpatentclaims;

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

        // Trigger an event
        emit addInventionDetails(_invention_title, _inventor_details, msg.sender, _technical_field, _technical_problem, _technical_solution, _invention_description);
        // Trigger an event
        emit addPatentDetails(patentCount, _registered_date, _end_date, _license_details, _renewal_status, _patent_status);
    }

     // Function for handle patent claims
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

    // function acceptPatentApplicationByUSPTO(uint patent_id) {
    //     // Fetch the Invention Details
    //     InventionDetails memory inventiondetail = inventiondetails[patent_id];
    //     // Fetch the Patent Details
    //     PatentDetails memory patentdetail = patentdetails[patent_id];
    //     // Fetch the Patent Details
    //     PatentClaims memory patentclaim = patentclaims[patent_id];
    //     // Fetch the patent owner
    //     address _inventor = inventiondetail.inventor;
    //     // Make sure the patent has a valid id
    //     require(inventiondetail.patent_id > 0 && inventiondetail.patent_id <= patentCount);
    //     // Require that the product has not been accepted already
    //     require(!patentclaim.USPTO);
    //     // Require that the buyer is not the seller
    //     require(_inventor != msg.sender);
    //     // Transfer ownership to the buyer
    //     inventiondetail.owner = msg.sender;
    //     // Mark as purchased
    //     inventiondetail.purchased = true;
    //     // Update the product
    //     products[_id] = inventiondetail;
    //     // Pay the seller by sending them Ether
    //     address(_inventor).transfer(msg.value);
    //     // Trigger an event
    //     emit ProductPurchased(productCount, inventiondetail.name, inventiondetail.price, msg.sender, true);
    // }

}