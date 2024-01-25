export interface OrdersResponse {
  pending: Order[];
  failed: Order[];
  success: Order[];
}

export interface Order {
  id: string;
  amount: number;
  createdAt: Date;
  paidAt: Date;
  type: string;
  status: string;
  reference: string;
  user: User;
  exchangeRate: ExchangeRate | null;
  transferBankAccount: TransferBankAccount | null;
  mobilePayBankAccount: MobilePayBankAccount | null;
  zelleBankAccount: ZelleBankAccount | null;
}

export interface ExchangeRate {
  id: string;
  rate: number;
  createdAt: Date;
}

export interface MobilePayBankAccount {
  id: string;
  accountHolderPhone: string;
  accountHolderDocument: string;
  accountAlias: string;
  isShown: boolean;
}

export interface TransferBankAccount {
  id: string;
  accountNumber: string;
  accountHolderName: string;
  accountHolderEmail: string;
  accountHolderDocument: string;
  accountAlias: string;
  isShown: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  lastname: string;
  isCollaborator: boolean;
}

export interface ZelleBankAccount {
  id: string;
  accountHolderEmail: string;
  accountHolderName: string;
  accountAlias: string;
  isShown: boolean;
}
