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
    }
  });
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
