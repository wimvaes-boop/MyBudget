/**
 * Intelligent Receipt / Kassaticket Parser for Belgian & Dutch receipts
 * Extracts Total Amount, Store/Merchant Name, Date, Payment Method, and Suggests Category.
 */

// Known stores and their mapping to category IDs and payment methods
const STORE_RULES = [
  // Supermarkets & Groceries
  { patterns: ['delhaize', 'ad delhaize', 'proxy delhaize'], name: 'Delhaize', categoryId: 'exp_groceries', method: 'meal_voucher' },
  { patterns: ['colruyt', 'okay', 'bio-planet', 'collect&go'], name: 'Colruyt', categoryId: 'exp_groceries', method: 'meal_voucher' },
  { patterns: ['albert heijn', 'ah '], name: 'Albert Heijn', categoryId: 'exp_groceries', method: 'bank' },
  { patterns: ['carrefour', 'carrefour express', 'carrefour market'], name: 'Carrefour', categoryId: 'exp_groceries', method: 'meal_voucher' },
  { patterns: ['lidl'], name: 'Lidl', categoryId: 'exp_groceries', method: 'meal_voucher' },
  { patterns: ['aldi'], name: 'Aldi', categoryId: 'exp_groceries', method: 'meal_voucher' },
  { patterns: ['spar'], name: 'Spar', categoryId: 'exp_groceries', method: 'meal_voucher' },
  { patterns: ['bakkerij', 'bakker', 'boulangerie'], name: 'Bakkerij', categoryId: 'exp_groceries', method: 'cash' },
  { patterns: ['slagerij', 'slager', 'boucherie'], name: 'Slagerij', categoryId: 'exp_groceries', method: 'meal_voucher' },

  // Transport & Fuel
  { patterns: ['total', 'totalenergies'], name: 'TotalEnergies', categoryId: 'exp_transport', method: 'bank' },
  { patterns: ['shell'], name: 'Shell', categoryId: 'exp_transport', method: 'bank' },
  { patterns: ['q8'], name: 'Q8', categoryId: 'exp_transport', method: 'bank' },
  { patterns: ['esso'], name: 'Esso', categoryId: 'exp_transport', method: 'bank' },
  { patterns: ['dats 24', 'dats'], name: 'DATS 24', categoryId: 'exp_transport', method: 'bank' },
  { patterns: ['lukoil'], name: 'Lukoil', categoryId: 'exp_transport', method: 'bank' },
  { patterns: ['nmbs', 'sncb', 'de lijn', 'mivb', 'stib'], name: 'Openbaar Vervoer', categoryId: 'exp_transport', method: 'bank' },

  // Health & Pharmacy
  { patterns: ['apotheek', 'pharmacie', 'pharmacien'], name: 'Apotheek', categoryId: 'exp_health', method: 'bank' },
  { patterns: ['kruidvat'], name: 'Kruidvat', categoryId: 'exp_health', method: 'bank' },
  { patterns: ['medi-market'], name: 'Medi-Market', categoryId: 'exp_health', method: 'bank' },
  { patterns: ['multipharma'], name: 'Multipharma', categoryId: 'exp_health', method: 'bank' },
  { patterns: ['holland & barrett'], name: 'Holland & Barrett', categoryId: 'exp_health', method: 'bank' },

  // Dining & Horeca
  { patterns: ['mcdonald', 'mc donald'], name: "McDonald's", categoryId: 'exp_dining', method: 'meal_voucher' },
  { patterns: ['burger king'], name: 'Burger King', categoryId: 'exp_dining', method: 'meal_voucher' },
  { patterns: ['quick'], name: 'Quick', categoryId: 'exp_dining', method: 'meal_voucher' },
  { patterns: ['panos'], name: 'Panos', categoryId: 'exp_dining', method: 'meal_voucher' },
  { patterns: ['starbucks', 'coffee', 'koffie'], name: 'Koffiebar', categoryId: 'exp_dining', method: 'bank' },
  { patterns: ['restaurant', 'brasserie', 'bistro', 'cafe', 'café', 'taverne', 'frituur'], name: 'Horeca', categoryId: 'exp_dining', method: 'bank' },

  // Art, Hobby, Books & Culture
  { patterns: ['schleiper', 'lucas creativ', 'de serre'], name: 'Kunst- & Tekenbenodigdheden', categoryId: 'exp_leisure', method: 'bank' },
  { patterns: ['fnac'], name: 'Fnac', categoryId: 'exp_leisure', method: 'bank' },
  { patterns: ['standaard boekhandel', 'boekhandel'], name: 'Standaard Boekhandel', categoryId: 'exp_leisure', method: 'bank' },

  // Retail & Goods
  { patterns: ['action'], name: 'Action', categoryId: 'exp_other_var', method: 'bank' },
  { patterns: ['hema'], name: 'Hema', categoryId: 'exp_other_var', method: 'bank' },
  { patterns: ['ikea'], name: 'Ikea', categoryId: 'exp_other_var', method: 'bank' },
  { patterns: ['brico', 'brico plan-it'], name: 'Brico', categoryId: 'exp_other_var', method: 'bank' },
  { patterns: ['gamma'], name: 'Gamma', categoryId: 'exp_other_var', method: 'bank' },
  { patterns: ['hubo'], name: 'Hubo', categoryId: 'exp_other_var', method: 'bank' },
  { patterns: ['decathlon'], name: 'Decathlon', categoryId: 'exp_leisure', method: 'bank' },
  { patterns: ['zara', 'h&m', 'c&a', 'primark'], name: 'Kledingwinkel', categoryId: 'exp_clothing', method: 'bank' }
];

