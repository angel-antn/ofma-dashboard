import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router, CanMatchFn } from '@angular/router';
import { AuthService } from '../services/auth-service.service';
import { map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PublicGuard {
  constructor(private authService: AuthService, private router: Router) {}

  checkStatus() {
    return this.authService.checkAuth().pipe(
      tap((isAuth) => {
        if (isAuth) {
          this.router.navigate(['/admin']);
        }
      }),
      map((isAuth) => {
        if (isAuth) return false;
        return true;
      })
    );
  }
}

export const publicActivateGuard: CanActivateFn = (route, state) => {
  return inject(PublicGuard).checkStatus();
};

export const publicMatchGuard: CanMatchFn = (route, segments) => {
  return inject(PublicGuard).checkStatus();
};
