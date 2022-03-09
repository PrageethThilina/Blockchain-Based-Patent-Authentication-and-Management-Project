import React, { Component } from 'react';

class JpoDashboard extends Component {

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

        const current = new Date();
        const enddate = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()+20}`;

        return (
            <div id="content">
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
                                        <th>Patent Status</th>
                                        <th>Action</th>
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
                                                <td>{i.patent_status}</td>
                                                <td>
                                                    { !i.JPO
                                                    ? <button
                                                        name={i.patent_id}
                                                        value={i.end_date}
                                                        className="btn btn-success"
                                                        onClick={(event) => {
                                                            this.props.acceptPatentApplicationByUSPTO(event.target.name, event.target.value)
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
        );
    }
}

export default JpoDashboard;