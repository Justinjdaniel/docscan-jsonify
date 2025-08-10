/**
 * Parses raw text from an OCR engine to extract structured data.
 * @param {string} rawText - The raw text output from the OCR engine.
 * @returns {object} An object containing the extracted data.
 */
export const parseOCRResult = (rawText) => {
  const extractedData = {
    invoiceNumber: null,
    date: null,
    subTotal: null,
    tax: null,
    grandTotal: null,
    rawText,
  };

  // Very specific regex based on the sample invoice image.
  // A more robust solution would use more flexible regex or NLP.

  // Invoice Number: "Invoice No. 1234"
  const invoiceRegex = /Invoice No\.\s*(\d+)/i;
  const invoiceMatch = rawText.match(invoiceRegex);
  if (invoiceMatch && invoiceMatch[1]) {
    extractedData.invoiceNumber = invoiceMatch[1];
  }

  // Date: "Date : 24 / 12 / 2020"
  const dateRegex = /Date\s*:\s*([\d\s/]+)/i;
  const dateMatch = rawText.match(dateRegex);
  if (dateMatch && dateMatch[1]) {
    extractedData.date = dateMatch[1].replace(/\s/g, '');
  }

  // For totals, we look for the line containing the keyword and then try to find a number nearby
  const findTotal = (keyword) => {
    try {
      const regex = new RegExp(`${keyword}[\\s:]*([\\d,.]+)`, 'i');
      const match = rawText.match(regex);
      if (match && match[1]) {
        return parseFloat(match[1].replace(/,/g, ''));
      }
    } catch (e) {
      // Ignore regex errors for now
    }
    return null;
  };

  extractedData.subTotal = findTotal('SUB TOTAL');
  extractedData.tax = findTotal('TAX');
  extractedData.grandTotal = findTotal('GRAND TOTAL');

  return extractedData;
};
