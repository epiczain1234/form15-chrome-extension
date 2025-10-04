// Hardcoded 1120 tax form data
const form1120Data = {
  companyName: 'Acme Corporation',
  ein: '12-3456789',
  businessCode: '541511',
  dateIncorporated: '01/15/2015',
  totalAssets: '5250000',
  address: '123 Business Street',
  city: 'New York',
  state: 'NY',
  zipCode: '10001',
  grossReceipts: '2500000',
  returnsAllowances: '75000',
  costOfGoodsSold: '1200000',
  grossProfit: '1250000',
  dividends: '25000',
  interest: '15000',
  grossRents: '180000',
  grossRoyalties: '45000',
  capitalGainNetIncome: '35000',
  netGainLoss: '12000',
  otherIncome: '28000',
  totalIncome: '1455000',
  compensation: '450000',
  salariesWages: '350000',
  repairs: '25000',
  badDebts: '15000',
  rentExpense: '60000',
  taxes: '85000',
  interest_expense: '45000',
  charitable: '20000',
  depreciation: '125000',
  advertising: '75000',
  pensionPlans: '55000',
  employeeBenefits: '45000',
  otherDeductions: '95000',
  totalDeductions: '1445000',
  taxableIncome: '10000',
  totalTax: '2100',
  paymentsCredits: '2500',
  overpayment: '400',
  cashBeginning: '250000',
  cashEnding: '325000',
  accountsReceivableBeginning: '180000',
  accountsReceivableEnding: '210000',
  inventoryBeginning: '450000',
  inventoryEnding: '485000',
  buildingsBeginning: '2800000',
  buildingsEnding: '2750000',
  accountsPayableBeginning: '125000',
  accountsPayableEnding: '145000',
  capitalStockBeginning: '1000000',
  capitalStockEnding: '1000000',
  retainedEarningsBeginning: '2500000',
  retainedEarningsEnding: '2550000'
};

// Helper functions (defined before DOM loads for better performance)
function switchView(viewToShow, views) {
  views.forEach(view => view.classList.remove('active'));
  viewToShow.classList.add('active');
}

