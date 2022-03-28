import React, { Component } from 'react';
import Web3 from 'web3';
import { Button, Modal } from 'react-bootstrap'
import Patent from '../abis/Patent.json';
import InventorNavbar from './InventorNavbar';

class InventorDashboard extends Component {

    //function that will get called whenever our React component is loaded
    async componentWillMount() {
        await this.loadWeb3()
        await this.loadPendingPatentData()
        await this.loadApprovedPatentData()
    }

    //function that will create the connection
    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        }
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    }

    //fetch the accounts from Metamask
    async loadPendingPatentData() {

        const web3 = window.web3
        // Load account
        const accounts = await web3.eth.getAccounts()
        //store the account to the React state object
        this.setState({ account: accounts[0] })
        const networkId = await web3.eth.net.getId()
        const networkData = Patent.networks[networkId]
        if (networkData) {
            const patent = web3.eth.Contract(Patent.abi, networkData.address)
            this.setState({ patent })
            const patentCount = await patent.methods.patentCount().call()
            this.setState({ patentCount })
            // Load patents
            if (patentCount.toString() === '0') {
                this.setState({
                    showPendingApprovalPatents: false
                });
            }
            else {
                for (var i = 1; i <= patentCount; i++) {
                    const pending_invention_detail = await patent.methods.inventiondetails(i).call()
                    const pending_patent_detail = await patent.methods.patentdetails(i).call()
                    const pending_check_patent_claim = await patent.methods.checkpatentclaims(i).call()
                    const pending_transfer_ownership_detail = await patent.methods.transferownershipdetails(i).call()

                    if (this.state.account === pending_transfer_ownership_detail.owner) {
                        if (pending_patent_detail.patent_status === "Pending Approval") {
                            this.setState({
                                pending_inventiondetails: [...this.state.pending_inventiondetails, pending_invention_detail],
                                pending_patentdetails: [...this.state.pending_patentdetails, pending_patent_detail],
                                pending_checkpatentclaims: [...this.state.pending_checkpatentclaims, pending_check_patent_claim],
                                pending_transferownershipdetails: [...this.state.pending_checkpatentclaims, pending_transfer_ownership_detail],
                            })
                            this.setState({
                                pendingpatentdata: this.state.pending_inventiondetails.map((item, i) => Object.assign({}, item, this.state.pending_patentdetails[i], {}, item, this.state.pending_checkpatentclaims[i], {}, item, this.state.pending_transferownershipdetails[i])),
                                showPendingApprovalPatents: true
                            })
                        }
                    }
                    if (this.state.pendingpatentdata.length === 0) {
                        this.setState({
                            showPendingApprovalPatents: false
                        });
                    }
                    else {
                        this.setState({
                            showPendingApprovalPatents: true
                        });
                    }
                }
            }
            this.setState({ loading: false })
        } else {
            window.alert('Patent contract not deployed to detected network.')
        }
    }

    //fetch the accounts from Metamask
    async loadApprovedPatentData() {

        const web3 = window.web3
        // Load account
        const accounts = await web3.eth.getAccounts()
        //store the account to the React state object
        this.setState({ account: accounts[0] })
        const networkId = await web3.eth.net.getId()
        const networkData = Patent.networks[networkId]
        if (networkData) {
            const patent = web3.eth.Contract(Patent.abi, networkData.address)
            this.setState({ patent })
            const patentCount = await patent.methods.patentCount().call()
            this.setState({ patentCount })
            // Load patents
            if (patentCount.toString() === '0') {
                this.setState({
                    showMyApprovedPatents: false
                });
            }
            else {
                for (var i = 1; i <= patentCount; i++) {
                    const approved_invention_detail = await patent.methods.inventiondetails(i).call()
                    const approved_patent_detail = await patent.methods.patentdetails(i).call()
                    const approved_check_patent_claim = await patent.methods.checkpatentclaims(i).call()
                    const approved_transfer_ownership_detail = await patent.methods.transferownershipdetails(i).call()

                    if (this.state.account === approved_transfer_ownership_detail.owner) {
                        if (approved_patent_detail.patent_status === "Active") {
                            this.setState({
                                approved_inventiondetails: [...this.state.approved_inventiondetails, approved_invention_detail],
                                approved_patentdetails: [...this.state.approved_patentdetails, approved_patent_detail],
                                approved_checkpatentclaims: [...this.state.approved_checkpatentclaims, approved_check_patent_claim],
                                approved_transferownershipdetails: [...this.state.approved_transferownershipdetails, approved_transfer_ownership_detail],
                            })
                            this.setState({
                                myapprovedpatentdata: this.state.approved_inventiondetails.map((item, i) => Object.assign({}, item, this.state.approved_patentdetails[i], {}, item, this.state.approved_checkpatentclaims[i], {}, item, this.state.approved_transferownershipdetails[i])),
                                showMyApprovedPatents: true
                            })
                        }
                    }
                    if (this.state.myapprovedpatentdata.length === 0) {
                        this.setState({
                            showMyApprovedPatents: false
                        });
                    }
                    else {
                        this.setState({
                            showMyApprovedPatents: true
                        });
                    }
                }
            }
            this.setState({ loading: false })
        } else {
            window.alert('Patent contract not deployed to detected network.')
        }
    }

    //set some default values for the state object
    constructor(props) {
        super(props)
        this.state = {
            account: '',
            patentCount: 0,
            pendingpatentdata: [],
            pending_inventiondetails: [],
            pending_patentdetails: [],
            pending_checkpatentclaims: [],
            pending_transferownershipdetails: [],
            myapprovedpatentdata: [],
            approved_inventiondetails: [],
            approved_patentdetails: [],
            approved_checkpatentclaims: [],
            approved_transferownershipdetails: [],
            loading: true,
            showHide: false
        }

        this.registerPatent = this.registerPatent.bind(this)
        this.ownershipTransfer = this.ownershipTransfer.bind(this)

    }

    registerPatent(invention_title, inventor_details, technical_field, technical_problem, technical_solution, invention_description, registered_date, end_date, license_details, renewal_status, patent_status, USPTO, JPO, EPO) {
        this.setState({ loading: true })
        this.state.patent.methods.registerPatent(invention_title, inventor_details, technical_field, technical_problem, technical_solution, invention_description, registered_date, end_date, license_details, renewal_status, patent_status, USPTO, JPO, EPO).send({ from: this.state.account, gas: 4712388, gasPrice: 100000000000 })
            .once('receipt', (receipt) => {
                this.setState({ loading: false })
                setTimeout(window.location.reload(true), 3000)
            })
    }

    ownershipTransfer(patent_id, new_owner, new_owner_details) {
        this.setState({ loading: true })
        this.state.patent.methods.ownershipTransfer(patent_id, new_owner, new_owner_details).send({ from: this.state.account, gas: 4712388, gasPrice: 100000000000 })
            .once('receipt', (receipt) => {
                this.setState({ loading: false })
            })
    }

    handleModalShowHide(patentid) {
        this.setState({ showHide: !this.state.showHide })
        this.setState({ patentid })
    }

    render() {

        const tblStyle = {
            display: 'block',
            overflowX: 'auto',
            overflowY: 'auto',
            whitespace: 'nowrap',
        }

        return (
            <div>
                <InventorNavbar account={this.state.account} />
                <div id="content" style={{ marginTop: '50px' }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 card" style={{ padding: '10px' }}>
                                <h4 className="text-center">Patent Application</h4>
                                <form onSubmit={(event) => {

                                    const current = new Date();
                                    const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;
                                    event.preventDefault()
                                    const invention_title = this.inventionTitle.value
                                    const inventor_details = this.inventorDetails.value
                                    const technical_problem = this.technicalProblem.value
                                    const technical_solution = this.technicalSolution.value
                                    const technical_field = this.technicalField.value
                                    const invention_description = this.inventionDescription.value
                                    const USPTO = this.patentClaimUSPTO.checked
                                    const JPO = this.patentClaimJPO.checked
                                    const EPO = this.patentClaimEPO.checked
                                    const registered_date = date
                                    const end_date = "Pending"
                                    const license_details = "No"
                                    const renewal_status = "Pending"
                                    const patent_status = "Pending Approval"

                                    this.registerPatent(invention_title, inventor_details, technical_field, technical_problem, technical_solution, invention_description, registered_date, end_date, license_details, renewal_status, patent_status, USPTO, JPO, EPO)

                                }}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group mr-sm-2">
                                                <label>Invention Title <span style={{ color: 'red' }}>*</span></label>
                                                <input
                                                    id="inventionTitle"
                                                    type="text"
                                                    ref={(input) => { this.inventionTitle = input }}
                                                    className="form-control"
                                                    required />
                                            </div>
                                            <div className="form-group mr-sm-2">
                                                <label>Inventor Details <span style={{ color: 'red' }}>*</span></label>
                                                <input
                                                    id="inventorDetails"
                                                    type="text"
                                                    ref={(input) => { this.inventorDetails = input }}
                                                    className="form-control"
                                                    required />
                                            </div>
                                            <div className="form-group mr-sm-2">
                                                <label>Patent Claims <span style={{ color: 'red' }}>*</span></label>
                                                <div className="input-group">
                                                    <label>USPTO</label>
                                                    <input
                                                        id="patentClaimUSPTO"
                                                        type="checkbox"
                                                        ref={(input) => { this.patentClaimUSPTO = input }}
                                                        className="form-control"
                                                    />
                                                    <label>JPO</label>
                                                    <input
                                                        id="patentClaimJPO"
                                                        type="checkbox"
                                                        ref={(input) => { this.patentClaimJPO = input }}
                                                        className="form-control"
                                                    />
                                                    <label>EPO</label>
                                                    <input
                                                        id="patentClaimEPO"
                                                        type="checkbox"
                                                        ref={(input) => { this.patentClaimEPO = input }}
                                                        className="form-control"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group mr-sm-2">
                                                <label>Technical Problem <span style={{ color: 'red' }}>*</span></label>
                                                <input
                                                    id="technicalProblem"
                                                    type="text"
                                                    ref={(input) => { this.technicalProblem = input }}
                                                    className="form-control"
                                                    required />
                                            </div>
                                            <div className="form-group mr-sm-2">
                                                <label>Technical Solution <span style={{ color: 'red' }}>*</span></label>
                                                <input
                                                    id="technicalSolution"
                                                    type="text"
                                                    ref={(input) => { this.technicalSolution = input }}
                                                    className="form-control"
                                                    required />
                                            </div>
                                            <div className="form-group mr-sm-2">
                                                <label>Technical Field <span style={{ color: 'red' }}>*</span></label>
                                                <select
                                                    id="technicalField"
                                                    type="text"
                                                    ref={(input) => { this.technicalField = input }}
                                                    className="form-control"
                                                    required >
                                                    <option defaultValue>Select the Technical Field</option>
                                                    <option value="Process Automation">Process Automation</option>
                                                    <option value="Aeronautics">Aeronautics</option>
                                                    <option value="Chemistry">Chemistry</option>
                                                    <option value="Medical devices">Medical devices</option>
                                                    <option value="Prosthetics and orthotics">Prosthetics and orthotics</option>
                                                    <option value="Agri-business">Agri-business</option>

                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-group mr-sm-2">
                                                <label>Invention Description <span style={{ color: 'red' }}>*</span></label>
                                                <input
                                                    id="inventionDescription"
                                                    type="text"
                                                    rows="3"
                                                    ref={(input) => { this.inventionDescription = input }}
                                                    className="form-control"
                                                    style={{ height: '60px' }}
                                                    required />
                                            </div>
                                            <button type="submit" className="btn btn-primary" style={{ marginLeft: '25%', width: '50%' }}>Submit</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>


                    <div id="PendingPatents">
                        {this.state.loading
                            ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                            : <div>
                                <div className="container-fluid" style={{ display: this.state.showPendingApprovalPatents ? "block" : "none", marginTop: '30px' }}>
                                    <div className="row">
                                        <div className="col" id="registered_patents_div">
                                            <h4 className="text-center bg-success" style={{ paddingTop: '10px', paddingBottom: '10px' }}>My Pending Approval Patents</h4>
                                            <table className="table table-bordered table-hover" style={tblStyle}>
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Invention Title</th>
                                                        <th>Inventor Details</th>
                                                        <th>Inventor</th>
                                                        <th>Owner</th>
                                                        <th>Owner Details</th>
                                                        <th>Technical Field</th>
                                                        <th>Technical Problem</th>
                                                        <th>Technical Solution</th>
                                                        <th>Invention Description</th>
                                                        <th>USPTO Approval</th>
                                                        <th>JPO Approval</th>
                                                        <th>Registered Date</th>
                                                        <th>End Date</th>
                                                        <th>License Details</th>
                                                        <th>Renewal Details</th>
                                                        <th>Patent Status</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody id="patentList">
                                                    {this.state.pendingpatentdata.map((i, key) => {
                                                        return (
                                                            <tr key={key}>
                                                                <td>{i.patent_id.toString()}</td>
                                                                <td>{i.invention_title}</td>
                                                                <td>{i.inventor_details}</td>
                                                                <td>{i.inventor}</td>
                                                                <td>{i.owner}</td>
                                                                <td>{i.owner_details}</td>
                                                                <td>{i.technical_field}</td>
                                                                <td>{i.technical_problem}</td>
                                                                <td>{i.technical_solution}</td>
                                                                <td>{i.invention_description}</td>
                                                                <td>{i.USPTO_Approval}</td>
                                                                <td>{i.JPO_Approval}</td>
                                                                <td>{i.registered_date}</td>
                                                                <td>{i.end_date}</td>
                                                                <td>{i.license_details}</td>
                                                                <td>{i.renewal_status}</td>
                                                                <td style={{ color: 'green', fontWeight: 'bold' }}>{i.patent_status}</td>
                                                                <td>
                                                                    {i.USPTO
                                                                        ? <button
                                                                            name={i.patent_id}
                                                                            className="btn btn-success"
                                                                        >
                                                                            Edit Details
                                                                        </button>
                                                                        : null
                                                                    }
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>

                    <div id="ApprovedPatents">
                        {this.state.loading
                            ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                            : <div>
                                <div className="container-fluid" style={{ display: this.state.showMyApprovedPatents ? "block" : "none", marginTop: '30px' }}>
                                    <div className="row">
                                        <div className="col" id="registered_patents_div">
                                            <h4 className="text-center bg-success" style={{ paddingTop: '10px', paddingBottom: '10px' }}>My Approved Patents</h4>
                                            <table className="table table-bordered table-hover" style={tblStyle}>
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Invention Title</th>
                                                        <th>Inventor Details</th>
                                                        <th>Inventor</th>
                                                        <th>Owner</th>
                                                        <th>Owner Details</th>
                                                        <th>Technical Field</th>
                                                        <th>Technical Problem</th>
                                                        <th>Technical Solution</th>
                                                        <th>Invention Description</th>
                                                        <th>USPTO Approval</th>
                                                        <th>JPO Approval</th>
                                                        <th>Registered Date</th>
                                                        <th>End Date</th>
                                                        <th>License Details</th>
                                                        <th>Renewal Details</th>
                                                        <th>Patent Status</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody id="patentList">
                                                    {this.state.myapprovedpatentdata.map((i, key) => {
                                                        return (
                                                            <tr key={key}>
                                                                <td>{i.patent_id.toString()}</td>
                                                                <td>{i.invention_title}</td>
                                                                <td>{i.inventor_details}</td>
                                                                <td>{i.inventor}</td>
                                                                <td>{i.owner}</td>
                                                                <td>{i.owner_details}</td>
                                                                <td>{i.technical_field}</td>
                                                                <td>{i.technical_problem}</td>
                                                                <td>{i.technical_solution}</td>
                                                                <td>{i.invention_description}</td>
                                                                <td>{i.USPTO_Approval}</td>
                                                                <td>{i.JPO_Approval}</td>
                                                                <td>{i.registered_date}</td>
                                                                <td>{i.end_date}</td>
                                                                <td>{i.license_details}</td>
                                                                <td>{i.renewal_status}</td>
                                                                <td style={{ color: 'green', fontWeight: 'bold' }}>{i.patent_status}</td>
                                                                <td>
                                                                    {i.transfer_ownership
                                                                        ? <button
                                                                            name={i.patent_id}
                                                                            className="btn btn-success"
                                                                            onClick={(event) => {
                                                                                this.handleModalShowHide(event.target.name)
                                                                            }}
                                                                        >
                                                                            Transfer Ownership
                                                                        </button>
                                                                        : null
                                                                    }
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>

                    <div>
                        <Modal show={this.state.showHide}>
                            <Modal.Header closeButton onClick={() => this.handleModalShowHide(this.state.patentid)}>
                                <Modal.Title><h4 className="text-center">Transfer Patent Ownership</h4></Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form onSubmit={(event) => {

                                    event.preventDefault()
                                    const patent_id = this.patentID.value
                                    const new_owner = this.newOwner.value
                                    const new_owner_details = this.newOwnerDetails.value

                                    this.ownershipTransfer(patent_id, new_owner, new_owner_details)

                                }}>
                                    <div className="row">
                                        <div className="col">
                                            <div className="form-group mr-sm-2">
                                                <label>Patent ID<span style={{ color: 'red' }}>*</span></label>
                                                <input
                                                    id="patentID"
                                                    type="text"
                                                    value={this.state.patentid}
                                                    ref={(input) => { this.patentID = input }}
                                                    className="form-control"
                                                    readOnly
                                                    required />
                                            </div>
                                            <div className="form-group mr-sm-2">
                                                <label>New Owner<span style={{ color: 'red' }}>*</span></label>
                                                <input
                                                    id="newOwner"
                                                    type="text"
                                                    ref={(input) => { this.newOwner = input }}
                                                    className="form-control"
                                                    required />
                                            </div>
                                            <div className="form-group mr-sm-2">
                                                <label>New Owner Details<span style={{ color: 'red' }}>*</span></label>
                                                <input
                                                    id="newOwnerDetails"
                                                    type="text"
                                                    ref={(input) => { this.newOwnerDetails = input }}
                                                    className="form-control"
                                                    required />
                                            </div>
                                            <button type="submit" className="btn btn-success" style={{ marginLeft: '25%', width: '50%' }}>Submit</button>
                                        </div>
                                    </div>
                                </form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => this.handleModalShowHide(this.state.patentid)}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>

                    </div>
                </div>
            </div>
        );
    }
}

export default InventorDashboard;