/**
 * Parse OCR raw text into structured transaction fields
 * @param {string} rawText - OCR recognized text
 * @param {Array} categories - Available categories from app
 * @returns {Object} { amount, categoryId, note, date, paymentMethod, confidence, rawText }
 */
export function parseReceiptText(rawText, categories = []) {
  if (!rawText || typeof rawText !== 'string') {
    return {
      amount: '',
      categoryId: 'exp_groceries',
      note: 'Kassaticket',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'bank',
      confidence: 0,
      rawText: ''
    };
  }

  const lines = rawText
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);

  const fullTextLower = rawText.toLowerCase();

  // 1. Detect Store / Merchant
  let detectedStore = '';
  let suggestedCategoryId = '';
  let suggestedMethod = 'bank';

  for (const rule of STORE_RULES) {
    for (const pattern of rule.patterns) {
      if (fullTextLower.includes(pattern)) {
        detectedStore = rule.name;
        suggestedCategoryId = rule.categoryId;
        suggestedMethod = rule.method || 'bank';
        break;
      }
    }
    if (detectedStore) break;
  }

  // If no known store, take the first non-numeric/non-date line as merchant name
  if (!detectedStore) {
    for (const line of lines.slice(0, 5)) {
      const clean = line.replace(/[^a-zA-Z0-9\s&.-]/g, '').trim();
      if (clean.length >= 3 && !/\b(202\d|datum|uur|tel|btw|kassa)\b/i.test(clean)) {
        detectedStore = clean;
        break;
      }
    }
    detectedStore = detectedStore || 'Winkel / Kassabon';
  }

  // Fallback category
  if (!suggestedCategoryId) {
    // Check keywords in text
    if (/boodschap|fruit|groente|voeding|brood|melk|kaas|vlees|drank/i.test(fullTextLower)) {
      suggestedCategoryId = 'exp_groceries';
    } else if (/restaurant|menu|koffie|bier|wijn|lunch|diner/i.test(fullTextLower)) {
      suggestedCategoryId = 'exp_dining';
    } else if (/benzine|diesel|euro\s*95|super\s*98|brandstof|liter/i.test(fullTextLower)) {
      suggestedCategoryId = 'exp_transport';
    } else if (/apotheek|medicijn|tabletten|vitamine/i.test(fullTextLower)) {
      suggestedCategoryId = 'exp_health';
    } else {
      suggestedCategoryId = 'exp_groceries'; // most common receipt in daily life
    }
  }

  // 2. Detect Payment Method
  if (/edenred|monizze|sodexo|pluxee|maaltijdcheque|cheque\s*repas/i.test(fullTextLower)) {
    suggestedMethod = 'meal_voucher';
  } else if (/visa|mastercard|kredietkaart|credit/i.test(fullTextLower)) {
    suggestedMethod = 'credit_card';
  } else if (/cash|contant|ontvangen\s*cash|terug\s*cash/i.test(fullTextLower)) {
    suggestedMethod = 'cash';
  }

  // 3. Detect Total Amount
  // Strategy:
  // A. Search explicitly for lines with "totaal", "total", "te betalen", "eur", "€"
  // B. Fallback to the largest decimal price near the bottom half of the receipt.
  let detectedAmount = 0;
  const totalKeywords = ['totaal', 'total', 'te betalen', 'a payer', 'tebetalen', 'bedrag', 'totale', 'summe', 'netto'];

  // Look for keyword lines first (from bottom to top)
  for (let i = lines.length - 1; i >= 0; i--) {
    const lineLower = lines[i].toLowerCase();
    const hasKeyword = totalKeywords.some(k => lineLower.includes(k));

    if (hasKeyword) {
      // Find all prices in this line or the immediate next line
      const lineToSearch = `${lines[i]} ${lines[i + 1] || ''}`;
      const amounts = extractAmountsFromText(lineToSearch);
      if (amounts.length > 0) {
        // Take the highest amount found on the total line
        detectedAmount = Math.max(...amounts);
        break;
      }
    }
  }

  // If not found by keyword, inspect the bottom half of receipt for realistic total
  if (!detectedAmount || detectedAmount <= 0) {
    const allAmounts = extractAmountsFromText(rawText);
    if (allAmounts.length > 0) {
      // Often the total is the maximum number or among the last 3 amounts
      const lastFew = allAmounts.slice(-5);
      detectedAmount = Math.max(...lastFew);
    }
  }

  // 4. Detect Date
  let detectedDate = new Date().toISOString().split('T')[0];
  const dateRegex = /\b(\d{1,2})[\/\.-](\d{1,2})[\/\.-](20\d{2}|\d{2})\b/;
  const dateMatch = rawText.match(dateRegex);

  if (dateMatch) {
    let day = parseInt(dateMatch[1], 10);
    let month = parseInt(dateMatch[2], 10);
    let year = parseInt(dateMatch[3], 10);

    if (year < 100) year += 2000;

    // Swap if day/month seem inverted (e.g. month > 12)
    if (month > 12 && day <= 12) {
      const tmp = day;
      day = month;
      month = tmp;
    }

    if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 2020 && year <= 2035) {
      const mm = String(month).padStart(2, '0');
      const dd = String(day).padStart(2, '0');
      detectedDate = `${year}-${mm}-${dd}`;
    }
  }

  // Check if suggested category exists in actual categories list
  let finalCategoryId = suggestedCategoryId;
  if (categories && categories.length > 0) {
    const validCategory = categories.find(c => c.id === suggestedCategoryId);
    if (validCategory) {
      finalCategoryId = validCategory.id;
    } else {
      finalCategoryId = categories.find(c => c.type === 'expense')?.id || suggestedCategoryId || 'exp_groceries';
    }
  } else {
    finalCategoryId = suggestedCategoryId || 'exp_groceries';
  }

  return {
    amount: detectedAmount > 0 ? detectedAmount.toFixed(2) : '',
    categoryId: finalCategoryId,
    note: detectedStore,
    date: detectedDate,
    paymentMethod: suggestedMethod,
    confidence: detectedAmount > 0 ? 0.9 : 0.4,
    rawText
  };
}

