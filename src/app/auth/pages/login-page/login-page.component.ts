import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup } from '@angular/forms';
import { catchError, of } from 'rxjs';

@Component({
  templateUrl: './login-page.component.html',
  styleUrls: [],
  providers: [MessageService],
})
export class LoginPageComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  authForm = new FormGroup({
    email: new FormControl<string>(''),
    password: new FormControl<string>(''),
  });

  generateToast(severity: 'Error' | 'Success', detail: string) {
    this.messageService.add({
      key: 'toast',
      summary: severity,
      severity: severity.toLowerCase(),
      detail: detail,
      life: 3000,
    });
  }

  onLogin() {
    const regex = new RegExp(
      '^(([^<>()[\\]\\\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\\"]+)*)|(\\".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
    );

    if (this.authForm.invalid) {
      this.generateToast('Error', 'Hay campos obligatorios sin rellenar');
      return;
    }

    if (!regex.test(this.authForm.value.email ?? '')) {
      this.generateToast('Error', 'Email no valido');
      return;
    }

    this.authService
      .login(
        this.authForm.value.email ?? '',
        this.authForm.value.password ?? ''
      )
      .pipe(
        catchError((err) => {
          this.generateToast('Error', 'Credenciales no válidas');
          return of(undefined);
        })
      )
      .subscribe((user) => {
        if (user) this.router.navigate(['/admin/']);
      });
  }
}
