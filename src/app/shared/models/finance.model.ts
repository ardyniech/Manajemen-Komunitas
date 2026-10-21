export type TransactionType = 'iuran' | 'pemasukan_lain' | 'pengeluaran';
export type PaymentStatus = 'lunas' | 'menunggu' | 'batal';
export type PaymentMethod = 'qris' | 'transfer_bank' | 'tunai' | 'virtual_account';

export interface FinanceTransaction {
  id: string;
  transactionNumber: string;
  date: string;
  type: TransactionType;
  category: string;
  title: string;
  amount: number;
  memberId?: string;
  memberName?: string;
  status: PaymentStatus;
  method: PaymentMethod;
  proofUrl?: string;
  notes?: string;
}

export interface DuesMonthlyOverview {
  monthYear: string;
  targetCount: number;
  paidCount: number;
  totalCollected: number;
  pendingAmount: number;
}