/**
 * Extract numbers that resemble currency amounts (e.g. 12,99 or 12.99 or 1.250,50)
 */
function extractAmountsFromText(text) {
  const matches = [];
  // Matches 12,34 or 12.34 or 1.234,56 or 1,234.56
  const regex = /(?:€|EUR)?\s*([0-9]{1,4}(?:[.,][0-9]{2,3})*(?:[.,][0-9]{2}))/gi;
  let match;

  while ((match = regex.exec(text)) !== null) {
    let numStr = match[1];
    // Standardize to JavaScript decimal (dot)
    // If format is 1.234,56
    if (numStr.includes('.') && numStr.includes(',')) {
      if (numStr.indexOf('.') < numStr.indexOf(',')) {
        numStr = numStr.replace(/\./g, '').replace(',', '.');
      } else {
        numStr = numStr.replace(/,/g, '');
      }
    } else if (numStr.includes(',')) {
      numStr = numStr.replace(',', '.');
    }

    const val = parseFloat(numStr);
    // Ignore unreasonable numbers for a single receipt item/total (e.g. barcode numbers, telephone numbers, years like 2026)
    if (!isNaN(val) && val > 0.05 && val < 50000 && val !== 2024 && val !== 2025 && val !== 2026) {
      matches.push(val);
    }
  }

  return matches;
}
