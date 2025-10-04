// View management
const mainView = document.getElementById('mainView');
const loadingView = document.getElementById('loadingView');
const resultsView = document.getElementById('resultsView');

// Get all option buttons
const optionButtons = document.querySelectorAll('.option-btn');
const backBtn = document.getElementById('backBtn');
const syncBtn = document.getElementById('syncBtn');

// Hardcoded 1120 tax form data
const form1120Data = {
  // Company Information
  'companyName': 'Acme Corporation',
  'ein': '12-3456789',
  'businessCode': '541511',
  'dateIncorporated': '01/15/2015',
  'totalAssets': '5250000',

  // Address
  'address': '123 Business Street',
  'city': 'New York',
  'state': 'NY',
  'zipCode': '10001',

  // Income
  'grossReceipts': '2500000',
  'returnsAllowances': '50000',
  'costOfGoodsSold': '1200000',
  'grossProfit': '1250000',
  'dividends': '25000',
  'interest': '15000',
  'grossRents': '120000',
  'capitalGainNetIncome': '35000',
  'otherIncome': '10000',
  'totalIncome': '1455000',

  // Deductions
  'compensation': '450000',
  'salariesWages': '350000',
  'repairs': '25000',
  'badDebts': '15000',
  'rentExpense': '60000',
  'taxes': '85000',
  'interest_expense': '45000',
  'charitable': '20000',
  'depreciation': '125000',
  'advertising': '75000',
  'pensionPlans': '55000',
  'employeeBenefits': '45000',
  'otherDeductions': '95000',
  'totalDeductions': '1445000',

  // Tax Computation
  'taxableIncome': '10000',
  'totalTax': '2100',
  'paymentsCredits': '2500',
  'overpayment': '400',

  // Balance Sheet
  'cashBeginning': '250000',
  'cashEnding': '325000',
  'accountsReceivableBeginning': '180000',
  'accountsReceivableEnding': '210000',
  'inventoryBeginning': '450000',
  'inventoryEnding': '485000',
  'buildingsBeginning': '2800000',
  'buildingsEnding': '2750000',
  'accountsPayableBeginning': '125000',
  'accountsPayableEnding': '145000',
  'capitalStockBeginning': '1000000',
  'capitalStockEnding': '1000000',
  'retainedEarningsBeginning': '2500000',
  'retainedEarningsEnding': '2550000'
};

// Helper function to switch views
function switchView(viewToShow) {
  [mainView, loadingView, resultsView].forEach(view => {
    view.classList.remove('active');
  });
  viewToShow.classList.add('active');
}

