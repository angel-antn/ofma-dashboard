import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, delay, of } from 'rxjs';
import { enviroments } from 'src/environments/environments';
import { ExchangeRateResponse } from '../interfaces/exchange-rate-response.interface';

@Injectable({ providedIn: 'root' })
export class ExchangeRateService {
  private url: string = enviroments.ofmaBackendUrl;
  private path: string = '/api/exchange-rate/';

  constructor(private httpClient: HttpClient) {}

  getLastExchangeRate(): Observable<ExchangeRateResponse> {
    const token = localStorage.getItem('token');
    return this.httpClient.get<ExchangeRateResponse>(
      `${this.url}${this.path}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  }

  updateRateExchange(rate: number): Observable<ExchangeRateResponse | string> {
    const token = localStorage.getItem('token');
    return this.httpClient
      .post<ExchangeRateResponse>(
        `${this.url}${this.path}`,
        { rate },
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
