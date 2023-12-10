import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, OperatorFunction, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { LoginService } from 'src/app/core/service/login/login.service';
import { passwordRegex} from '../../constants/password-regex.constant';
import {sailingLicensesEng, sailingLicensesPl } from '../../constants/sailing-licenses.constant';
import { TranslateService } from '@ngx-translate/core';

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
    sailingLicense: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(passwordRegex)]],
    repeatPassword: ['', Validators.required]
  });

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(200),
			distinctUntilChanged(),
			map((term) => {
        if (term.length < 2)
          return [];
        else {
          if (this.translate.currentLang === 'pl')
            return sailingLicensesPl.filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10);
          else
            return sailingLicensesEng.filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10);
        }
      }
			),
		);

  constructor(
    public location: Location,
    private router: Router,
    private fb: NonNullableFormBuilder,
    private loginService: LoginService,
    private translate: TranslateService
  ) {}

  get formControls() {
    return this.registerForm.controls;
  }

  register() {
    if (this.registerForm.invalid) return;

    this.loading = true;
    
    const {firstName, lastName, clubStatus, sailingLicense, email, password, repeatPassword} = this.registerForm.value;

    if (password !== repeatPassword) {
      this.registerForm.get('repeatPassword')?.setErrors({
        wrongRepeatPassword: true,
      })
      this.loading = false;
    }
    else {
      this.loginService.register({firstName, lastName, clubStatus, sailingLicense, email, password}).subscribe({
        next: () => {
          this.loading = false;
          void this.router.navigate(['/auth/activate-account']);
        },
        error: (error) => {
          this.loading = false;
          if (error instanceof HttpErrorResponse) {
            this.registerForm.get('email')?.setErrors({
              repeatedEmail: true,
            })
          }
        }
      })
    }
  }
}