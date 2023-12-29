import { Component, EventEmitter, OnInit, Output, inject } from "@angular/core";
import { FormGroup, NonNullableFormBuilder, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { UserDetailsService, UserModel } from "../../service/user-details.service";
import { AccountService } from "src/app/modules/account/service/account.service";
import { map } from "rxjs";
import { ReservationsService } from "src/app/modules/reservations/service/reservations.service";
import { DictionaryService } from "src/app/shared/service/dictionary.service";

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
    sailingLicence$ = this.dictionaryService.getSailingLicensesDictionary();
    userRoles$ = this.dictionaryService.getUserRolesDictionary().pipe(
      map(x => [null, ...x].filter(y => y?.name !== 'ADMIN'))
    );
  
    editUserForm: FormGroup = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        role: [null, Validators.required],
        clubStatus: [''],
        sailingLicense: [null, Validators.required],
    });
  
    constructor(
      private fb: NonNullableFormBuilder,
      private service: UserDetailsService,
      private dictionaryService: DictionaryService,
    ) {}

    ngOnInit(): void {
      if (this.user) {
        this.editUserForm.patchValue({
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          role: this.user.role.name,
          clubStatus: this.user.clubStatus,
          sailingLicense: this.user.sailingLicense.id,
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