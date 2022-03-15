import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import InventorDashboard from './InventorDashboard';
import UsptoDashboard from './UsptoDashboard';
import JpoDashboard from './JpoDashboard';

class App extends Component {

  render() {
    return (
      <div>
        <Router>
          <Routes>
            <Route exact path="/" element={<InventorDashboard />} />
            <Route exact path="/UsptoDashboard" element={<UsptoDashboard />} />
            <Route exact path="/JpoDashboard" element={<JpoDashboard />} />
          </Routes>
        </Router>
      </div>
    );
  }
}

export default App;