import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/core/service/login/login.service';

@Component({
  selector: 'app-auth-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  firstPage = true;
  loading = false;

  registerForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    clubStatus: [''],
    sailingLicense: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    repeatPassword: ['', Validators.required]
  });

  constructor(
    public location: Location,
    private router: Router,
    private fb: NonNullableFormBuilder,
    private loginService: LoginService
  ) {}

  register() {
    if (this.registerForm.invalid) return;

    this.loading = true;
    
    const {firstName, lastName, email, password} = this.registerForm.value;

    this.loginService.register({firstName, lastName, email, password}).subscribe({
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