import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, delay, of } from 'rxjs';
import {
  Concert,
  ConcertResponse,
} from '../interfaces/concert-response.interface';
import { enviroments } from 'src/environments/environments';

@Injectable({ providedIn: 'root' })
export class ConcertService {
  private url: string = enviroments.ofmaBackendUrl;
  private path: string = '/api/concert/';

  constructor(private httpClient: HttpClient) {}

  getConcerts(): Observable<ConcertResponse> {
    return this.httpClient.get<ConcertResponse>(`${this.url}${this.path}`);
  }

  getConcertById(id: string): Observable<Concert | undefined> {
    return this.httpClient
      .get<Concert>(`${this.url}${this.path}${id}`)
      .pipe(catchError((err) => of(undefined)));
  }

  createConcert(concert: Concert, file: File) {
    const token = localStorage.getItem('token');

    const formData: FormData = new FormData();

    formData.append('image', file);
    formData.append('name', concert.name);
    formData.append('description', concert.description);
    formData.append('address', concert.address);
    formData.append('startDate', concert.startDate.toDateString());
    formData.append('startAtHour', concert.startAtHour);
    formData.append('entriesQty', concert.entriesQty.toString());
    formData.append('pricePerEntry', concert.pricePerEntry.toString());

    return this.httpClient
      .post(`${this.url}${this.path}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .pipe(
        catchError((err) => {
          return of('unknow_err');
        })
      );
  }

  editConcert(concert: Concert, file?: File) {
    const token = localStorage.getItem('token');

    const formData: FormData = new FormData();

    if (file) formData.append('image', file);
    formData.append('name', concert.name);
    formData.append('description', concert.description);
    formData.append('address', concert.address);
    formData.append('startDate', concert.startDate.toDateString());
    formData.append('startAtHour', concert.startAtHour);
    formData.append('entriesQty', concert.entriesQty.toString());
    formData.append('pricePerEntry', concert.pricePerEntry.toString());
    formData.append('description', concert.description);

    return this.httpClient
      .patch(`${this.url}${this.path}${concert.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .pipe(
        catchError((err) => {
          return of('unknow_err');
        })
      );
  }

  closeConcert(id: string) {
    const token = localStorage.getItem('token');

    const formData: FormData = new FormData();

    formData.append('isOpen', '');

    return this.httpClient
      .patch(`${this.url}${this.path}${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .pipe(
        catchError((err) => {
          return of('unknow_err');
        })
      );
  }

  openConcert(id: string) {
    const token = localStorage.getItem('token');

    const formData: FormData = new FormData();

    formData.append('isOpen', 'true');

    return this.httpClient
      .patch(`${this.url}${this.path}${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .pipe(
        catchError((err) => {
          return of('unknow_err');
        })
      );
  }

  endConcert(id: string) {
    const token = localStorage.getItem('token');

    const formData: FormData = new FormData();

    formData.append('hasFinish', 'true');

    return this.httpClient
      .patch(`${this.url}${this.path}${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .pipe(
        catchError((err) => {
          return of('unknow_err');
        })
      );
  }

  deleteConcert(id: string) {
    const token = localStorage.getItem('token');

    return this.httpClient
      .delete(`${this.url}${this.path}${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .pipe(catchError((err) => of(undefined)));
  }
}
