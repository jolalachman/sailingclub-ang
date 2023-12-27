import { Component, EventEmitter, OnInit, Output, inject } from "@angular/core";
import { FormGroup, NonNullableFormBuilder, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { UserDetailsService, UserModel } from "../../service/user-details.service";
import { USER_ROLES } from "src/app/modules/users/constants/user-roles.constant";
import { SAILING_LICENCES } from "src/app/modules/users/constants/sailing-licences.constant";

@Component({
    selector: 'edit-add-yacht',
    templateUrl: './edit-user-dialog.component.html',
    styleUrls: ['./edit-user-dialog.component.scss']
  })
  export class EditUserDialogComponent implements OnInit {
    @Output() userEdited: EventEmitter<boolean> = new EventEmitter<boolean>;
    user?: UserModel;
    activeModal = inject(NgbActiveModal);
    loading = false;
    sailingLicences = SAILING_LICENCES.filter(x => x !== null);
    userRoles = USER_ROLES.filter(x => x !== null);
  
    editUserForm: FormGroup = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        role: [null, Validators.required],
        clubStatus: [''],
        sailingLicense: [null, Validators.required],
    });
  
    constructor(
      private fb: NonNullableFormBuilder,
      private service: UserDetailsService
    ) {}

    ngOnInit(): void {
      if (this.user) {
        this.editUserForm.patchValue({
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          role: this.user.roleName,
          clubStatus: this.user.clubStatus,
          sailingLicense: this.user.sailingLicenseName,
        });
      }
    }
  
    get formControls() {
      return this.editUserForm.controls;
    }
  
    editUser() {
      if (this.editUserForm.invalid) return;
  
      this.loading = true;
        
      const {firstName, lastName, role, clubStatus, sailingLicense} = this.editUserForm.value;
      const id = this.user?.id ?? -1;
  
      this.service.editUser({id, firstName, lastName, role, clubStatus, sailingLicense}).subscribe({
        next: () => {
          this.loading = false
          this.userEdited.emit(true);
          void this.activeModal.close();
        },
        error: () => {
          this.loading = false;
          void this.activeModal.close();
        }
      })
    }
  }