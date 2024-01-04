import { Component, EventEmitter, Output, inject } from "@angular/core";
import { FormGroup, NonNullableFormBuilder } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ReservationDetailsService } from "../../service/reservation-details.service";

@Component({
    selector: 'report-notice-dialog',
    templateUrl: './report-notice-dialog.component.html',
    styleUrls: ['./report-notice-dialog.component.scss']
  })
  export class ReportNoticeDialogComponent {
    reservationId?: number;
    activeModal = inject(NgbActiveModal);
    @Output() noticeReported: EventEmitter<boolean> = new EventEmitter<boolean>;
    loading = false;

    noticeForm: FormGroup = this.fb.group({
      description: [null],
    });

    constructor(
      private fb: NonNullableFormBuilder,
      private service: ReservationDetailsService,
    ) {}

    get formControls() {
      return this.noticeForm.controls;
    }

    reportNotice() {
      if (this.reservationId) {
        this.loading = true;
        const reservationId = this.reservationId;
        const {description} = this.noticeForm.value;
        this.service.reportNotice({
          reservationId,
          description
        }).subscribe({
          next: () => {
            this.loading = false;
            this.noticeReported.emit(true);
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