import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormGroup, NonNullableFormBuilder, Validators } from "@angular/forms";
import { LoginService } from "src/app/core/service/login/login.service";
import { phoneRegex } from "../../constants/phone-regex.constant";
import { AccountService } from "../../service/account.service";
import { DictionaryService } from "src/app/shared/service/dictionary.service";

@Component({
    selector: 'app-account-my-account',
    templateUrl: './my-account.component.html',
    styleUrls: ['./my-account.component.scss']
  })
  export class MyAccountComponent implements OnInit {
    userInfo$ = this.loginService.userInfo.asObservable();
    loading = false;
    editMode = false;
    id = this.loginService.userInformation?.id ?? '';
    role = this.loginService.userInformation?.role ?? '';
    sailingLicenses$ = this.dictionaryService.getSailingLicensesDictionary();

    myAccountForm: FormGroup = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.pattern(phoneRegex)],
      clubStatus: [''],
      sailingLicenseName: ['', Validators.required],
      sailingLicenseId: [null, Validators.required],
    });
  
    get formControls() {
      return this.myAccountForm.controls;
    }

    constructor(
      public location: Location,
      private loginService: LoginService,
      private fb: NonNullableFormBuilder,
      private service: AccountService,
      private dictionaryService: DictionaryService,
    ) {}

    ngOnInit(): void {
      this.service.getAccount(this.id).subscribe({
        next: (result) => {
          this.myAccountForm.patchValue({
            firstName: result.firstName,
            lastName: result.lastName,
            phone: result.phone,
            clubStatus: result.clubStatus,
            sailingLicenseName: result.sailingLicense.name,
            sailingLicenseId: result.sailingLicense.id,
          });
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      })
    }

    createUserInitials(firstName: string, lastName: string) {
      return firstName.charAt(0) + '' + (lastName.charAt(0) === '-' ? '' : lastName.charAt(0));
    }

    editMyAccount() {
      if (this.myAccountForm.invalid) return;

      this.loading = true;
      
      const {firstName, lastName, phone, clubStatus, sailingLicenseId} = this.myAccountForm.value;
      const id = this.id;
      const role = this.role;
      this.service.editAccount({id, firstName, lastName, phone, clubStatus, sailingLicenseId}).subscribe({
        next: (result) => {
          this.loginService.setUserInfo(firstName, lastName, id, role);
          this.myAccountForm.patchValue({
            firstName: result.firstName,
            lastName: result.lastName,
            phone: result.phone,
            clubStatus: result.clubStatus,
            sailingLicenseName: result.sailingLicense.name,
            sailingLicenseId: result.sailingLicense.id,
          });
          this.loading = false;
          this.editMode=false;
        },
        error: () => {
          this.loading = false;
        }
      })
    }
  }