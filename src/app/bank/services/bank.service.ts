import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, delay, of } from 'rxjs';
import { enviroments } from 'src/environments/environments';
import { BankResponse } from '../interfaces/bank-reponse.interface';

@Injectable({ providedIn: 'root' })
export class BankService {
  private url: string = enviroments.ofmaBackendUrl;
  private path: string = '/api/bank/';

  constructor(private httpClient: HttpClient) {}

  getBanks(): Observable<BankResponse> {
    const token = localStorage.getItem('token');
    return this.httpClient.get<any>(`${this.url}${this.path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
