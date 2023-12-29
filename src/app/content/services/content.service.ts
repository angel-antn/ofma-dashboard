import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, delay, map, of } from 'rxjs';
import { enviroments } from 'src/environments/environments';
import {
  Content,
  ContentResponse,
} from '../interfaces/content-response.interface';
import { AddContentMusicianResponse } from '../interfaces/add-content-musician-response.interface';
import { EditContentMusicianResponse } from '../interfaces/edit-content-musician-response.interface';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private url: string = enviroments.ofmaBackendUrl;
  private path: string = '/api/exclusive-content/';

  constructor(private httpClient: HttpClient) {}

  getContent(): Observable<ContentResponse> {
    return this.httpClient.get<ContentResponse>(`${this.url}${this.path}`);
  }

  getContentById(id: string): Observable<Content | undefined> {
    return this.httpClient
      .get<Content>(`${this.url}${this.path}${id}`)
      .pipe(catchError((err) => of(undefined)));
  }

  createContent(content: Content, file: File) {
    const token = localStorage.getItem('token');

    const formData: FormData = new FormData();

    formData.append('image', file);
    formData.append('name', content.name);
    formData.append('description', content.description);
    formData.append('category', content.category.toLocaleLowerCase());

    if (content.isHighlighted) {
      formData.append('isHighlighted', 'true');
    }

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

  publishVideo(id: string, file: File) {
    const token = localStorage.getItem('token');

    const formData: FormData = new FormData();

    formData.append('video', file);

    return this.httpClient
      .post(`${this.url}${this.path}upload-video/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .pipe(
        catchError((err) => {
          return of('unknow_err');
        })
      );
  }

  changeShownStatus(id: string, isShown: boolean) {
    const token = localStorage.getItem('token');

    return this.httpClient
      .post(
        `${this.url}${this.path}change-shown-status`,
        { id, isShown },
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

  editContent(content: Content, file?: File) {
    const token = localStorage.getItem('token');

    const formData: FormData = new FormData();

    if (file) formData.append('image', file);
    formData.append('name', content.name);
    formData.append('description', content.description);
    formData.append('category', content.category.toLocaleLowerCase());
    formData.append('isHighlighted', content.isHighlighted ? 'true' : '');

    return this.httpClient
      .patch(`${this.url}${this.path}${content.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .pipe(
        catchError((err) => {
          return of('unknow_err');
        })
      );
  }

  addMusician(
    musicianId: string,
    contentId: string,
    role: string
  ): Observable<AddContentMusicianResponse | undefined> {
    const token = localStorage.getItem('token');

    return this.httpClient
      .post(
        `${this.url}${this.path}content-musician`,
        { musicianId, exclusiveContentId: contentId, role },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .pipe(
        map((response) => response as AddContentMusicianResponse),
        catchError((err) => of(undefined))
      );
  }

  editMusician(
    id: string,
    role: string
  ): Observable<EditContentMusicianResponse | undefined> {
    const token = localStorage.getItem('token');

    return this.httpClient
      .patch(
        `${this.url}${this.path}content-musician/${id}`,
        { role },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .pipe(
        map((response) => response as EditContentMusicianResponse),
        catchError((err) => of(undefined))
      );
  }

  deleteMusician(id: String) {
    const token = localStorage.getItem('token');

    return this.httpClient
      .delete(`${this.url}${this.path}content-musician/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .pipe(catchError((err) => of(undefined)));
  }

  deleteContent(id: string) {
    const token = localStorage.getItem('token');

    return this.httpClient
      .delete(`${this.url}${this.path}${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .pipe(catchError((err) => of(undefined)));
  }
}
