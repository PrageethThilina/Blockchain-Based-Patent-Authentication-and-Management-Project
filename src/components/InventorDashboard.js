import React, { Component } from 'react';

class InventorDashboard extends Component {

    async componentWillMount() {
        await this.loadRegisteredPatents()
    }

    async loadRegisteredPatents() {
        if (this.props.patentcount === '0') {

            this.setState({
                showResults: false
            });
        }
        else {
            this.setState({
                showResults: true
            });
        }
    }

    state = {
        showResults: false

    };

    render() {

        const tblStyle = {
            display: 'block',
            overflowX: 'auto',
            overflowY: 'auto',
            whitespace: 'nowrap',
        }

        console.log(this.props.patentdataarr)

        return (
            <div id="content">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 card" style={{ padding: '10px' }}>
                            <h4 className="text-center">Patent Application</h4>
                            <form onSubmit={(event) => {

                                const current = new Date();
                                const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;
                                // const enddate = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()+20}`;
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

                                this.props.registerPatent(invention_title, inventor_details, technical_field, technical_problem, technical_solution, invention_description, registered_date, end_date, license_details, renewal_status, patent_status, USPTO, JPO, EPO)

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
                                            <input
                                                id="technicalField"
                                                type="text"
                                                ref={(input) => { this.technicalField = input }}
                                                className="form-control"
                                                required />
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

                <div className="container-fluid" style={{ display: this.state.showResults ? "block" : "none", marginTop: '30px' }}>
                    <div className="row">
                        <div className="col" id="registered_patents_div">
                            <h4 className="text-center">Registered Patents</h4>
                            <table className="table table-success table-striped table-bordered table-hover" style={tblStyle}>
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
                                        <th>Patent Status</th>
                                    </tr>
                                </thead>
                                <tbody id="patentList">
                                    {this.props.patentdataarr.map((i, key) => {
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
                                                <td>{i.patent_status}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default InventorDashboard;