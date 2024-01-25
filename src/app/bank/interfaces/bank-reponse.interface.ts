export interface BankResponse {
  totalCount: number;
  result: Result[];
}

export interface Result {
  id: string;
  name: string;
  code: string;
}
