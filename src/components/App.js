import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Web3 from 'web3';
import InventorNavbar from './InventorNavbar';
import InventorDashboard from './InventorDashboard';
import './App.css';
import Patent from '../abis/Patent.json';
import UsptoDashboard from './UsptoDashboard';
import JpoDashboard from './JpoDashboard';

class App extends Component {

  //function that will get called whenever our React component is loaded
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
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
    console.log(accounts)
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
      for (var i = 1; i <= patentCount; i++) {
        const invention_detail = await patent.methods.inventiondetails(i).call()
        const patent_detail = await patent.methods.patentdetails(i).call()
        const check_patent_claim = await patent.methods.checkpatentclaims(i).call()

        this.setState({
          inventiondetails: [...this.state.inventiondetails, invention_detail],
          patentdetails: [...this.state.patentdetails, patent_detail],
          checkpatentclaims: [...this.state.checkpatentclaims, check_patent_claim],
          dataarr: this.state.inventiondetails.map((item, i) => Object.assign({}, item, this.state.patentdetails[i], {}, item, this.state.checkpatentclaims[i]))
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
      loading: true
    }

    this.registerPatent = this.registerPatent.bind(this)
    this.acceptPatentApplicationByUSPTO = this.acceptPatentApplicationByUSPTO.bind(this)

  }

  registerPatent(invention_title, inventor_details, technical_field, technical_problem, technical_solution, invention_description, registered_date, end_date, license_details, renewal_status, patent_status, USPTO, JPO, EPO) {
    this.setState({ loading: true })
    this.state.patent.methods.registerPatent(invention_title, inventor_details, technical_field, technical_problem, technical_solution, invention_description, registered_date, end_date, license_details, renewal_status, patent_status, USPTO, JPO, EPO).send({ from: this.state.account, gas: 4712388, gasPrice: 100000000000 })
      .once('receipt', (receipt) => {
        this.setState({ loading: false })
      })
  }

  acceptPatentApplicationByUSPTO(patent_id) {
    this.setState({ loading: true })
    this.state.patent.methods.acceptPatentApplicationByUSPTO(patent_id).send({ from: this.state.account, gas: 5000000, gasPrice: 200000000000 })
      .once('receipt', (receipt) => {
        this.setState({ loading: false })
      })
  }

  render() {
    return (
      <div>
        <InventorNavbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-md-12">
              {this.state.loading
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                : <InventorDashboard
                  patentdataarr={this.state.dataarr}
                  patentcount={this.state.patentCount.toString()}
                  registerPatent={this.registerPatent}
                  acceptPatentApplicationByUSPTO={this.acceptPatentApplicationByUSPTO} />
              }
            </main>
          </div>
        </div>
        <Router>
          <Routes>
            <Route exact path="/UsptoDashboard" element={<UsptoDashboard />} />
            <Route exact path="/JpoDashboard" element={<JpoDashboard />} />
          </Routes>
        </Router>
      </div>
    );
  }
}

export default App;