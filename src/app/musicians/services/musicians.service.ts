import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
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
}
