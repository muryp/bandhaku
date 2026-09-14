export type TTransactionType = 'piutang' | 'utang';
export type TWalletType = 'Cash' | 'Bank';

export interface TTransaction {
    id: number;
    date: string;
    type: TTransactionType;
    client: string;
    amount: number;
    wallet: TWalletType;
    tags: string[];
}

export interface TFilterState {
    clients: string[];
    tags: string[];
    type: string;
    wallet: string;
    period: string;
    customStartDate?: string;
    customEndDate?: string;
}