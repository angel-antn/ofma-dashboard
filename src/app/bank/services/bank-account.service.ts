import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, delay, of } from 'rxjs';
import { enviroments } from 'src/environments/environments';
import { BankAccountResponse } from '../interfaces/bank-account-response.interface';

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
}