// Helper function to clean up website name
function cleanWebsiteName(hostname) {
  // Remove www. prefix
  let cleaned = hostname.replace(/^www\./, '');

  // Remove .com, .net, etc.
  cleaned = cleaned.replace(/\.(com|net|org|edu|gov|co|io|ai).*$/, '');

  // Handle special cases
  const specialCases = {
    'prosystemfx': 'ProSystemFx',
    'cchaxcess': 'CCH Axcess',
    'draketax': 'Drake Tax',
    'lacerte': 'Lacerte',
    'proseries': 'ProSeries',
    'turbotax': 'TurboTax',
    'taxact': 'TaxAct',
    'ultratax': 'UltraTax'
  };

  const lowerCleaned = cleaned.toLowerCase();
  if (specialCases[lowerCleaned]) {
    return specialCases[lowerCleaned];
  }

  // Convert to PascalCase
  return cleaned
    .split(/[-_.]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

// Handle option button clicks
optionButtons.forEach(button => {
  button.addEventListener('click', async () => {
    const action = button.dataset.action;

    // Show loading view
    switchView(loadingView);
    const loadingText = document.querySelector('.loading-text');
    const loadingSubtext = document.querySelector('.loading-subtext');

    // Set loading messages based on action
    switch(action) {
      case 'sync-excel':
        loadingText.textContent = 'Connecting to Excel...';
        loadingSubtext.textContent = 'Reading workbook data';
        break;
      case 'import-tax':
        loadingText.textContent = 'Importing tax form...';
        loadingSubtext.textContent = 'Processing form data';
        break;
      case 'import-sheet':
        loadingText.textContent = 'Importing sheet data...';
        loadingSubtext.textContent = 'Reading spreadsheet';
        break;
      case 'scan-forms':
        loadingText.textContent = 'Scanning page...';
        loadingSubtext.textContent = 'Detecting form fields';
        break;
    }

    // For scan-forms, actually scan the page
    if (action === 'scan-forms') {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        // Inject and execute the content script
        const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: scanFormFields
        });

        const formData = results[0].result;
        const hostname = new URL(tab.url).hostname;
        const cleanedName = cleanWebsiteName(hostname);

        // Detect form type
        let formType = 'form';
        const url = tab.url.toLowerCase();
        const title = tab.title.toLowerCase();

        if (url.includes('1120') || title.includes('1120')) {
          formType = '1120 tax form';
        } else if (url.includes('1065') || title.includes('1065')) {
          formType = '1065 tax form';
        } else if (url.includes('1040') || title.includes('1040')) {
          formType = '1040 tax form';
        } else if (url.includes('tax') || title.includes('tax')) {
          formType = 'tax form';
        }

        // Show results
        // Check if this is the test form
        const isTestForm = hostname.includes('localhost') || title.includes('AcmeCorpForm1120') || url.includes('test-form-1120.html');

        if (isTestForm) {
          document.getElementById('resultsMessage').textContent =
            `Captured ${formData.fieldCount} fields`;
          document.getElementById('resultsWebsite').textContent =
            `from AcmeCorpForm1120.pdf`;
          document.getElementById('websiteName').textContent = 'Test Form';
        } else {
          document.getElementById('resultsMessage').textContent =
            `Captured ${formData.fieldCount} ${formType} fields`;
          document.getElementById('resultsWebsite').textContent =
            `from ${hostname}`;
          document.getElementById('websiteName').textContent = cleanedName;
        }

        // Store the form data
        chrome.storage.local.set({
          lastScan: {
            fields: formData.fields,
            hostname: hostname,
            cleanedName: cleanedName,
            formType: formType,
            timestamp: Date.now()
          }
        });

        switchView(resultsView);
      } catch (error) {
        console.error('Error scanning page:', error);
        alert('Error scanning page. Please try again.');
        switchView(mainView);
      }
    } else {
      // Simulate loading for other actions (2 seconds)
      setTimeout(() => {
        // Get current tab info
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const tab = tabs[0];
          const hostname = new URL(tab.url).hostname;
          const cleanedName = cleanWebsiteName(hostname);

          // Show placeholder results
          const fieldCount = Math.floor(Math.random() * 50) + 20;
          document.getElementById('resultsMessage').textContent =
            `Captured ${fieldCount} form fields`;
          document.getElementById('resultsWebsite').textContent =
            `from ${hostname}`;
          document.getElementById('websiteName').textContent = cleanedName;

          switchView(resultsView);
        });
      }, 2000);
    }
  });
});

// Back button handler
backBtn.addEventListener('click', () => {
  switchView(mainView);
});

