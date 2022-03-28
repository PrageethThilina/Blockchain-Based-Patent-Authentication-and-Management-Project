import React, { Component } from 'react';
import Web3 from 'web3';
import Patent from '../abis/Patent.json';
import WipoNavbar from './WipoNavbar';

class WipoDashboard extends Component {

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
                    showPendingApprovalPatents: false,
                    emptyPendingResults: true
                });
            }
            else {
                for (var i = 1; i <= patentCount; i++) {
                    const pending_invention_detail = await patent.methods.inventiondetails(i).call()
                    const pending_patent_detail = await patent.methods.patentdetails(i).call()
                    const pending_check_patent_claim = await patent.methods.checkpatentclaims(i).call()
                    const pending_transfer_ownership_detail = await patent.methods.transferownershipdetails(i).call()

                    if (this.state.account === "0xB444f386DaE8baC4Cdc508385331214F5aBC8d31") {
                        if (pending_patent_detail.patent_status === "Pending Approval") {
                            if (pending_transfer_ownership_detail.transfer_ownership === true) {
                                this.setState({
                                    pending_inventiondetails: [...this.state.pending_inventiondetails, pending_invention_detail],
                                    pending_patentdetails: [...this.state.pending_patentdetails, pending_patent_detail],
                                    pending_checkpatentclaims: [...this.state.pending_checkpatentclaims, pending_check_patent_claim],
                                    pending_transferownershipdetails: [...this.state.pending_checkpatentclaims, pending_transfer_ownership_detail],
                                })
                                this.setState({
                                    pendingpatentdata: this.state.pending_inventiondetails.map((item, i) => Object.assign({}, item, this.state.pending_patentdetails[i], {}, item, this.state.pending_checkpatentclaims[i], {}, item, this.state.pending_transferownershipdetails[i])),
                                    showPendingApprovalPatents: true,
                                    emptyPendingResults: false
                                });
                            }
                        }
                    }
                    if (this.state.pendingpatentdata.length === 0) {
                        this.setState({
                            showPendingApprovalPatents: false,
                            emptyPendingResults: true
                        });
                    }
                    else {
                        this.setState({
                            showPendingApprovalPatents: true,
                            emptyPendingResults: false
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
                    showApprovedPatents: false,
                    emptyApprovedResults: true
                });
            }
            else {
                for (var i = 1; i <= patentCount; i++) {
                    const approved_invention_detail = await patent.methods.inventiondetails(i).call()
                    const approved_patent_detail = await patent.methods.patentdetails(i).call()
                    const approved_check_patent_claim = await patent.methods.checkpatentclaims(i).call()
                    const approved_transfer_ownership_detail = await patent.methods.transferownershipdetails(i).call()

                    if (this.state.account === "0xB444f386DaE8baC4Cdc508385331214F5aBC8d31") {
                        if (approved_patent_detail.patent_status === "Active") {
                            if (approved_transfer_ownership_detail.transfer_ownership === true) {
                                this.setState({
                                    approved_inventiondetails: [...this.state.approved_inventiondetails, approved_invention_detail],
                                    approved_patentdetails: [...this.state.approved_patentdetails, approved_patent_detail],
                                    approved_checkpatentclaims: [...this.state.approved_checkpatentclaims, approved_check_patent_claim],
                                    approved_transferownershipdetails: [...this.state.approved_transferownershipdetails, approved_transfer_ownership_detail],
                                })
                                this.setState({
                                    approvedpatentdata: this.state.approved_inventiondetails.map((item, i) => Object.assign({}, item, this.state.approved_patentdetails[i], {}, item, this.state.approved_checkpatentclaims[i])),
                                    showApprovedPatents: true,
                                    emptyApprovedResults: false
                                });
                            }
                        }
                    }
                    if (this.state.approvedpatentdata.length === 0) {
                        this.setState({
                            showApprovedPatents: false,
                            emptyApprovedResults: true
                        });
                    }
                    else {
                        this.setState({
                            showApprovedPatents: true,
                            emptyApprovedResults: false
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
            approvedpatentdata: [],
            approved_inventiondetails: [],
            approved_patentdetails: [],
            approved_checkpatentclaims: [],
            approved_transferownershipdetails: [],
            loading: true
        }

        this.acceptOwnershipTransferByWipo = this.acceptOwnershipTransferByWipo.bind(this)

    }

    acceptOwnershipTransferByWipo(patent_id) {
        this.setState({ loading: true })
        this.state.patent.methods.acceptOwnershipTransferByWipo(patent_id).send({ from: this.state.account, gas: 5000000, gasPrice: 200000000000 })
            .once('receipt', (receipt) => {
                this.setState({ loading: false })
            })
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
                <WipoNavbar account={this.state.account} />
                <div id="content" style={{ marginTop: '60px' }}>
                    <div id="WipoPendingPatents">
                        {this.state.loading
                            ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                            : <div>
                                <p className="text-center bg-danger" style={{ display: this.state.emptyPendingResults ? "block" : "none", marginTop: '50px', paddingTop: '15px', paddingBottom: '15px', fontWeight: 'bold', fontSize: '20px' }}>No Pending Approvals...</p>
                                <div className="container-fluid" style={{ display: this.state.showPendingApprovalPatents ? "block" : "none", marginTop: '30px' }}>
                                    <div className="row">
                                        <div className="col" id="registered_patents_div">
                                            <h4 className="text-center bg-success" style={{ paddingTop: '10px', paddingBottom: '10px' }}>Approval Pending Patents</h4>
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
                                                                    {i.transfer_ownership
                                                                        ? <button
                                                                            name={i.patent_id}
                                                                            className="btn btn-success"
                                                                            onClick={(event) => {
                                                                                this.acceptOwnershipTransferByWipo(event.target.name)
                                                                            }}
                                                                        >
                                                                            Accept
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

                    <div id="WipoApprovedPatents">
                        {this.state.loading
                            ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                            : <div>
                                <p className="text-center bg-danger" style={{ display: this.state.emptyApprovedResults ? "block" : "none", marginTop: '50px', paddingTop: '15px', paddingBottom: '15px', fontWeight: 'bold', fontSize: '20px' }}>No Approved Patents...</p>
                                <div className="container-fluid" style={{ display: this.state.showApprovedPatents ? "block" : "none", marginTop: '30px' }}>
                                    <div className="row">
                                        <div className="col" id="registered_patents_div">
                                            <h4 className="text-center bg-success" style={{ paddingTop: '10px', paddingBottom: '10px' }}>Approved Patents</h4>
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
                                                    </tr>
                                                </thead>
                                                <tbody id="patentList">
                                                    {this.state.approvedpatentdata.map((i, key) => {
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
                </div>
            </div>
        );
    }
}

export default WipoDashboard;