import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({});
  const [activeSection, setActiveSection] = useState('Client Information');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
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
            <div
              className={`menu-item ${activeSection === 'Client Information' ? 'active' : ''}`}
              onClick={() => handleSectionChange('Client Information')}
            >
              Client Information
            </div>
            <div
              className={`menu-item ${activeSection === 'Officer Information' ? 'active' : ''}`}
              onClick={() => handleSectionChange('Officer Information')}
            >
              Officer Information
            </div>
            <div
              className={`menu-item ${activeSection === 'Miscellaneous Information' ? 'active' : ''}`}
              onClick={() => handleSectionChange('Miscellaneous Information')}
            >
              Miscellaneous Information
            </div>
            <div
              className={`menu-item ${activeSection === 'Electronic Filing' ? 'active' : ''}`}
              onClick={() => handleSectionChange('Electronic Filing')}
            >
              Electronic Filing
            </div>
            <div
              className={`menu-item ${activeSection === 'Letter' ? 'active' : ''}`}
              onClick={() => handleSectionChange('Letter')}
            >
              Letter
            </div>
            <div
              className={`menu-item ${activeSection === 'Ownership Information' ? 'active' : ''}`}
              onClick={() => handleSectionChange('Ownership Information')}
            >
              Ownership Information
            </div>
            <div
              className={`menu-item ${activeSection === 'Payments, Penalties & Extensions' ? 'active' : ''}`}
              onClick={() => handleSectionChange('Payments, Penalties & Extensions')}
            >
              Payments, Penalties & Extensions
            </div>
            <div
              className={`menu-item ${activeSection === 'Income' ? 'active' : ''}`}
              onClick={() => handleSectionChange('Income')}
            >
              Income
            </div>
            <div
              className={`menu-item ${activeSection === 'Deductions' ? 'active' : ''}`}
              onClick={() => handleSectionChange('Deductions')}
            >
              Deductions
            </div>
            <div
              className={`menu-item ${activeSection === 'Credits' ? 'active' : ''}`}
              onClick={() => handleSectionChange('Credits')}
            >
              Credits
            </div>
            <div
              className={`menu-item ${activeSection === 'Taxes' ? 'active' : ''}`}
              onClick={() => handleSectionChange('Taxes')}
            >
              Taxes
            </div>
            <div
              className={`menu-item ${activeSection === 'Balance Sheet' ? 'active' : ''}`}
              onClick={() => handleSectionChange('Balance Sheet')}
            >
              Balance Sheet
            </div>
          </div>
        </div>

        {/* Form Area */}
        <div className="form-area">
          {renderFormSection(activeSection, formData, handleInputChange)}
        </div>
      </div>
    </div>
  );
}

