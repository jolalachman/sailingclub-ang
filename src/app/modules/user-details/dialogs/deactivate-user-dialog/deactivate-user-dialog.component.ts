import { Component, EventEmitter, OnInit, Output, inject } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { UserDetailsService } from "../../service/user-details.service";

@Component({
    selector: 'deactivate-user',
    templateUrl: './deactivate-user-dialog.component.html',
    styleUrls: ['./deactivate-user-dialog.component.scss']
  })
  export class DeactivateUsertDialogComponent {
    @Output() userDeactivated: EventEmitter<boolean> = new EventEmitter<boolean>;
    userId?: number;
    activeModal = inject(NgbActiveModal);
    loading = false;
  
    constructor(private service: UserDetailsService) {}

    deactivateUser() {
      if (this.userId) {
        this.loading = true;
        this.service.deactivateUser(this.userId).subscribe({
          next: () => {
            this.userDeactivated.emit(true);
            this.loading = false;
            void this.activeModal.close();
          },
          error: () => {
            this.loading = false;
            void this.activeModal.close();
          }
        })
      }
    }
  }