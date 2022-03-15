import React, { Component } from 'react';
import Web3 from 'web3';
import Patent from '../abis/Patent.json';
import JpoNavbar from './JpoNavbar';

class JpoDashboard extends Component {

  //function that will get called whenever our React component is loaded
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
    await this.loadRegisteredPatents()
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
  async loadBlockchainData() {

    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    //store the account to the React state object
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Patent.networks[networkId]

    const current = new Date();
    const enddate = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear() + 20}`;
    this.setState({ enddate })

    if (networkData) {
      const patent = web3.eth.Contract(Patent.abi, networkData.address)
      this.setState({ patent })
      const patentCount = await patent.methods.patentCount().call()
      this.setState({ patentCount })
      // Load patents
      for (var i = 1; i <= patentCount; i++) {
        const invention_detail = await patent.methods.inventiondetails(i).call()
        const patent_detail = await patent.methods.patentdetails(i).call()
        const check_patent_claim = await patent.methods.checkpatentclaims(i).call()
        const transfer_ownership_detail = await patent.methods.transferownershipdetails(i).call()

        this.setState({
          inventiondetails: [...this.state.inventiondetails, invention_detail],
          patentdetails: [...this.state.patentdetails, patent_detail],
          checkpatentclaims: [...this.state.checkpatentclaims, check_patent_claim],
          transferownershipdetails: [...this.state.transferownershipdetails, transfer_ownership_detail],
          dataarr: this.state.inventiondetails.map((item, i) => Object.assign({}, item, this.state.patentdetails[i], {}, item, this.state.checkpatentclaims[i], {}, item, this.state.transferownershipdetails[i]))
        })
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
      dataarr: [],
      patentCount: 0,
      inventiondetails: [],
      patentdetails: [],
      checkpatentclaims: [],
      transferownershipdetails: [],
      loading: true
    }

    this.acceptPatentApplicationByJPO = this.acceptPatentApplicationByJPO.bind(this)

  }

  acceptPatentApplicationByJPO(patent_id, end_date) {
    this.setState({ loading: true })
    this.state.patent.methods.acceptPatentApplicationByJPO(patent_id, end_date).send({ from: this.state.account, gas: 5000000, gasPrice: 200000000000 })
      .once('receipt', (receipt) => {
        this.setState({ loading: false })
      })
  }

  async loadRegisteredPatents() {
    this.patentcount = this.state.patentCount.toString()
    if (this.patentcount === '0' || this.patentcount === '1') {

      this.setState({
        showResults: false,
        emptyResults: true
      });
    }
    else {
      this.setState({
        showResults: true,
        emptyResults: false
      });
    }
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
        <JpoNavbar account={this.state.account} />
        <div id="content" style={{ marginTop: '60px' }}>
          <main role="main">
            {this.state.loading
              ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
              : <div>
                <p className="text-center" style={{ display: this.state.emptyResults ? "block" : "none", marginTop: '50px' }}>No Pending Approvals...</p>
                <div className="container-fluid" style={{ display: this.state.showResults ? "block" : "none", marginTop: '30px' }}>
                  <div className="row">
                    <div className="col" id="registered_patents_div">
                      <h4 className="text-center">Approval Pending Patents</h4>
                      <table className="table table-bordered table-hover" style={tblStyle}>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Invention Title</th>
                            <th>Inventor Details</th>
                            <th>Inventor</th>
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
                          {this.state.dataarr.map((i, key) => {
                            return (
                              <tr key={key}>
                                <th>{i.patent_id.toString()}</th>
                                <td>{i.invention_title}</td>
                                <td>{i.inventor_details}</td>
                                <td>{i.inventor}</td>
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
                                  {i.JPO
                                    ? <button
                                      name={i.patent_id}
                                      value={i.end_date}
                                      className="btn btn-success"
                                      onClick={(event) => {
                                        this.acceptPatentApplicationByJPO(event.target.name, this.state.enddate)
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
          </main>
        </div>
      </div>
    );
  }
}

export default JpoDashboard;