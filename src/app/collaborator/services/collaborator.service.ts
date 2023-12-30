import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, delay, of } from 'rxjs';
import { enviroments } from 'src/environments/environments';
import { CollaboratorsResponse } from '../interfaces/collaborator-response.interface';

@Injectable({ providedIn: 'root' })
export class CollaboratorService {
  private url: string = enviroments.ofmaBackendUrl;
  private path: string = '/api/user/';

  constructor(private httpClient: HttpClient) {}

  getCollaborators(): Observable<CollaboratorsResponse> {
    const token = localStorage.getItem('token');
    return this.httpClient.get<CollaboratorsResponse>(
      `${this.url}${this.path}collaborators`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }

  createCollaborator(email: string) {
    const token = localStorage.getItem('token');

    return this.httpClient
      .post(
        `${this.url}${this.path}user-will-collaborate`,
        { email, isCollaborator: true },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .pipe(
        catchError((err) => {
          if (err.error.message == 'User is not registered')
            return of('unknow_user');
          return of('unknow_err');
        })
      );
  }

  deleteCollaborator(email: string) {
    const token = localStorage.getItem('token');

    return this.httpClient
      .post(
        `${this.url}${this.path}user-will-collaborate`,
        { email, isCollaborator: false },
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
