import { Component } from '@angular/core';
import { catchError, of } from 'rxjs';
import { AuthService } from '../../services/auth-service.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ThemeService } from 'src/app/shared/services/theme.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-reset-password-page',
  templateUrl: './reset-password-page.component.html',
  styles: [
    'code-input {' +
      '--item-spacing: 10px;' +
      '--item-height: 5rem;' +
      '--item-background: #ffffff20;' +
      '--item-shadow-focused: none;' +
      '--item-border-radius: 15px;' +
      '}',
    '.pin-color-white {--color: #fff; }',
    '.pin-color-dark {--color: #043d75; }',
  ],
  providers: [MessageService],
})
export class ResetPasswordPageComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private themeService: ThemeService
  ) {}

  dialogVisible = false;

  get isDarkMode() {
    return this.themeService.isDarkMode;
  }

  authForm = new FormGroup({
    email: new FormControl<string>(''),
    password: new FormControl<string>(''),
    confirmPassword: new FormControl<string>(''),
  });

  generateToast(severity: 'Error' | 'Success' | 'Info', detail: string) {
    this.messageService.add({
      key: 'toast',
      summary: severity,
      severity: severity.toLowerCase(),
      detail: detail,
      life: 3000,
    });
  }

  onSubmit() {
    const regex = new RegExp(
      '^(([^<>()[\\]\\\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\\"]+)*)|(\\".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
    );

    const passwordRegex = new RegExp(
      '^((?:(?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*)$'
    );

    if (this.authForm.invalid) {
      this.generateToast('Error', 'Hay campos obligatorios sin rellenar');
      return;
    }

    if (!regex.test(this.authForm.value.email ?? '')) {
      this.generateToast('Error', 'Email no valido');
      return;
    }

    if (!passwordRegex.test(this.authForm.value.password ?? '')) {
      this.generateToast(
        'Error',
        'La contraseña debe contener letras mayusculas, minusculas, números y mínimo 10 caracteres'
      );
      return;
    }

    if ((this.authForm.value.password ?? '').length < 10) {
      this.generateToast(
        'Error',
        'La contraseña debe contener mínimo 10 caracteres'
      );
      return;
    }

    if ((this.authForm.value.password ?? '').length > 50) {
      this.generateToast(
        'Error',
        'La contraseña no puede tener más de 50 caracteres'
      );
      return;
    }

    if (
      (this.authForm.value.password ?? '') !=
      (this.authForm.value.confirmPassword ?? '')
    ) {
      this.generateToast(
        'Error',
        'La contraseña y la confirmación de contraseña deben coincidir'
      );
      return;
    }

    this.generateToast('Info', 'Se esta procesando la solicitud');

    this.authService
      .recoverPassword(this.authForm.value.email ?? '')

      .subscribe((userExist) => {
        if (userExist) {
          this.dialogVisible = true;
        } else {
          this.generateToast('Error', 'No se pudo restablecer la contraseña');
        }
      });
  }

  onConfirm(otp: string) {
    this.authService
      .validateRecoverPassword(
        this.authForm.value.email ?? '',
        this.authForm.value.password ?? '',
        otp
      )

      .subscribe((success) => {
        if (success) {
          this.dialogVisible = false;
          this.generateToast('Success', 'Contraseña restablecida con éxito');
          this.authForm.reset();
        } else {
          this.generateToast('Error', 'No se pudo restablecer la contraseña');
        }
      });
  }
}
