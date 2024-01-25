import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, delay, of } from 'rxjs';
import { enviroments } from 'src/environments/environments';

@Injectable({ providedIn: 'root' })
export class ExchangeRateService {
  private url: string = enviroments.ofmaBackendUrl;
  private path: string = '/api/exchange-rate/';

  constructor(private httpClient: HttpClient) {}

  getLastExchangeRate(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.httpClient.get<any>(`${this.url}${this.path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
