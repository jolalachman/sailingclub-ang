import { Location } from "@angular/common";
import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject, Observable, combineLatest, filter, map, switchMap } from "rxjs";
import { ReservationShortDataModel } from "src/app/modules/reservations/models/reservation.model";
import { ReservationDetailsModel, ReservationDetailsService } from "../../service/reservation-details.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ReservationStatusestDialogComponent } from "../../dialogs/reservation-statuses-dialog/reservation-statuses-dialog.component";

@Component({
  selector: 'app-reservation-details',
  templateUrl: './reservation-details.component.html',
  styleUrls: ['./reservation-details.component.scss']
})
export class ReservationDetailsComponent {
  constructor(
    public location: Location,
    private route: ActivatedRoute,
    private service: ReservationDetailsService,
    public router: Router,
    private modalService: NgbModal, 
  ) {}

  refreshToken: BehaviorSubject<boolean> = new BehaviorSubject(false);

  reservation$: Observable<ReservationDetailsModel> = combineLatest([
    this.route.paramMap,
    this.refreshToken.asObservable()
  ]).pipe(
    filter(p => p[0].get('reservationId') !== null),
    map(p => parseInt(p[0].get('reservationId') ?? '')),
    switchMap(reservationId => this.service.getReservation(reservationId)),
  );

  rejectReservation() {}

  cancelReservation() {}

  confirmReservation() {}

  giveReservation() {}

  completeReservation() {}

  reportNotice() {}

  showHistoryStatuses(reservationId: number) {
    const modalRef = this.modalService.open(ReservationStatusestDialogComponent, { size: 'lg' });
    const reservationStatusesDialogInstance = modalRef.componentInstance;
    reservationStatusesDialogInstance.statuses$ = this.service.getReservationStatusesHistory(reservationId);
  }
}