function renderFormSection(section, formData, handleInputChange) {
  switch (section) {
    case 'Client Information':
      return (
        <>
          <h2 className="form-title">Details: Client Information</h2>
          <div className="form-section">
            <h3 className="section-title">Name and ID Number</h3>
            <FormField label="Corporation Name" name="companyName" id="companyName" value={formData.companyName || ''} onChange={handleInputChange} />
            <FormField label="Corp Name (cont)" name="corpNameCont" id="corpNameCont" value={formData.corpNameCont || ''} onChange={handleInputChange} />
            <FormField label="Corporation DBA" name="corporationDBA" id="corporationDBA" value={formData.corporationDBA || ''} onChange={handleInputChange} />
            <FormField label="Federal I.D. Number (EIN)" name="ein" id="ein" value={formData.ein || ''} onChange={handleInputChange} />
            <FormField label="Primary Contact" name="primaryContact" id="primaryContact" value={formData.primaryContact || ''} onChange={handleInputChange} />
          </div>
          <div className="form-section">
            <h3 className="section-title">Address and Telephone</h3>
            <FormField label="Street Address" name="address" id="address" value={formData.address || ''} onChange={handleInputChange} />
            <FormField label="City" name="city" id="city" value={formData.city || ''} onChange={handleInputChange} />
            <FormField label="State" name="state" id="state" value={formData.state || ''} onChange={handleInputChange} />
            <FormField label="ZIP Code" name="zipCode" id="zipCode" value={formData.zipCode || ''} onChange={handleInputChange} />
            <FormField label="Phone Number" name="mobilePhone" id="mobilePhone" value={formData.mobilePhone || ''} onChange={handleInputChange} />
          </div>
        </>
      );

    case 'Officer Information':
      return (
        <>
          <h2 className="form-title">Details: Officer Information</h2>
          <div className="form-section">
            <h3 className="section-title">Principal Officers</h3>
            <FormField label="Officer Name" name="officerName" id="officerName" value={formData.officerName || ''} onChange={handleInputChange} />
            <FormField label="Officer Title" name="officerTitle" id="officerTitle" value={formData.officerTitle || ''} onChange={handleInputChange} />
            <FormField label="Officer SSN" name="officerSSN" id="officerSSN" value={formData.officerSSN || ''} onChange={handleInputChange} />
            <FormField label="Time Devoted to Business (%)" name="timeDevoted" id="timeDevoted" value={formData.timeDevoted || ''} onChange={handleInputChange} type="number" />
            <FormField label="Compensation Amount" name="compensation" id="compensation" value={formData.compensation || ''} onChange={handleInputChange} type="number" />
          </div>
        </>
      );

    case 'Income':
      return (
        <>
          <h2 className="form-title">Details: Income</h2>
          <div className="form-section">
            <h3 className="section-title">Income Items</h3>
            <FormField label="Line 1a - Gross receipts or sales" name="grossReceipts" id="grossReceipts" value={formData.grossReceipts || ''} onChange={handleInputChange} type="number" />
            <FormField label="Line 1b - Returns and allowances" name="returnsAllowances" id="returnsAllowances" value={formData.returnsAllowances || ''} onChange={handleInputChange} type="number" />
            <FormField label="Line 2 - Cost of goods sold" name="costOfGoodsSold" id="costOfGoodsSold" value={formData.costOfGoodsSold || ''} onChange={handleInputChange} type="number" />
            <FormField label="Line 3 - Gross profit" name="grossProfit" id="grossProfit" value={formData.grossProfit || ''} onChange={handleInputChange} type="number" />
            <FormField label="Line 4 - Dividends" name="dividends" id="dividends" value={formData.dividends || ''} onChange={handleInputChange} type="number" />
            <FormField label="Line 5 - Interest income" name="interest" id="interest" value={formData.interest || ''} onChange={handleInputChange} type="number" />
            <FormField label="Line 6 - Gross rents" name="grossRents" id="grossRents" value={formData.grossRents || ''} onChange={handleInputChange} type="number" />
            <FormField label="Line 7 - Gross royalties" name="grossRoyalties" id="grossRoyalties" value={formData.grossRoyalties || ''} onChange={handleInputChange} type="number" />
            <FormField label="Line 8 - Capital gain net income" name="capitalGainNetIncome" id="capitalGainNetIncome" value={formData.capitalGainNetIncome || ''} onChange={handleInputChange} type="number" />
            <FormField label="Line 9 - Net gain or loss" name="netGainLoss" id="netGainLoss" value={formData.netGainLoss || ''} onChange={handleInputChange} type="number" />
            <FormField label="Line 10 - Other income" name="otherIncome" id="otherIncome" value={formData.otherIncome || ''} onChange={handleInputChange} type="number" />
            <FormField label="Line 11 - Total income" name="totalIncome" id="totalIncome" value={formData.totalIncome || ''} onChange={handleInputChange} type="number" />
          </div>
        </>
      );

    case 'Deductions':
      return (
        <>
          <h2 className="form-title">Details: Deductions</h2>
          <div className="form-section">
            <h3 className="section-title">Deduction Items</h3>
            <FormField label="Line 12 - Compensation of officers" name="compensationOfficers" id="compensationOfficers" value={formData.compensationOfficers || ''} onChange={handleInputChange} type="number" />
            <FormField label="Line 13 - Salaries and wages" name="salariesWages" id="salariesWages" value={formData.salariesWages || ''} onChange={handleInputChange} type="number" />
            <FormField label="Line 14 - Repairs and maintenance" name="repairs" id="repairs" value={formData.repairs || ''} onChange={handleInputChange} type="number" />
            <FormField label="Line 15 - Bad debts" name="badDebts" id="badDebts" value={formData.badDebts || ''} onChange={handleInputChange} type="number" />
            <FormField label="Line 16 - Rents" name="rentExpense" id="rentExpense" value={formData.rentExpense || ''} onChange={handleInputChange} type="number" />
            <FormField label="Line 17 - Taxes and licenses" name="taxes" id="taxes" value={formData.taxes || ''} onChange={handleInputChange} type="number" />
            <FormField label="Line 18 - Interest expense" name="interest_expense" id="interest_expense" value={formData.interest_expense || ''} onChange={handleInputChange} type="number" />
            <FormField label="Line 19 - Charitable contributions" name="charitable" id="charitable" value={formData.charitable || ''} onChange={handleInputChange} type="number" />
            <FormField label="Line 20 - Depreciation" name="depreciation" id="depreciation" value={formData.depreciation || ''} onChange={handleInputChange} type="number" />
            <FormField label="Line 21 - Depletion" name="depletion" id="depletion" value={formData.depletion || ''} onChange={handleInputChange} type="number" />
            <FormField label="Line 22 - Advertising" name="advertising" id="advertising" value={formData.advertising || ''} onChange={handleInputChange} type="number" />
            <FormField label="Line 23 - Pension, profit-sharing plans" name="pensionPlans" id="pensionPlans" value={formData.pensionPlans || ''} onChange={handleInputChange} type="number" />
            <FormField label="Line 24 - Employee benefit programs" name="employeeBenefits" id="employeeBenefits" value={formData.employeeBenefits || ''} onChange={handleInputChange} type="number" />
            <FormField label="Line 25 - Reserved for future use" name="reserved25" id="reserved25" value={formData.reserved25 || ''} onChange={handleInputChange} type="number" />
            <FormField label="Line 26 - Other deductions" name="otherDeductions" id="otherDeductions" value={formData.otherDeductions || ''} onChange={handleInputChange} type="number" />
            <FormField label="Line 27 - Total deductions" name="totalDeductions" id="totalDeductions" value={formData.totalDeductions || ''} onChange={handleInputChange} type="number" />
            <FormField label="Line 28 - Taxable income" name="taxableIncome" id="taxableIncome" value={formData.taxableIncome || ''} onChange={handleInputChange} type="number" />
          </div>
        </>
      );

    case 'Taxes':
      return (
        <>
          <h2 className="form-title">Details: Taxes</h2>
          <div className="form-section">
            <h3 className="section-title">Tax Computation and Payments</h3>
            <FormField label="Line 29 - Income tax" name="incomeTax" id="incomeTax" value={formData.incomeTax || ''} onChange={handleInputChange} type="number" />
            <FormField label="Line 30 - Base erosion minimum tax" name="baseErosionTax" id="baseErosionTax" value={formData.baseErosionTax || ''} onChange={handleInputChange} type="number" />
            <FormField label="Line 31 - Total tax" name="totalTax" id="totalTax" value={formData.totalTax || ''} onChange={handleInputChange} type="number" />
            <FormField label="Line 32 - Total payments and credits" name="paymentsCredits" id="paymentsCredits" value={formData.paymentsCredits || ''} onChange={handleInputChange} type="number" />
            <FormField label="Line 33 - Estimated tax penalty" name="estimatedTaxPenalty" id="estimatedTaxPenalty" value={formData.estimatedTaxPenalty || ''} onChange={handleInputChange} type="number" />
            <FormField label="Line 34 - Amount owed" name="amountOwed" id="amountOwed" value={formData.amountOwed || ''} onChange={handleInputChange} type="number" />
            <FormField label="Line 35 - Overpayment" name="overpayment" id="overpayment" value={formData.overpayment || ''} onChange={handleInputChange} type="number" />
          </div>
        </>
      );

    case 'Balance Sheet':
      return (
        <>
          <h2 className="form-title">Details: Balance Sheet</h2>
          <div className="form-section">
            <h3 className="section-title">Assets</h3>
            <FormField label="Cash (Beginning of year)" name="cashBeginning" id="cashBeginning" value={formData.cashBeginning || ''} onChange={handleInputChange} type="number" />
            <FormField label="Cash (End of year)" name="cashEnding" id="cashEnding" value={formData.cashEnding || ''} onChange={handleInputChange} type="number" />
            <FormField label="Accounts receivable (Beginning)" name="accountsReceivableBeginning" id="accountsReceivableBeginning" value={formData.accountsReceivableBeginning || ''} onChange={handleInputChange} type="number" />
            <FormField label="Accounts receivable (End)" name="accountsReceivableEnding" id="accountsReceivableEnding" value={formData.accountsReceivableEnding || ''} onChange={handleInputChange} type="number" />
            <FormField label="Inventories (Beginning)" name="inventoryBeginning" id="inventoryBeginning" value={formData.inventoryBeginning || ''} onChange={handleInputChange} type="number" />
            <FormField label="Inventories (End)" name="inventoryEnding" id="inventoryEnding" value={formData.inventoryEnding || ''} onChange={handleInputChange} type="number" />
            <FormField label="Buildings (Beginning)" name="buildingsBeginning" id="buildingsBeginning" value={formData.buildingsBeginning || ''} onChange={handleInputChange} type="number" />
            <FormField label="Buildings (End)" name="buildingsEnding" id="buildingsEnding" value={formData.buildingsEnding || ''} onChange={handleInputChange} type="number" />
            <FormField label="Total assets" name="totalAssets" id="totalAssets" value={formData.totalAssets || ''} onChange={handleInputChange} type="number" />
          </div>
          <div className="form-section">
            <h3 className="section-title">Liabilities</h3>
            <FormField label="Accounts payable (Beginning)" name="accountsPayableBeginning" id="accountsPayableBeginning" value={formData.accountsPayableBeginning || ''} onChange={handleInputChange} type="number" />
            <FormField label="Accounts payable (End)" name="accountsPayableEnding" id="accountsPayableEnding" value={formData.accountsPayableEnding || ''} onChange={handleInputChange} type="number" />
            <FormField label="Other current liabilities (Beginning)" name="otherLiabilitiesBeginning" id="otherLiabilitiesBeginning" value={formData.otherLiabilitiesBeginning || ''} onChange={handleInputChange} type="number" />
            <FormField label="Other current liabilities (End)" name="otherLiabilitiesEnding" id="otherLiabilitiesEnding" value={formData.otherLiabilitiesEnding || ''} onChange={handleInputChange} type="number" />
          </div>
          <div className="form-section">
            <h3 className="section-title">Capital</h3>
            <FormField label="Capital stock (Beginning)" name="capitalStockBeginning" id="capitalStockBeginning" value={formData.capitalStockBeginning || ''} onChange={handleInputChange} type="number" />
            <FormField label="Capital stock (End)" name="capitalStockEnding" id="capitalStockEnding" value={formData.capitalStockEnding || ''} onChange={handleInputChange} type="number" />
            <FormField label="Retained earnings (Beginning)" name="retainedEarningsBeginning" id="retainedEarningsBeginning" value={formData.retainedEarningsBeginning || ''} onChange={handleInputChange} type="number" />
            <FormField label="Retained earnings (End)" name="retainedEarningsEnding" id="retainedEarningsEnding" value={formData.retainedEarningsEnding || ''} onChange={handleInputChange} type="number" />
          </div>
        </>
      );

    case 'Credits':
      return (
        <>
          <h2 className="form-title">Details: Credits</h2>
          <div className="form-section">
            <h3 className="section-title">Tax Credits</h3>
            <FormField label="Foreign tax credit" name="foreignTaxCredit" id="foreignTaxCredit" value={formData.foreignTaxCredit || ''} onChange={handleInputChange} type="number" />
            <FormField label="Credit for prior year minimum tax" name="priorYearMinTaxCredit" id="priorYearMinTaxCredit" value={formData.priorYearMinTaxCredit || ''} onChange={handleInputChange} type="number" />
            <FormField label="General business credit" name="generalBusinessCredit" id="generalBusinessCredit" value={formData.generalBusinessCredit || ''} onChange={handleInputChange} type="number" />
            <FormField label="Research and development credit" name="rdCredit" id="rdCredit" value={formData.rdCredit || ''} onChange={handleInputChange} type="number" />
            <FormField label="Other credits" name="otherCredits" id="otherCredits" value={formData.otherCredits || ''} onChange={handleInputChange} type="number" />
            <FormField label="Total credits" name="totalCredits" id="totalCredits" value={formData.totalCredits || ''} onChange={handleInputChange} type="number" />
          </div>
        </>
      );

    case 'Miscellaneous Information':
      return (
        <>
          <h2 className="form-title">Details: Miscellaneous Information</h2>
          <div className="form-section">
            <h3 className="section-title">Business Activity & Other Information</h3>
            <FormField label="Business activity code" name="businessCode" id="businessCode" value={formData.businessCode || ''} onChange={handleInputChange} />
            <FormField label="Business activity" name="businessActivity" id="businessActivity" value={formData.businessActivity || ''} onChange={handleInputChange} />
            <FormField label="Product or service" name="productService" id="productService" value={formData.productService || ''} onChange={handleInputChange} />
            <FormField label="Date incorporated" name="dateIncorporated" id="dateIncorporated" value={formData.dateIncorporated || ''} onChange={handleInputChange} />
            <FormField label="State of incorporation" name="stateIncorporated" id="stateIncorporated" value={formData.stateIncorporated || ''} onChange={handleInputChange} />
          </div>
        </>
      );

    case 'Electronic Filing':
      return (
        <>
          <h2 className="form-title">Details: Electronic Filing</h2>
          <div className="form-section">
            <h3 className="section-title">E-File Information</h3>
            <FormField label="Preparer PTIN" name="preparerPTIN" id="preparerPTIN" value={formData.preparerPTIN || ''} onChange={handleInputChange} />
            <FormField label="Preparer name" name="preparerName" id="preparerName" value={formData.preparerName || ''} onChange={handleInputChange} />
            <FormField label="Preparer firm name" name="preparerFirmName" id="preparerFirmName" value={formData.preparerFirmName || ''} onChange={handleInputChange} />
            <FormField label="Preparer EIN" name="preparerEIN" id="preparerEIN" value={formData.preparerEIN || ''} onChange={handleInputChange} />
          </div>
        </>
      );

    case 'Letter':
      return (
        <>
          <h2 className="form-title">Details: Letter</h2>
          <div className="form-section">
            <h3 className="section-title">Correspondence</h3>
            <FormField label="Letter content" name="letterContent" id="letterContent" value={formData.letterContent || ''} onChange={handleInputChange} />
            <FormField label="Signature name" name="signatureName" id="signatureName" value={formData.signatureName || ''} onChange={handleInputChange} />
            <FormField label="Signature date" name="signatureDate" id="signatureDate" value={formData.signatureDate || ''} onChange={handleInputChange} />
          </div>
        </>
      );

    case 'Ownership Information':
      return (
        <>
          <h2 className="form-title">Details: Ownership Information</h2>
          <div className="form-section">
            <h3 className="section-title">Shareholder Information</h3>
            <FormField label="Shareholder name" name="shareholderName" id="shareholderName" value={formData.shareholderName || ''} onChange={handleInputChange} />
            <FormField label="Shareholder SSN/EIN" name="shareholderSSN" id="shareholderSSN" value={formData.shareholderSSN || ''} onChange={handleInputChange} />
            <FormField label="Percentage ownership" name="ownershipPercentage" id="ownershipPercentage" value={formData.ownershipPercentage || ''} onChange={handleInputChange} type="number" />
            <FormField label="Number of shares" name="numberOfShares" id="numberOfShares" value={formData.numberOfShares || ''} onChange={handleInputChange} type="number" />
          </div>
        </>
      );

    case 'Payments, Penalties & Extensions':
      return (
        <>
          <h2 className="form-title">Details: Payments, Penalties & Extensions</h2>
          <div className="form-section">
            <h3 className="section-title">Payment Information</h3>
            <FormField label="Estimated tax payments" name="estimatedTaxPayments" id="estimatedTaxPayments" value={formData.estimatedTaxPayments || ''} onChange={handleInputChange} type="number" />
            <FormField label="Extension payment" name="extensionPayment" id="extensionPayment" value={formData.extensionPayment || ''} onChange={handleInputChange} type="number" />
            <FormField label="Overpayment from prior year" name="priorYearOverpayment" id="priorYearOverpayment" value={formData.priorYearOverpayment || ''} onChange={handleInputChange} type="number" />
            <FormField label="Penalty for late filing" name="lateFilingPenalty" id="lateFilingPenalty" value={formData.lateFilingPenalty || ''} onChange={handleInputChange} type="number" />
          </div>
        </>
      );

    default:
      return <h2 className="form-title">Select a section from the menu</h2>;
  }
}

function FormField({ label, name, id, value, onChange, type = "text" }) {
  return (
    <div className="form-field">
      <label className="field-label" htmlFor={id}>{label}</label>
      <input
        type={type}
        name={name}
        id={id}
        value={value}
        onChange={onChange}
        className="field-input"
      />
    </div>
  );
}

export default App;
