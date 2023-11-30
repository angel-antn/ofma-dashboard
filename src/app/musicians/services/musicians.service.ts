import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, delay, of } from 'rxjs';
import {
  Musician,
  MusicianResponse,
} from '../interfaces/muscian-response.inteface';
import { enviroments } from 'src/environments/environments';

@Injectable({ providedIn: 'root' })
export class MusiciansService {
  private url: string = enviroments.ofmaBackendUrl;
  private path: string = '/api/musician/';

  constructor(private httpClient: HttpClient) {}

  getMusicians(): Observable<MusicianResponse> {
    return this.httpClient.get<MusicianResponse>(`${this.url}${this.path}`);
  }

  getMusicianById(id: string): Observable<Musician | undefined> {
    return this.httpClient
      .get<Musician>(`${this.url}${this.path}${id}`)
      .pipe(catchError((err) => of(undefined)));
  }

  createMusician(musician: Musician, file: File) {
    const token = localStorage.getItem('token');

    const formData: FormData = new FormData();

    formData.append('image', file);
    formData.append('name', musician.name);
    formData.append('lastname', musician.lastname);
    formData.append('email', musician.email.toLocaleLowerCase());
    formData.append('gender', musician.gender.toLocaleLowerCase());
    formData.append('birthdate', musician.birthdate.toDateString());
    formData.append('startDate', musician.startDate.toDateString());
    if (musician.isHighlighted) {
      formData.append('isHighlighted', 'true');
    }
    formData.append('description', musician.description);

    return this.httpClient
      .post(`${this.url}${this.path}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .pipe(
        catchError((err) => {
          if (
            err.error.message ==
            `Key (email)=(${musician.email}) already exists.`
          ) {
            return of('email_err');
          }

          return of('unknow_err');
        })
      );
  }

  editMusician(musician: Musician, file?: File) {
    const token = localStorage.getItem('token');

    const formData: FormData = new FormData();

    if (file) formData.append('image', file);
    formData.append('name', musician.name);
    formData.append('lastname', musician.lastname);
    formData.append('email', musician.email.toLocaleLowerCase());
    formData.append('gender', musician.gender.toLocaleLowerCase());
    formData.append('birthdate', musician.birthdate.toDateString());
    formData.append('startDate', musician.startDate.toDateString());
    formData.append('isHighlighted', musician.isHighlighted ? 'true' : '');

    formData.append('description', musician.description);

    console.log(musician.id);

    return this.httpClient
      .patch(`${this.url}${this.path}${musician.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .pipe(
        catchError((err) => {
          if (
            err.error.message ==
            `Key (email)=(${musician.email}) already exists.`
          ) {
            return of('email_err');
          }

          return of('unknow_err');
        })
      );
  }

  deleteMusician(id: string) {
    const token = localStorage.getItem('token');

    return this.httpClient
      .delete(`${this.url}${this.path}${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .pipe(catchError((err) => of(undefined)));
  }
}
