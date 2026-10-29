import { Transaction } from '../types/blockchain';

export const GENESIS_PREVIOUS_HASH = '0';

export interface SeedBlockDefinition {
  index: number;
  timestamp: string;
  transactions: Transaction[];
  nonce: number;
}

/**
 * Immutable seed data for ChainTrace demonstration.
 * Contains 1 Genesis Block (0 transactions) and 4 regular blocks with 10 total fictional INR transactions.
 * All data is strictly fictional for educational demonstration.
 */
export const SEED_BLOCKS: readonly SeedBlockDefinition[] = [
  {
    index: 0,
    timestamp: '2025-01-10T09:00:00.000Z',
    transactions: [],
    nonce: 0,
  },
  {
    index: 1,
    timestamp: '2025-01-10T10:15:30.000Z',
    nonce: 0,
    transactions: [
      {
        id: 'tx-101',
        timestamp: '2025-01-10T10:12:00.000Z',
        sender: 'Aarav Sharma',
        recipient: 'Priya Verma',
        amount: 2500,
        currency: 'INR',
        description: 'Semester textbooks reimbursement',
        reference: 'REF-DEMO-2001',
      },
      {
        id: 'tx-102',
        timestamp: '2025-01-10T10:14:45.000Z',
        sender: 'Vikram Mehta',
        recipient: 'Campus Cafeteria Services',
        amount: 450,
        currency: 'INR',
        description: 'Student meal plan top-up',
        reference: 'REF-DEMO-2002',
      },
    ],
  },
  {
    index: 2,
    timestamp: '2025-01-10T11:45:10.000Z',
    nonce: 0,
    transactions: [
      {
        id: 'tx-201',
        timestamp: '2025-01-10T11:30:20.000Z',
        sender: 'Rohan Gupta',
        recipient: 'TechHub Electronics Bangalore',
        amount: 8750,
        currency: 'INR',
        description: 'Hardware lab microcontroller kit',
        reference: 'REF-DEMO-2003',
      },
      {
        id: 'tx-202',
        timestamp: '2025-01-10T11:38:05.000Z',
        sender: 'Ananya Deshmukh',
        recipient: 'Zest Academic Publications',
        amount: 1200,
        currency: 'INR',
        description: 'Conference paper publishing fee',
        reference: 'REF-DEMO-2004',
      },
      {
        id: 'tx-203',
        timestamp: '2025-01-10T11:42:15.000Z',
        sender: 'Devendra Joshi',
        recipient: 'Aditi Kulkarni',
        amount: 3400,
        currency: 'INR',
        description: 'Shared student accommodation rent share',
        reference: 'REF-DEMO-2005',
      },
    ],
  },
  {
    index: 3,
    timestamp: '2025-01-10T14:20:00.000Z',
    nonce: 0,
    transactions: [
      {
        id: 'tx-301',
        timestamp: '2025-01-10T13:55:00.000Z',
        sender: 'Kavita Rao',
        recipient: 'SkillUp Cloud Labs',
        amount: 5600,
        currency: 'INR',
        description: 'Distributed systems workshop license',
        reference: 'REF-DEMO-2006',
      },
      {
        id: 'tx-302',
        timestamp: '2025-01-10T14:10:40.000Z',
        sender: 'Rajesh Nair',
        recipient: 'Greenleaf Stationery Mart',
        amount: 980,
        currency: 'INR',
        description: 'Annual project report binding supplies',
        reference: 'REF-DEMO-2007',
      },
    ],
  },
  {
    index: 4,
    timestamp: '2025-01-10T16:05:22.000Z',
    nonce: 0,
    transactions: [
      {
        id: 'tx-401',
        timestamp: '2025-01-10T15:40:10.000Z',
        sender: 'Pooja Sundaram',
        recipient: 'Metro Mobility Services',
        amount: 650,
        currency: 'INR',
        description: 'Smartcard transit recharge',
        reference: 'REF-DEMO-2008',
      },
      {
        id: 'tx-402',
        timestamp: '2025-01-10T15:52:30.000Z',
        sender: 'Tanmay Agarwal',
        recipient: 'Apex Data Science Guild',
        amount: 4200,
        currency: 'INR',
        description: 'Hackathon registration and mentor pass',
        reference: 'REF-DEMO-2009',
      },
      {
        id: 'tx-403',
        timestamp: '2025-01-10T16:01:00.000Z',
        sender: 'Sanya Mirza',
        recipient: 'Digital Media Studios',
        amount: 1500,
        currency: 'INR',
        description: 'Project presentation graphic design asset',
        reference: 'REF-DEMO-2010',
      },
    ],
  },
];
