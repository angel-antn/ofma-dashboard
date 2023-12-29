import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { enviroments } from 'src/environments/environments';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private url: string = enviroments.ofmaBackendUrl;
  private path: string = '/api/admin-user/';

  private user?: AuthResponse;
  constructor(private httpClient: HttpClient) {}

  get currentUser(): AuthResponse | undefined {
    if (!this.user) return undefined;
    return structuredClone(this.user);
  }

  login(email: string, password: string) {
    return this.httpClient
      .post<AuthResponse>(`${this.url}${this.path}login`, { email, password })
      .pipe(
        tap((user) => (this.user = user as AuthResponse)),
        tap((user) => localStorage.setItem('token', user.token))
      );
  }

  logout() {
    this.user = undefined;
    localStorage.clear();
  }

  checkAuth(): Observable<boolean> {
    const token = localStorage.getItem('token');

    if (!token) return of(false);

    return this.httpClient
      .get<AuthResponse>(`${this.url}${this.path}me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .pipe(
        tap((user) => (this.user = user as AuthResponse)),
        map((user) => !!user),
        catchError((err) => of(false))
      );
  }

  recoverPassword(email: string): Observable<boolean> {
    return this.httpClient
      .post(`${this.url}${this.path}reset-password-request`, {
        email,
      })
      .pipe(
        map((res) => !!res),
        catchError((err) => of(false))
      );
  }

  validateRecoverPassword(
    email: string,
    password: string,
    resetPasswordOtp: string
  ): Observable<boolean> {
    return this.httpClient
      .post(`${this.url}${this.path}validate-reset-password-request`, {
        email,
        password,
        resetPasswordOtp,
      })
      .pipe(
        map((res) => !!res),
        catchError((err) => of(false))
      );
  }
}
