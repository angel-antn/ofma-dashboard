import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, delay, of } from 'rxjs';
import { enviroments } from 'src/environments/environments';
import { OrdersResponse } from '../interfaces/orders-response.interface';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private url: string = enviroments.ofmaBackendUrl;
  private path: string = '/api/order/';

  constructor(private httpClient: HttpClient) {}

  getOrders(): Observable<OrdersResponse> {
    const token = localStorage.getItem('token');
    return this.httpClient.get<OrdersResponse>(`${this.url}${this.path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
