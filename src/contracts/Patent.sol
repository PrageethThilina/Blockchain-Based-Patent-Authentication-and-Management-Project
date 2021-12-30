pragma solidity ^0.5.0;

// Smart Contract
// Use truffle compile to compile the smart contract
// use truffle migrate --reset comand to create a new copy of the smart contract on the blockchain
// Use truffle test to run test
contract Patent {

    string public name;
    // keep track of how many patents exist in the smart contract
    uint public patentCount = 0;
    // create and map to store this patent data on the blockchain, use an id as a key, and the value will be a Patent struct
    mapping(uint => PatentDetail) public patentdetails;

    // Patent Details data structure(stores all the attributes of a patent)
    struct PatentDetail{
        uint patent_id;
        string invention_title;
        string inventor_details;
        address inventor;
        string patent_claims;
        string invention_description;
        uint registereddate;
        uint expdate;
        bool renewal_status;
        bool patent_status;
    }
     // Event after registered patent
    event PatentRegistered(
        uint patent_id,
        string invention_title,
        string inventor_details,
        address inventor,
        string patent_claims,
        string invention_description,
        uint registereddate,
        uint expdate,
        bool renewal_status,
        bool patent_status
    );


    constructor() public {
        name = "Dapp University Marketplace";
    }

    // Function for register a patent
    function registerPatent(string memory _invention_title, string memory _inventor_details, string memory _invention_description, string memory _patent_claims, uint _registereddate, uint _expdate) public {
        // Require a valid  invention title
        require(bytes(_invention_title).length > 0, "Require a valid  invention title");
        // Require a valid  inventor details
        require(bytes(_inventor_details).length > 0, "Require a valid  inventor details");
        // Require a valid  technical field description
        require(bytes(_invention_description).length > 0, "Require a valid  technical field description");
        // Require a valid  patent claims
        require(bytes(_patent_claims).length > 0, "Require a valid  patent claims");
        // Increment product count
        patentCount ++;
        // Add patent details
        patentdetails[patentCount] = PatentDetail(patentCount, _invention_title, _inventor_details, msg.sender, _invention_description, _patent_claims, _registereddate, _expdate, false, false);
        // Trigger an event
        emit PatentRegistered(patentCount, _invention_title, _inventor_details, msg.sender, _invention_description, _patent_claims, _registereddate, _expdate, false, false);
    }

}