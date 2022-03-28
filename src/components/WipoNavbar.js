import React, { Component } from 'react';

class WipoNavbar extends Component {

  render() {
    return (
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="/WipoDashboard"
          target="_blank"
          rel="noopener noreferrer"
        >
         World Intellectual Property Office
        </a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            {/* Read the account using React's props object, which is available to all React components. */}
            <small className="text-white"><span id="account">{this.props.account}</span></small>
          </li>
        </ul>
      </nav>
    );
  }
}
export default WipoNavbar;