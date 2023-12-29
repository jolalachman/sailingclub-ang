import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectorRef, Component, EventEmitter, Output, inject } from "@angular/core";
import { FormGroup, NonNullableFormBuilder, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { LoginService } from "src/app/core/service/login/login.service";
import { passwordRegex } from "src/app/modules/auth/constants/password-regex.constant";
import { DictionaryService } from "src/app/shared/service/dictionary.service";

@Component({
    selector: 'app-add-user',
    templateUrl: './add-user-dialog.component.html',
    styleUrls: ['./add-user-dialog.component.scss']
  })
export class AddUserDialogComponent {
  @Output() userAdded: EventEmitter<boolean> = new EventEmitter<boolean>;
  activeModal = inject(NgbActiveModal);
  loading = false;
  sailingLicenses$ = this.dictionaryService.getSailingLicensesDictionary();
  userRoles$ = this.dictionaryService.getUserRolesDictionary();

  addUserForm: FormGroup = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      role: [null, Validators.required],
      clubStatus: [''],
      sailingLicense: [null, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(passwordRegex)]],
      repeatPassword: ['', Validators.required]
  });

  constructor(
    private fb: NonNullableFormBuilder,
    private cd: ChangeDetectorRef,
    private service: LoginService,
    private dictionaryService: DictionaryService,
  ) {}

  get formControls() {
    return this.addUserForm.controls;
  }

  addUser() {
    if (this.addUserForm.invalid) return;

    this.loading = true;
      
    const {firstName, lastName, role, clubStatus, sailingLicense, email, password, repeatPassword} = this.addUserForm.value;

    if (password !== repeatPassword) {
      this.addUserForm.get('repeatPassword')?.setErrors({
          wrongRepeatPassword: true,
      })
      this.loading = false;
    }
    else {
      this.service.registerByAdmin({firstName, lastName, role, clubStatus, sailingLicense, email, password}).subscribe({
        next: () => {
          this.loading = false
          this.userAdded.emit(true);
          void this.activeModal.close();
        },
        error: (error) => {
          this.loading = false;
          if (error instanceof HttpErrorResponse) {
              this.addUserForm.get('email')?.setErrors({
              repeatedEmail: true,
              })
          }
          void this.activeModal.close();
        }
      })
    }
  }
}
