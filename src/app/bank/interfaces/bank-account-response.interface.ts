export interface BankAccountResponse {
  transferBankAccounts: TransferBankAccounts;
  mobilePayBankAccounts: MobilePayBankAccounts;
  zelleBankAccounts: ZelleBankAccounts;
}

export interface MobilePayBankAccounts {
  totalCount: number;
  result: MobilePayBankAccountsResult[];
}

export interface MobilePayBankAccountsResult {
  id: string;
  accountHolderPhone: string;
  accountHolderDocument: string;
  accountAlias: string;
  isShown: boolean;
  bank: Bank;
}

export interface Bank {
  id: string;
  name: string;
  code: string;
}

export interface TransferBankAccounts {
  totalCount: number;
  result: TransferBankAccountsResult[];
}

export interface TransferBankAccountsResult {
  id: string;
  accountNumber: string;
  accountHolderName: string;
  accountHolderEmail: string;
  accountHolderDocument: string;
  accountAlias: string;
  isShown: boolean;
  bank: Bank;
}

export interface ZelleBankAccounts {
  totalCount: number;
  result: ZelleBankAccountsResult[];
}

export interface ZelleBankAccountsResult {
  id: string;
  accountHolderEmail: string;
  accountHolderName: string;
  accountAlias: string;
  isShown: boolean;
}
