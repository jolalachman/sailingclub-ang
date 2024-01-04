import { Location } from "@angular/common";
import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject, Observable, Subscription, combineLatest, filter, map, switchMap } from "rxjs";
import { ReservationShortDataModel } from "src/app/modules/reservations/models/reservation.model";
import { ReservationDetailsModel, ReservationDetailsService, ReservationNoticeModel } from "../../service/reservation-details.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ReservationStatusesDialogComponent } from "../../dialogs/reservation-statuses-dialog/reservation-statuses-dialog.component";
import { ReportNoticeDialogComponent } from "../../dialogs/report-notice-dialog/report-notice-dialog.component";
import { NoticeModel } from "src/app/modules/notice-details/service/notice-details.service";
import { LoginService } from "src/app/core/service/login/login.service";

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
    private loginService: LoginService,
  ) {}

  role = this.loginService.userInformation?.role ?? '';
  id = this.loginService.userInformation?.id ?? '';
  refreshToken: BehaviorSubject<boolean> = new BehaviorSubject(false);
  reportNoticeDialogSubscription = Subscription.EMPTY;

  reservation$: Observable<ReservationDetailsModel> = combineLatest([
    this.route.paramMap,
    this.refreshToken.asObservable()
  ]).pipe(
    filter(p => p[0].get('reservationId') !== null),
    map(p => parseInt(p[0].get('reservationId') ?? '')),
    switchMap(reservationId => this.service.getReservation(reservationId)),
  );

  reportedNotice$: Observable<ReservationNoticeModel> = combineLatest([
    this.route.paramMap,
    this.refreshToken.asObservable()
  ]).pipe(
    filter(p => p[0].get('reservationId') !== null),
    map(p => parseInt(p[0].get('reservationId') ?? '')),
    switchMap(reservationId => this.service.getReservationReportedNotice(reservationId))
  );

  rejectReservation(id: number) {
    this.service.changeStatus({id, status: 'REJECTED'}).subscribe((x) => {
      this.refreshToken.next(x);
    })
  }

  cancelReservation(id: number) {
    this.service.changeStatus({id, status: 'CANCELLED'}).subscribe((x) => {
      this.refreshToken.next(x);
    })
  }

  confirmReservation(id: number) {
    this.service.changeStatus({id, status: 'CONFIRMED'}).subscribe((x) => {
      this.refreshToken.next(x);
    })
  }

  giveReservation(id: number) {
    this.service.giveReservation(id).subscribe((x) => {
      this.refreshToken.next(x);
    })
  }

  completeReservation(id: number) {
    this.service.completeReservation(id).subscribe((x) => {
      this.refreshToken.next(x);
    })
  }

  reportNotice(reservationId: number) {
    const modalRef = this.modalService.open(ReportNoticeDialogComponent, { size: 'lg' });
    const reportNoticeDialogInstance = modalRef.componentInstance;
    reportNoticeDialogInstance.reservationId = reservationId;
  
    this.reportNoticeDialogSubscription = reportNoticeDialogInstance.noticeReported.subscribe((x: boolean) => {
      this.refreshToken.next(x);
    });
  }

  showHistoryStatuses(reservationId: number) {
    const modalRef = this.modalService.open(ReservationStatusesDialogComponent, { size: 'lg' });
    const reservationStatusesDialogInstance = modalRef.componentInstance;
    reservationStatusesDialogInstance.statuses$ = this.service.getReservationStatusesHistory(reservationId);
  }

  handleClick(id?: number) {
    if (id) {
      void this.router.navigate(['notice-details', id])
    }
  }
}