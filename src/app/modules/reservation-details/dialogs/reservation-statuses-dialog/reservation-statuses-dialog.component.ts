import { Component, EventEmitter, OnInit, Output, inject } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ReservationStatusHistoryModel } from "src/app/modules/reservation-details/service/reservation-details.service";
import { Observable } from "rxjs";

@Component({
    selector: 'reservation-statuses',
    templateUrl: './reservation-statuses-dialog.component.html',
    styleUrls: ['./reservation-statuses-dialog.component.scss']
  })
  export class ReservationStatusestDialogComponent {
    activeModal = inject(NgbActiveModal);

    statuses$?: Observable<ReservationStatusHistoryModel[]>;
  }