import { Location } from "@angular/common";
import { Component } from "@angular/core";
import { FormGroup, NonNullableFormBuilder, Validators } from "@angular/forms";
import { LoginService } from "src/app/core/service/login/login.service";
import { passwordRegex } from "src/app/modules/auth/constants/password-regex.constant";
import { AccountService } from "../../service/account.service";
import { Router } from "@angular/router";

@Component({
    selector: 'app-account-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
  })
  export class ChangePasswordComponent {
    loading = false;
    id = this.loginService.userInformation?.id ?? '';

    changePasswordForm: FormGroup = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.pattern(passwordRegex)]],
      repeatNewPassword: ['', Validators.required]
    });
  
    get formControls() {
      return this.changePasswordForm.controls;
    }

    constructor(
      public location: Location,
      private fb: NonNullableFormBuilder,
      private loginService: LoginService,
      private service: AccountService,
      private router: Router
    ) {}

    changePassword() {
      if (this.changePasswordForm.invalid) return;

      this.loading = true;
      
      const { oldPassword, newPassword, repeatNewPassword} = this.changePasswordForm.value;
  
      if (newPassword !== repeatNewPassword) {
        this.changePasswordForm.get('repeatNewPassword')?.setErrors({
          wrongRepeatPassword: true,
        })
        this.loading = false;
      }
      else if (oldPassword === newPassword) {
        this.changePasswordForm.get('newPassword')?.setErrors({
          wrongNewPassword: true,
        })
        this.loading = false;
      }
      else {
        const id = this.id;
        this.service.changePassword({id, oldPassword, newPassword}).subscribe({
          next: () => {
            this.loading = false;
            this.router.navigate(['/']);
          },
          error: () => {
            this.changePasswordForm.get('oldPassword')?.setErrors({
              wrongOldPassword: true,
            })
            this.loading = false;
          }
        })
      }
    }
  }