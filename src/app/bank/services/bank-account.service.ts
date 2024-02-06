import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, delay, of } from 'rxjs';
import { enviroments } from 'src/environments/environments';
import {
  BankAccountResponse,
  MobilePayBankAccountsResult,
  TransferBankAccountsResult,
  ZelleBankAccountsResult,
} from '../interfaces/bank-account-response.interface';

@Injectable({ providedIn: 'root' })
export class BankAccountService {
  private url: string = enviroments.ofmaBackendUrl;
  private path: string = '/api/bank-account/';

  constructor(private httpClient: HttpClient) {}

  getBankAccounts(): Observable<BankAccountResponse> {
    const token = localStorage.getItem('token');
    return this.httpClient.get<BankAccountResponse>(`${this.url}${this.path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  createZelleBankAcount(
    zelleBankAccount: ZelleBankAccountsResult
  ): Observable<ZelleBankAccountsResult | string> {
    const token = localStorage.getItem('token');
    return this.httpClient
      .post<ZelleBankAccountsResult>(
        `${this.url}${this.path}zelle`,
        {
          ...zelleBankAccount,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .pipe(
        catchError((err) => {
          return of('unknow_err');
        })
      );
  }

  createMobilePayBankAcount(
    mobilePayBankAccount: MobilePayBankAccountsResult
  ): Observable<MobilePayBankAccountsResult | string> {
    const token = localStorage.getItem('token');
    return this.httpClient
      .post<MobilePayBankAccountsResult>(
        `${this.url}${this.path}mobile-pay`,
        {
          ...mobilePayBankAccount,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .pipe(
        catchError((err) => {
          return of('unknow_err');
        })
      );
  }

  createTransferBankAcount(
    mobilePayBankAccount: TransferBankAccountsResult
  ): Observable<TransferBankAccountsResult | string> {
    const token = localStorage.getItem('token');
    return this.httpClient
      .post<TransferBankAccountsResult>(
        `${this.url}${this.path}transfer`,
        {
          ...mobilePayBankAccount,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .pipe(
        catchError((err) => {
          return of('unknow_err');
        })
      );
  }

  updateBankAccount(
    id: string,
    type: 'zelle' | 'transfer' | 'mobile-pay',
    accountAlias: string | undefined,
    isShown: boolean | undefined
  ): Observable<
    | TransferBankAccountsResult
    | MobilePayBankAccountsResult
    | ZelleBankAccountsResult
    | string
  > {
    const token = localStorage.getItem('token');
    return this.httpClient
      .patch<
        | TransferBankAccountsResult
        | MobilePayBankAccountsResult
        | ZelleBankAccountsResult
      >(
        `${this.url}${this.path}${type}/${id}`,
        {
          accountAlias,
          isShown,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .pipe(
        catchError((err) => {
          return of('unknow_err');
        })
      );
  }

  deleteBankAccount(
    id: string,
    type: 'zelle' | 'transfer' | 'mobile-pay'
  ): Observable<
    | TransferBankAccountsResult
    | MobilePayBankAccountsResult
    | ZelleBankAccountsResult
    | string
  > {
    const token = localStorage.getItem('token');
    return this.httpClient
      .delete<
        | TransferBankAccountsResult
        | MobilePayBankAccountsResult
        | ZelleBankAccountsResult
      >(
        `${this.url}${this.path}${type}/${id}`,

        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .pipe(
        catchError((err) => {
          return of('unknow_err');
        })
      );
  }
}
