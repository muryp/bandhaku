export interface Transaction {
  date: string;
  type: 'piutang' | 'utang';
  client: string;
  amount: number;
  currency: string;
  tags: string;
  wallet: string;
  ref?: string;
  desc?: string;
}