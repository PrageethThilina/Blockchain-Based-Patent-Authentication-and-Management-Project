import React, { Component } from 'react';

class Main extends Component {

    render() {
        return (
            <div id="content">
                <h1>Patent Application</h1>
                <form onSubmit={(event) => {
                    event.preventDefault()
                    const invention_title = this.inventionTitle.value
                    const inventor_details = this.inventorDetails.value
                    const patent_claims = this.patentClaims.value
                    const invention_description = this.inventionDescription.value
                    const registereddate = this.registeredDate.value
                    const expdate = this.expDate.value
                    this.props.registerPatent(invention_title, inventor_details, patent_claims, invention_description, registereddate, expdate)
                }}>
                    <div className="form-group mr-sm-2">
                        <input
                            id="inventionTitle"
                            type="text"
                            ref={(input) => { this.inventionTitle = input }}
                            className="form-control"
                            placeholder="Invention Title"
                            required />
                    </div>
                    <div className="form-group mr-sm-2">
                        <input
                            id="inventorDetails"
                            type="text"
                            ref={(input) => { this.inventorDetails = input }}
                            className="form-control"
                            placeholder="Inventor Details"
                            required />
                    </div>
                    <div className="form-group mr-sm-2">
                        <input
                            id="patentClaims"
                            type="text"
                            ref={(input) => { this.patentClaims = input }}
                            className="form-control"
                            placeholder="Patent Claims"
                            required />
                    </div>
                    <div className="form-group mr-sm-2">
                        <input
                            id="inventionDescription"
                            type="text"
                            ref={(input) => { this.inventionDescription = input }}
                            className="form-control"
                            placeholder="Invention Description"
                            required />
                    </div>
                    <div className="form-group mr-sm-2">
                        <input
                            id="registeredDate"
                            type="date"
                            ref={(input) => { this.registeredDate = input }}
                            className="form-control"
                            placeholder="Registered Date"
                            required />
                    </div>
                    <div className="form-group mr-sm-2">
                        <input
                            id="expDate"
                            type="date"
                            ref={(input) => { this.expDate = input }}
                            className="form-control"
                            placeholder="Expiry Date"
                            required />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
                <p> </p>
                <h2>Registered Patents</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Invention Title</th>
                            <th scope="col">Inventor Details</th>
                            <th scope="col">Inventor</th>
                            <th scope="col">Patent Claims</th>
                            <th scope="col">Invention Description</th>
                            <th scope="col">Registered Date</th>
                            <th scope="col">Expiry Date</th>
                        </tr>
                    </thead>
                    <tbody id="patentList">
                        {this.props.patent_details.map((patent_detail, key) => {
                            return (
                                <tr key={key}>
                                    <th scope="row">{patent_detail.patent_id.toString()}</th>
                                    <td>{patent_detail.invention_title}</td>
                                    <td>{patent_detail.inventor_details}</td>
                                    <td>{patent_detail.inventor}</td>
                                    <td>{patent_detail.patent_claims}</td>
                                    <td>{patent_detail.invention_description}</td>
                                    <td>{patent_detail.registereddate}</td>
                                    <td>{patent_detail.expdate}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Main;