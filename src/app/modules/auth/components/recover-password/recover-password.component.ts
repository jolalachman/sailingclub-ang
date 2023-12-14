import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { LoginService } from 'src/app/core/service/login/login.service';
import { passwordRegex } from '../../constants/password-regex.constant';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent {
  codeSent = false;
  codeApproved = false;
  loading = false;

  recoverPasswordForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  resetPasswordForm: FormGroup = this.fb.group({
    resetToken: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.pattern(passwordRegex)]],
    repeatNewPassword: ['', Validators.required]
  });

  get formControls() {
    return this.recoverPasswordForm.controls;
  }

  get resetFormControls() {
    return this.resetPasswordForm.controls;
  }

  constructor(
    public location: Location,
    private fb: NonNullableFormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {}

  recoverPassword() {
    if (this.recoverPasswordForm.invalid) return;

    this.loading = true;
    
    const {email} = this.recoverPasswordForm.value;

    this.loginService.recoverPassword({email}).subscribe({
      next: (response) => {
        this.loading = false;
        if (response) {
          this.codeSent = true;
        }
        else {
          this.recoverPasswordForm.get('email')?.setErrors({
            userNotEnabled: true,
          })
        }
      },
      error: (error) => {
        this.loading = false;
        if (error instanceof HttpErrorResponse) {
          this.recoverPasswordForm.get('email')?.setErrors({
            wrongEmail: true,
          })
        }
      }
    })
  }

  resetPassword() {
    if (this.resetPasswordForm.invalid) return;

    this.loading = true;
    
    const {resetToken, newPassword, repeatNewPassword} = this.resetPasswordForm.value;

    if (newPassword !== repeatNewPassword) {
      this.resetPasswordForm.get('repeatNewPassword')?.setErrors({
        wrongRepeatPassword: true,
      })
      this.loading = false;
    }
    else {
      this.loginService.resetPassword({resetToken, newPassword}).subscribe({
        next: () => {
          this.loading = false;
          void this.router.navigate(['/']);
        },
        error: (error) => {
          this.loading = false;
          if (error instanceof HttpErrorResponse) {
            this.resetPasswordForm.get('resetToken')?.setErrors({
              wrongToken: true,
            })
          }
        }
      });
    }
  }
}