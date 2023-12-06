import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NonNullableFormBuilder, FormGroup, Validators } from '@angular/forms'
import { LoginService } from 'src/app/core/service/login/login.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loading = false;

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(
    public location: Location,
    private router: Router,
    private fb: NonNullableFormBuilder,
    private loginService: LoginService
  ) {}

  login() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    
    const {email, password} = this.loginForm.value;

    this.loginService.login({email, password}).subscribe({
      next: () => {
        this.loading = false;
        void this.router.navigate(['/']);
      },
      error: (error) => {
        this.loading = false;
        console.log(error);
      }
    })
  }
}