// Sync button handler
syncBtn.addEventListener('click', async () => {
  const data = await chrome.storage.local.get('lastScan');
  if (data.lastScan) {
    try {
      // Show loading
      const originalText = syncBtn.textContent;
      syncBtn.textContent = 'Syncing...';
      syncBtn.disabled = true;

      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      // Smart field matching - try to match form fields with our data
      const mappings = [];

      data.lastScan.fields.forEach(field => {
        const fieldLabel = field.label.toLowerCase();
        const fieldName = field.name.toLowerCase();
        const fieldId = field.id.toLowerCase();
        const searchText = `${fieldLabel} ${fieldName} ${fieldId}`;

        // Match fields intelligently
        let value = null;

        // Company/Name fields
        if (searchText.includes('company') || searchText.includes('corporation') || searchText.includes('name')) {
          value = form1120Data.companyName;
        }
        // EIN/Tax ID
        else if (searchText.includes('ein') || searchText.includes('tax id') || searchText.includes('employer identification')) {
          value = form1120Data.ein;
        }
        // Address
        else if (searchText.includes('address') && !searchText.includes('email')) {
          value = form1120Data.address;
        }
        else if (searchText.includes('city')) {
          value = form1120Data.city;
        }
        else if (searchText.includes('state')) {
          value = form1120Data.state;
        }
        else if (searchText.includes('zip')) {
          value = form1120Data.zipCode;
        }
        // Income fields
        else if (searchText.includes('gross receipts') || searchText.includes('gross sales')) {
          value = form1120Data.grossReceipts;
        }
        else if (searchText.includes('cost of goods') || searchText.includes('cogs')) {
          value = form1120Data.costOfGoodsSold;
        }
        else if (searchText.includes('gross profit')) {
          value = form1120Data.grossProfit;
        }
        else if (searchText.includes('dividend')) {
          value = form1120Data.dividends;
        }
        else if (searchText.includes('interest') && !searchText.includes('expense')) {
          value = form1120Data.interest;
        }
        else if (searchText.includes('rent') && searchText.includes('income')) {
          value = form1120Data.grossRents;
        }
        else if (searchText.includes('capital gain')) {
          value = form1120Data.capitalGainNetIncome;
        }
        else if (searchText.includes('total income')) {
          value = form1120Data.totalIncome;
        }
        // Deductions
        else if (searchText.includes('compensation') || searchText.includes('officer')) {
          value = form1120Data.compensation;
        }
        else if (searchText.includes('salaries') || searchText.includes('wages')) {
          value = form1120Data.salariesWages;
        }
        else if (searchText.includes('repair')) {
          value = form1120Data.repairs;
        }
        else if (searchText.includes('bad debt')) {
          value = form1120Data.badDebts;
        }
        else if (searchText.includes('rent') && searchText.includes('expense')) {
          value = form1120Data.rentExpense;
        }
        else if (searchText.includes('tax') && searchText.includes('expense')) {
          value = form1120Data.taxes;
        }
        else if (searchText.includes('interest') && searchText.includes('expense')) {
          value = form1120Data.interest_expense;
        }
        else if (searchText.includes('charitable') || searchText.includes('contribution')) {
          value = form1120Data.charitable;
        }
        else if (searchText.includes('depreciation')) {
          value = form1120Data.depreciation;
        }
        else if (searchText.includes('advertising')) {
          value = form1120Data.advertising;
        }
        else if (searchText.includes('pension')) {
          value = form1120Data.pensionPlans;
        }
        else if (searchText.includes('employee benefit')) {
          value = form1120Data.employeeBenefits;
        }
        else if (searchText.includes('total deduction')) {
          value = form1120Data.totalDeductions;
        }
        // Tax
        else if (searchText.includes('taxable income')) {
          value = form1120Data.taxableIncome;
        }
        else if (searchText.includes('total tax')) {
          value = form1120Data.totalTax;
        }
        else if (searchText.includes('total assets')) {
          value = form1120Data.totalAssets;
        }

        if (value) {
          mappings.push({
            fieldId: field.id,
            fieldName: field.name,
            xpath: field.xpath,
            value: value
          });
        }
      });

      // Send message to content script to fill the form
      await chrome.tabs.sendMessage(tab.id, {
        action: 'fillFormFields',
        data: { mappings }
      });

      // Show success message
      syncBtn.textContent = '✓ Synced!';
      syncBtn.style.backgroundColor = '#28a745';

      // Show notification
      setTimeout(() => {
        alert(`✓ Synced from previous Excel session\n\nFilled ${mappings.length} fields with 1120 data`);
        window.close();
      }, 500);

    } catch (error) {
      console.error('Error syncing:', error);
      syncBtn.textContent = 'Sync Failed';
      syncBtn.style.backgroundColor = '#dc3545';
      setTimeout(() => {
        switchView(mainView);
      }, 1500);
    }
  }
});

// Function that runs in the context of the page to scan form fields
function scanFormFields() {
  const fields = [];

  // Find all input fields
  const inputs = document.querySelectorAll('input, select, textarea');

  inputs.forEach((field, index) => {
    // Skip hidden and button inputs
    if (field.type === 'hidden' || field.type === 'button' || field.type === 'submit') {
      return;
    }

    const fieldInfo = {
      type: field.tagName.toLowerCase(),
      inputType: field.type || 'text',
      id: field.id || `field_${index}`,
      name: field.name || '',
      placeholder: field.placeholder || '',
      value: field.value || '',
      label: '',
      xpath: getXPath(field)
    };

    // Try to find associated label
    const label = field.labels?.[0] ||
                  document.querySelector(`label[for="${field.id}"]`) ||
                  field.closest('label');

    if (label) {
      fieldInfo.label = label.textContent.trim();
    }

    fields.push(fieldInfo);
  });

  return {
    fields: fields,
    fieldCount: fields.length,
    url: window.location.href,
    title: document.title
  };
}

// Helper function to get XPath of an element
function getXPath(element) {
  if (element.id !== '') {
    return `//*[@id="${element.id}"]`;
  }
  if (element === document.body) {
    return '/html/body';
  }

  let ix = 0;
  const siblings = element.parentNode?.childNodes || [];

  for (let i = 0; i < siblings.length; i++) {
    const sibling = siblings[i];
    if (sibling === element) {
      return getXPath(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
    }
    if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
      ix++;
    }
  }
}
