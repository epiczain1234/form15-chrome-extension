// Content script that runs on all pages
// This script can detect and interact with form fields on tax websites

console.log('Tax Form Auto-Fill content script loaded');

// Listen for messages from the popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scanFormFields') {
    const formData = scanFormFields();
    sendResponse(formData);
  } else if (request.action === 'fillFormFields') {
    fillFormFields(request.data);
    sendResponse({ success: true });
  }
  return true; // Keep the message channel open for async responses
});

// Function to scan all form fields on the page
function scanFormFields() {
  const fields = [];
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
      xpath: getXPath(field),
      className: field.className || ''
    };

    // Try to find associated label
    const label = field.labels?.[0] ||
                  document.querySelector(`label[for="${field.id}"]`) ||
                  field.closest('label');

    if (label) {
      fieldInfo.label = label.textContent.trim();
    } else {
      // Try to find nearby text that might be a label
      const parent = field.parentElement;
      if (parent) {
        const textContent = parent.textContent.trim();
        if (textContent.length < 100) { // Reasonable label length
          fieldInfo.label = textContent.replace(field.value, '').trim();
        }
      }
    }

    fields.push(fieldInfo);
  });

  return {
    fields: fields,
    fieldCount: fields.length,
    url: window.location.href,
    title: document.title,
    hostname: window.location.hostname
  };
}

// Function to fill form fields with provided data
function fillFormFields(data) {
  if (!data || !data.mappings) {
    console.error('No field mappings provided');
    return;
  }

  data.mappings.forEach(mapping => {
    let field;

    // Try to find the field by ID first
    if (mapping.fieldId) {
      field = document.getElementById(mapping.fieldId);
    }

    // If not found, try by name
    if (!field && mapping.fieldName) {
      field = document.querySelector(`[name="${mapping.fieldName}"]`);
    }

    // If not found, try by XPath
    if (!field && mapping.xpath) {
      field = getElementByXPath(mapping.xpath);
    }

    // Fill the field if found
    if (field) {
      if (field.tagName.toLowerCase() === 'select') {
        // For select elements, try to find the matching option
        const options = Array.from(field.options);
        const matchingOption = options.find(opt =>
          opt.value === mapping.value || opt.text === mapping.value
        );
        if (matchingOption) {
          field.value = matchingOption.value;
          field.dispatchEvent(new Event('change', { bubbles: true }));
        }
      } else if (field.type === 'checkbox' || field.type === 'radio') {
        // For checkboxes and radios
        field.checked = mapping.value === true || mapping.value === 'true' || mapping.value === '1';
        field.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        // For text inputs and textareas
        field.value = mapping.value;
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));
      }

      // Highlight the filled field
      field.style.backgroundColor = '#E8F4F8';
      setTimeout(() => {
        field.style.backgroundColor = '';
      }, 1500);

      // Add "View Source" button next to the filled field
      addViewSourceButton(field);
    }
  });
}

// Function to add "View Source" button next to a field
function addViewSourceButton(field) {
  // Only add button if field has a value
  if (!field.value || field.value.trim() === '') {
    return;
  }

  // Check if button already exists
  const existingButton = field.parentElement.querySelector('.tax-extension-view-source-btn');
  if (existingButton) {
    return; // Button already exists
  }

  // Create the View Source button
  const viewSourceBtn = document.createElement('button');
  viewSourceBtn.textContent = 'View Source';
  viewSourceBtn.className = 'tax-extension-view-source-btn';
  viewSourceBtn.type = 'button';

  // Style the button
  viewSourceBtn.style.cssText = `
    padding: 8px 12px;
    background-color: #1e40af;
    color: white;
    border: 1px solid #1e40af;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    margin-left: 8px;
    white-space: nowrap;
    transition: background-color 0.2s;
  `;

  // Add hover effect
  viewSourceBtn.addEventListener('mouseenter', () => {
    viewSourceBtn.style.backgroundColor = '#1e3a8a';
  });
  viewSourceBtn.addEventListener('mouseleave', () => {
    viewSourceBtn.style.backgroundColor = '#1e40af';
  });

  // Add click handler to navigate to Google
  viewSourceBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.open('https://google.com', '_blank');
  });

  // Insert the button after the field
  // Check if field is in a wrapper div (like field-input-group)
  const parent = field.parentElement;
  if (parent && parent.classList.contains('field-input-group')) {
    parent.appendChild(viewSourceBtn);
  } else {
    // Insert after the field directly
    field.parentNode.insertBefore(viewSourceBtn, field.nextSibling);
  }
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

// Helper function to get element by XPath
function getElementByXPath(xpath) {
  return document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
}

// Detect if this is a tax form page and notify the extension
function detectTaxFormPage() {
  const url = window.location.href.toLowerCase();
  const title = document.title.toLowerCase();

  const taxKeywords = ['tax', '1120', '1065', '1040', 'prosystem', 'drake', 'lacerte', 'ultratax'];
  const isTaxPage = taxKeywords.some(keyword =>
    url.includes(keyword) || title.includes(keyword)
  );

  if (isTaxPage) {
    const formData = scanFormFields();
    if (formData.fieldCount > 5) { // Only notify if there are significant form fields
      chrome.runtime.sendMessage({
        action: 'taxFormDetected',
        data: formData
      });
    }
  }
}

// Run detection when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', detectTaxFormPage);
} else {
  detectTaxFormPage();
}
