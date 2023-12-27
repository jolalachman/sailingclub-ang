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
  
    constructor(private service: UserDetailsService) {}

    deactivateUser() {
      if (this.userId) {
        this.service.deactivateUser(this.userId).subscribe({
          next: () => {
            this.userDeactivated.emit(true);
            void this.activeModal.close();
          },
          error: () => {
            void this.activeModal.close();
          }
        })
      }
    }
  }