function cleanWebsiteName(hostname) {
  const cleaned = hostname.replace(/^www\./, '').replace(/\.(com|net|org|edu|gov|co|io|ai).*$/, '');
  const specialCases = {
    prosystemfx: 'ProSystemFx', cchaxcess: 'CCH Axcess', draketax: 'Drake Tax',
    lacerte: 'Lacerte', proseries: 'ProSeries', turbotax: 'TurboTax',
    taxact: 'TaxAct', ultratax: 'UltraTax'
  };
  return specialCases[cleaned.toLowerCase()] || cleaned.split(/[-_.]/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
}

function scanFormFields() {
  const fields = [];
  document.querySelectorAll('input, select, textarea').forEach((field, index) => {
    if (field.type === 'hidden' || field.type === 'button' || field.type === 'submit') return;
    const label = field.labels?.[0] || document.querySelector(`label[for="${field.id}"]`) || field.closest('label');
    fields.push({
      type: field.tagName.toLowerCase(),
      inputType: field.type || 'text',
      id: field.id || `field_${index}`,
      name: field.name || '',
      placeholder: field.placeholder || '',
      value: field.value || '',
      label: label ? label.textContent.trim() : '',
      xpath: getXPath(field)
    });
  });
  return { fields, fieldCount: fields.length, url: window.location.href, title: document.title };
}

function getXPath(element) {
  if (element.id) return `//*[@id="${element.id}"]`;
  if (element === document.body) return '/html/body';
  let ix = 0;
  const siblings = element.parentNode?.childNodes || [];
  for (let i = 0; i < siblings.length; i++) {
    const sibling = siblings[i];
    if (sibling === element) return getXPath(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
    if (sibling.nodeType === 1 && sibling.tagName === element.tagName) ix++;
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const views = [document.getElementById('mainView'), document.getElementById('loadingView'), document.getElementById('resultsView')];
  const [mainView, loadingView, resultsView] = views;
  const optionButtons = document.querySelectorAll('.option-btn');
  const backBtn = document.getElementById('backBtn');
  const doneBtn = document.getElementById('doneBtn');

  // Handle option button clicks
  optionButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const action = button.dataset.action;
      switchView(loadingView, views);
      const loadingText = document.querySelector('.loading-text');
      const loadingSubtext = document.querySelector('.loading-subtext');

      const messages = {
        'import-excel': ['Importing from Excel...', 'Loading workbook data'],
        'import-tax-form': ['Importing tax form...', 'Processing form data'],
        'fill-tax-data': ['Scanning page...', 'Detecting form fields']
      };
      [loadingText.textContent, loadingSubtext.textContent] = messages[action] || ['Loading...', 'Please wait'];

      if (action === 'fill-tax-data') {
        try {
          const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

          // Inject and execute the content script
          const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: scanFormFields
          });

          const formData = results[0].result;

          // Store the scan data
          chrome.storage.local.set({
            lastScan: {
              fields: formData.fields,
              timestamp: Date.now()
            }
          });

          // Immediately fill the fields
          const mappings = [];
          formData.fields.forEach(field => {
            const fieldLabel = field.label.toLowerCase();
            const fieldName = field.name.toLowerCase();
            const fieldId = field.id.toLowerCase();
            const searchText = `${fieldLabel} ${fieldName} ${fieldId}`;

            let value = null;
            // Company/Name fields
            if (searchText.includes('company') || searchText.includes('corporation') || searchText.includes('name')) {
              value = form1120Data.companyName;
            }
            else if (searchText.includes('ein') || searchText.includes('tax id') || searchText.includes('employer identification')) {
              value = form1120Data.ein;
            }
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
            else if (searchText.includes('gross receipts') || searchText.includes('gross sales')) {
              value = form1120Data.grossReceipts;
            }
            else if (searchText.includes('returns') && searchText.includes('allowances')) {
              value = form1120Data.returnsAllowances;
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
            else if (searchText.includes('gross rents') || (searchText.includes('rent') && !searchText.includes('expense'))) {
              value = form1120Data.grossRents;
            }
            else if (searchText.includes('gross royalties') || searchText.includes('royalties')) {
              value = form1120Data.grossRoyalties;
            }
            else if (searchText.includes('capital gain')) {
              value = form1120Data.capitalGainNetIncome;
            }
            else if (searchText.includes('net gain') || searchText.includes('net loss')) {
              value = form1120Data.netGainLoss;
            }
            else if (searchText.includes('other income')) {
              value = form1120Data.otherIncome;
            }
            else if (searchText.includes('total income')) {
              value = form1120Data.totalIncome;
            }
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

          // Fill the form
          await chrome.tabs.sendMessage(tab.id, {
            action: 'fillFormFields',
            data: { mappings }
          });

          // Show success
          document.getElementById('resultsTitle').textContent = 'Success';
          document.getElementById('resultsMessage').textContent = 'Filled out eligible fields';
          document.getElementById('resultsWebsite').textContent = 'Data successfully imported';

          switchView(resultsView, views);
        } catch (error) {
          console.error('Error filling page:', error);
          alert('Error filling page. Please try again.');
          switchView(mainView, views);
        }
      } else if (action === 'import-excel') {
        // Excel import
        setTimeout(() => {
          document.getElementById('resultsTitle').textContent = 'Success';
          document.getElementById('resultsMessage').textContent = 'Data successfully imported';
          document.getElementById('resultsWebsite').textContent = 'from 1120ExcelData_Acme.xlsx';
          switchView(resultsView, views);
        }, 1500);
      } else if (action === 'import-tax-form') {
        // Tax form import
        setTimeout(() => {
          document.getElementById('resultsTitle').textContent = 'Success';
          document.getElementById('resultsMessage').textContent = 'Data successfully imported';
          document.getElementById('resultsWebsite').textContent = 'from 1120TaxFormAcme.pdf';
          switchView(resultsView, views);
        }, 1500);
      }
    });
  });

  backBtn.addEventListener('click', () => switchView(mainView, views));

  doneBtn.addEventListener('click', () => switchView(mainView, views));
}); // End of DOMContentLoaded

/* OLD SYNC CODE - REMOVED
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
        else if (searchText.includes('returns') && searchText.includes('allowances')) {
          value = form1120Data.returnsAllowances;
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
        else if (searchText.includes('gross rents') || (searchText.includes('rent') && !searchText.includes('expense'))) {
          value = form1120Data.grossRents;
        }
        else if (searchText.includes('gross royalties') || searchText.includes('royalties')) {
          value = form1120Data.grossRoyalties;
        }
        else if (searchText.includes('capital gain')) {
          value = form1120Data.capitalGainNetIncome;
        }
        else if (searchText.includes('net gain') || searchText.includes('net loss')) {
          value = form1120Data.netGainLoss;
        }
        else if (searchText.includes('other income')) {
          value = form1120Data.otherIncome;
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
}); // End of DOMContentLoaded
*/
