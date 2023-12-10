import { Location } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/core/service/login/login.service';

@Component({
  selector: 'app-auth-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.scss']
})
export class ActivateAccountComponent {
  firstPage = true;
  loading = false;

  activateAccountForm: FormGroup = this.fb.group({
    token: ['', Validators.required],
  });

  get formControls() {
    return this.activateAccountForm.controls;
  }

  constructor(
    public location: Location,
    private router: Router,
    private fb: NonNullableFormBuilder,
    private loginService: LoginService
  ) {}

  activateAccount() {
    if (this.activateAccountForm.invalid) return;

    this.loading = true;
    
    const {token} = this.activateAccountForm.value;

    this.loginService.activateAccount({token}).subscribe({
      next: () => {
        this.loading = false;
        void this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        this.loading = false;
        if (error instanceof HttpErrorResponse) {
          this.activateAccountForm.get('token')?.setErrors({
            wrongToken: true,
          })
        }
      }
    })
  }
}