import { OCRScanResult } from '../types';

export interface PresetReceipt {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  amount: number;
  badge: 'Safe' | 'Warning' | 'Critical Alert';
  imageUri?: string;
  mockResult: OCRScanResult;
}

export const PRESET_RECEIPTS: PresetReceipt[] = [
  {
    id: 'receipt-1',
    title: 'FreshMart Supermarket',
    subtitle: 'Weekly Groceries & Pantry Items',
    category: 'Groceries',
    amount: 2450,
    badge: 'Safe',
    mockResult: {
      merchant: 'FreshMart Supermarket Ltd.',
      date: '2026-09-06',
      amount: 2450,
      category: 'Groceries',
      paymentMethod: 'UPI',
      confidence: 0.98,
      rawText: 'FRESHMART SUPERMARKET\nGSTIN: 29AAAAA0000A1Z5\nDate: 06/09/2026 18:42\n1. Farm Fresh Milk 2L - ₹140.00\n2. Basmati Rice 5kg - ₹650.00\n3. Olive Oil Extra Virgin 1L - ₹890.00\n4. Organic Vegetables Assorted - ₹420.00\n5. Whole Wheat Bread - ₹60.00\n6. Greek Yogurt - ₹290.00\nTOTAL: ₹2,450.00\nPAID VIA UPI: OKAXIS',
      lineItems: [
        { description: 'Farm Fresh Milk 2L', price: 140, quantity: 2 },
        { description: 'Basmati Rice 5kg', price: 650, quantity: 1 },
        { description: 'Olive Oil Extra Virgin 1L', price: 890, quantity: 1 },
        { description: 'Organic Vegetables Assorted', price: 420, quantity: 1 },
        { description: 'Greek Yogurt Pack', price: 290, quantity: 2 },
        { description: 'Whole Wheat Bread', price: 60, quantity: 1 }
      ],
      budgetCheck: {
        categoryLimit: 7000,
        spentBefore: 3200,
        spentAfter: 5650,
        remainingAfter: 1350,
        status: 'within',
        message: 'Logged. You have ₹1,350 left in Groceries this month.',
        isOverallBreach: false
      }
    }
  },
  {
    id: 'receipt-2',
    title: 'Croma Electronics - Flagship Phone',
    subtitle: 'Purchase of Apple iPhone 16 / S24',
    category: 'Shopping & Gadgets',
    amount: 69999,
    badge: 'Critical Alert',
    mockResult: {
      merchant: 'Croma Megastore Electronics',
      date: '2026-09-06',
      amount: 69999,
      category: 'Shopping & Gadgets',
      paymentMethod: 'Credit Card',
      confidence: 0.99,
      rawText: 'CROMA MEGASTORE - INDIRANAGAR\nINVOICE NO: CR-2026-88941\nITEM: Apple iPhone 16 128GB Black\nIMEI: 354891028471928\nPRICE: ₹69,999.00\nCGST 9%: ₹5,400.00\nSGST 9%: ₹5,400.00\nNET PAYABLE: ₹69,999.00\nMODE: POS CARD SWIPE',
      lineItems: [
        { description: 'Apple iPhone 16 128GB Black', price: 69999, quantity: 1 }
      ],
      budgetCheck: {
        categoryLimit: 3000,
        spentBefore: 2400,
        spentAfter: 72399,
        remainingAfter: -69399,
        status: 'exceeded',
        message: 'CRITICAL ALERT: This bill is ₹69,399 above your Shopping & Gadgets budget this month!',
        isOverallBreach: true
      }
    }
  },
  {
    id: 'receipt-3',
    title: 'The Olive Bistro & Bar',
    subtitle: 'Weekend Dinner & Drinks',
    category: 'Dining & Food',
    amount: 1850,
    badge: 'Warning',
    mockResult: {
      merchant: 'The Olive Bistro & Bar',
      date: '2026-09-05',
      amount: 1850,
      category: 'Dining & Food',
      paymentMethod: 'Credit Card',
      confidence: 0.96,
      rawText: 'THE OLIVE BISTRO\nTable: 14 | Guests: 3\n1. Woodfired Truffle Pizza - ₹650.00\n2. Pasta Alfredo Chicken - ₹520.00\n3. Craft Mocktails x 2 - ₹480.00\n4. Tiramisu Dessert - ₹200.00\nSUBTOTAL: ₹1,850.00\nTHANK YOU FOR DINING WITH US!',
      lineItems: [
        { description: 'Woodfired Truffle Pizza', price: 650, quantity: 1 },
        { description: 'Pasta Alfredo Chicken', price: 520, quantity: 1 },
        { description: 'Craft Mocktails', price: 480, quantity: 2 },
        { description: 'Tiramisu Dessert', price: 200, quantity: 1 }
      ],
      budgetCheck: {
        categoryLimit: 3500,
        spentBefore: 2950,
        spentAfter: 4800,
        remainingAfter: -1300,
        status: 'exceeded',
        message: 'Approaching/Breaching limit: This bill pushes Dining & Food to 137% of monthly allocation.',
        isOverallBreach: false
      }
    }
  },
  {
    id: 'receipt-4',
    title: 'BESCOM Power Utility Bill',
    subtitle: 'Monthly Electricity Meter Invoice',
    category: 'Utilities & Bills',
    amount: 2400,
    badge: 'Warning',
    mockResult: {
      merchant: 'BESCOM Utility Electricity',
      date: '2026-09-04',
      amount: 2400,
      category: 'Utilities & Bills',
      paymentMethod: 'UPI',
      confidence: 0.99,
      rawText: 'BANGALORE ELECTRICITY SUPPLY CORP\nAccount ID: 1098472910\nUnits Consumed: 342 kWh\nEnergy Charges: ₹1,980.00\nFixed FPA charges: ₹420.00\nTOTAL BILL AMOUNT: ₹2,400.00\nDue Date: 18/09/2026',
      lineItems: [
        { description: 'Electricity Unit Charges (342 kWh)', price: 1980, quantity: 1 },
        { description: 'Fixed charges & taxes', price: 420, quantity: 1 }
      ],
      budgetCheck: {
        categoryLimit: 2000,
        spentBefore: 1600,
        spentAfter: 4000,
        remainingAfter: -2000,
        status: 'exceeded',
        message: 'Utility bill is ₹400 above your typical ₹2,000 monthly utility allocation.',
        isOverallBreach: false
      }
    }
  }
];
