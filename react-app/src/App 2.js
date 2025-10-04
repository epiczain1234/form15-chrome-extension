import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({});
  const [scanResults, setScanResults] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleScan = (fieldName) => {
    setScanResults(prev => ({ ...prev, [fieldName]: true }));
  };

  const handleViewSource = () => {
    window.open('https://google.com', '_blank');
  };

  return (
    <div className="app-container">
      {/* Header */}
      <div className="header">
        <div className="header-left">
          <div className="logo">Acme Corporation</div>
          <div className="form-info">
            <span className="form-number">1120</span>
            <span className="tax-year">Tax Year 2024</span>
          </div>
        </div>
        <div className="header-right">
          <select className="header-select">
            <option>Select assignee</option>
          </select>
          <select className="header-select">
            <option>Select status</option>
          </select>
          <button className="header-btn">Import data</button>
          <button className="header-btn">Notes</button>
          <button className="header-btn primary">Return actions</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <div className="tabs">
          <button className="tab">Profile</button>
          <button className="tab active">Input return</button>
          <button className="tab">Check return</button>
          <button className="tab">File return</button>
        </div>
        <button className="review-btn">Review return</button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="views-header">
            <span>Views</span>
            <button className="expand-btn">⇄</button>
          </div>
          <button className="view-all-btn">View all input screens ≡</button>
          <div className="filter-tabs">
            <button className="filter-tab active">All</button>
            <button className="filter-tab">In Use</button>
          </div>
          <div className="search-box">
            <input type="text" placeholder="Search" />
          </div>
          <div className="menu-section">
            <div className="menu-header">General</div>
            <div className="menu-item active">Client Information</div>
            <div className="menu-item">Officer Information</div>
            <div className="menu-item">Miscellaneous Information</div>
            <div className="menu-item">Electronic Filing</div>
            <div className="menu-item">Letter</div>
            <div className="menu-item">Ownership Information</div>
            <div className="menu-item">Payments, Penalties & Extensions</div>
            <div className="menu-item">Income</div>
            <div className="menu-item">Deductions</div>
            <div className="menu-item">Credits</div>
            <div className="menu-item">Taxes</div>
            <div className="menu-item">Balance Sheet</div>
          </div>
        </div>

        {/* Form Area */}
        <div className="form-area">
          <h2 className="form-title">Details: Client Information</h2>

          {/* Name and ID Number */}
          <div className="form-section">
            <h3 className="section-title">Name and ID Number</h3>

            <FormField
              label="Corporation Name"
              name="corporationName"
              value={formData.corporationName || ''}
              onChange={handleInputChange}
              onScan={() => handleScan('corporationName')}
              onViewSource={handleViewSource}
              scanned={scanResults.corporationName}
            />

            <FormField
              label="Corp Name (cont)"
              name="corpNameCont"
              value={formData.corpNameCont || ''}
              onChange={handleInputChange}
              onScan={() => handleScan('corpNameCont')}
              onViewSource={handleViewSource}
              scanned={scanResults.corpNameCont}
            />

            <FormField
              label="Corporation DBA"
              name="corporationDBA"
              value={formData.corporationDBA || ''}
              onChange={handleInputChange}
              onScan={() => handleScan('corporationDBA')}
              onViewSource={handleViewSource}
              scanned={scanResults.corporationDBA}
            />

            <FormField
              label="Federal I.D. Number"
              name="federalID"
              value={formData.federalID || ''}
              onChange={handleInputChange}
              onScan={() => handleScan('federalID')}
              onViewSource={handleViewSource}
              scanned={scanResults.federalID}
              type="select"
            />

            <FormField
              label="Primary Contact"
              name="primaryContact"
              value={formData.primaryContact || ''}
              onChange={handleInputChange}
              onScan={() => handleScan('primaryContact')}
              onViewSource={handleViewSource}
              scanned={scanResults.primaryContact}
            />
          </div>

          {/* Address and Telephone */}
          <div className="form-section">
            <h3 className="section-title">Address and Telephone</h3>

            <div className="checkbox-field">
              <input type="checkbox" id="foreignAddress" />
              <label htmlFor="foreignAddress">Foreign Address?</label>
            </div>

            <FormField
              label="Street Address"
              name="streetAddress"
              value={formData.streetAddress || ''}
              onChange={handleInputChange}
              onScan={() => handleScan('streetAddress')}
              onViewSource={handleViewSource}
              scanned={scanResults.streetAddress}
            />

            <FormField
              label="City"
              name="city"
              value={formData.city || ''}
              onChange={handleInputChange}
              onScan={() => handleScan('city')}
              onViewSource={handleViewSource}
              scanned={scanResults.city}
            />

            <FormField
              label="State"
              name="state"
              value={formData.state || ''}
              onChange={handleInputChange}
              onScan={() => handleScan('state')}
              onViewSource={handleViewSource}
              scanned={scanResults.state}
              type="select"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, name, value, onChange, onScan, onViewSource, scanned, type = "text" }) {
  return (
    <div className="form-field">
      <label className="field-label">{label}</label>
      <div className="field-input-group">
        {type === "select" ? (
          <select name={name} value={value} onChange={onChange} className="field-input">
            <option value="">EIN</option>
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="field-input"
          />
        )}
        <button
          className="scan-btn"
          onClick={onScan}
          title="Scan field"
        >
          Scan
        </button>
        {scanned && (
          <button
            className="view-source-btn"
            onClick={onViewSource}
            title="View source"
          >
            View Source
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
