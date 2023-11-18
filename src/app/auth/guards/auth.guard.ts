import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router, CanMatchFn } from '@angular/router';
import { AuthService } from '../services/auth-service.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  checkStatus() {
    return this.authService.checkAuth().pipe(
      tap((isAuth) => {
        if (!isAuth) {
          this.router.navigate(['/auth/login']);
        }
      })
    );
  }
}

export const authActivateGuard: CanActivateFn = (route, state) => {
  return inject(AuthGuard).checkStatus();
};

export const authMatchGuard: CanMatchFn = (route, segments) => {
  return inject(AuthGuard).checkStatus();
};
