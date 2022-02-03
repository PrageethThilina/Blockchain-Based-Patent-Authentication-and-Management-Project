pragma solidity >=0.5.0;

// Smart Contract
// Use truffle compile to compile the smart contract
// use truffle migrate --reset comand to create a new copy of the smart contract on the blockchain
// Use truffle test to run test
contract Patent {

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

    // create and map to store this patent data on the blockchain, use an id as a key, and the value will be a Patent Claims struct
    mapping(uint => PatentDetails) public patentdetails;

    // Patent Claims data structure(stores all the attributes of a Patent claims)
    struct PatentClaims{
        uint patent_id;
        bool USPTO;
        bool JPO;
        bool EPO;
    }

    // create and map to store this patent claims data on the blockchain, use an id as a key, and the value will be a Patent struct
    mapping(uint => PatentClaims) public patentclaims;

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
    event addPatentClaims(  
        bool USPTO,
        bool JPO,
        bool EPO
    );

    // Function for register a patent
    function registerPatent(string memory _invention_title, string memory _inventor_details, string memory _technical_field, string memory _technical_problem, string memory _technical_solution, string memory _invention_description, bool _USPTO, bool _JPO, bool _EPO, string memory _registered_date, string memory _end_date, string memory _license_details, string memory _renewal_status, string memory _patent_status) public {
        // Require a valid  invention title
        require(bytes(_invention_title).length > 0, "Require a valid  invention title");
        // Require a valid  inventor details
        require(bytes(_inventor_details).length > 0, "Require a valid  inventor details");
        // Require a valid  technical field description
        require(bytes(_technical_field).length > 0, "Require a valid  technical field description");
        // Require a valid  Technical Problem Details
        require(bytes(_technical_problem).length > 0, "Require a valid  patent claims");
        // Require a valid  Technical solution details
        require(bytes(_technical_solution).length > 0, "Require a valid  patent claims");
        // Require a valid  invention description details
        require(bytes(_invention_description).length > 0, "Require a valid  patent claims");
        // Increment product count
        patentCount ++;
        // Add Invention details
        inventiondetails[patentCount] = InventionDetails(patentCount, _invention_title, _inventor_details, msg.sender, _technical_field, _technical_problem, _technical_solution, _invention_description);
        // Add Patent details
        patentdetails[patentCount] = PatentDetails(patentCount, _registered_date, _end_date, _license_details, _renewal_status, _patent_status);
        // Add Patent claimsdetails
        patentclaims[patentCount] = PatentClaims(patentCount, _USPTO, _JPO, _EPO);
        // Trigger an event
        emit addInventionDetails(_invention_title, _inventor_details, msg.sender, _technical_field, _technical_problem, _technical_solution, _invention_description);
        // Trigger an event
        emit addPatentDetails(patentCount, _registered_date, _end_date, _license_details, _renewal_status, _patent_status);
        // Trigger an event
        emit addPatentClaims(_USPTO, _JPO, _EPO);
    }

}