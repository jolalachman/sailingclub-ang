import { Location } from "@angular/common";
import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { YachtDetailsService, YachtModel } from "../service/yacht-details.service";
import { BehaviorSubject, Observable, Subscription, combineLatest, filter, map, switchMap, tap } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { CalendarEvent } from "angular-calendar";
import { YachtDetailsReservation, YachtReservation } from "../../yachts/models/yacht.model";
import { CALENDAR_COLORS } from "../../reservations/constants/color.constant";
import { NgbDateStruct, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { EditYachtDialogComponent } from "../dialogs/edit-yacht-dialog/edit-yacht-dialog.component";
import { DeactivateYachtDialogComponent } from "../dialogs/deactivate-yacht-dialog/deactivate-yacht-dialog.component";
import { ChangeYachtStatusDialogComponent } from "../dialogs/change-yacht-status-dialog/change-yacht-status-dialog.component";
import { AddYachtReservationDialogComponent } from "../dialogs/add-yacht-reservation-dialog/add-yacht-reservation-dialog.component";
import { FormGroup, NonNullableFormBuilder } from "@angular/forms";
import { YachtStatusestDialogComponent } from "../dialogs/yacht-statuses-dialog/yacht-statuses-dialog.component";

@Component({
  selector: 'app-yacht-details',
  templateUrl: './yacht-details.component.html',
  styleUrls: ['./yacht-details.component.scss']
})
export class YachtDetailsComponent implements OnInit, OnDestroy {
  dialogSubscription: Subscription = Subscription.EMPTY;
  deactivateDialogSubscription: Subscription = Subscription.EMPTY;
  changeStatusDialogSubscription: Subscription = Subscription.EMPTY;
  calendarFormSubscription: Subscription = Subscription.EMPTY;
  refreshToken: BehaviorSubject<boolean> = new BehaviorSubject(false);
  viewDate: Date = new Date();
  isCollapsed = false;
  isCollapsed2 = true;
  isCollapsed3 = true;
  isCollapsed4 = true;
  isCollapsed5 = true;

  viewCalendarForm: FormGroup = this.fb.group({
    viewCalendarDate: [null],
  });

  yacht$: Observable<YachtModel> = combineLatest([
    this.route.paramMap,
    this.refreshToken.asObservable()
  ]).pipe(
    filter(p => p[0].get('yachtId') !== null),
    map(p => parseInt(p[0].get('yachtId') ?? '')),
    switchMap(yachtId => this.service.getYacht(yachtId)),
  );
  constructor(
    public location: Location,
    private service: YachtDetailsService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,    
    private fb: NonNullableFormBuilder,
  ){}
  ngOnInit(): void {
    this.viewCalendarForm.patchValue({
      viewCalendarDate: this.getCurrentDate(),
    })
    this.calendarFormSubscription = this.viewCalendarForm.valueChanges.subscribe(form => {
      const { viewCalendarDate } = form;
      this.viewDate = this.getDate(viewCalendarDate);
    });
  }

  ngOnDestroy(): void {
    this.dialogSubscription.unsubscribe();
    this.deactivateDialogSubscription.unsubscribe();
    this.changeStatusDialogSubscription.unsubscribe();
    this.calendarFormSubscription.unsubscribe();
  }

  reservationCalendar$: Observable<CalendarEvent[]> = this.yacht$.pipe(
    map(yacht => {
        const startEndArray = yacht.reservations.map((item: YachtDetailsReservation) => ({
            title: item.clientInfo,
            start: new Date(item.pickupDate),
            end: new Date(item.dropoffDate),
            color: {
                primary: item.currentStatus === 'PENDING' ? "#c0c0c0" : CALENDAR_COLORS[yacht.id % CALENDAR_COLORS.length],
                secondary: item.currentStatus === 'PENDING' ? "#c0c0c0" : CALENDAR_COLORS[yacht.id % CALENDAR_COLORS.length],
            },
            meta: item.id
        }));

        return startEndArray;
    })
);

  getDate(dateObj: NgbDateStruct) {
    return new Date(
      dateObj?.year,
      dateObj?.month - 1,
      dateObj?.day
      );
  }

  getCurrentDate(): NgbDateStruct {
    const today = new Date();
    return {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate()
    };
  }

  editYacht(yacht: YachtModel) {
    const modalRef = this.modalService.open(EditYachtDialogComponent, { size: 'lg' });
    const editYachtDialogInstance = modalRef.componentInstance;
    editYachtDialogInstance.yacht = yacht;
  
    this.dialogSubscription = editYachtDialogInstance.yachtAdded.subscribe((x: boolean) => {
      this.refreshToken.next(x);
    });
  }
  deactivateYacht(yachtId: number) {
    const modalRef = this.modalService.open(DeactivateYachtDialogComponent, { size: 'lg' });
    const deactivateYachtDialogInstance = modalRef.componentInstance;
    deactivateYachtDialogInstance.yachtId = yachtId;
  
    this.deactivateDialogSubscription = deactivateYachtDialogInstance.yachtDeactivated.subscribe((x: boolean) => {
      this.refreshToken.next(x);
    });
  }
  changeYachtStatus(yacht: YachtModel) {
    const modalRef = this.modalService.open(ChangeYachtStatusDialogComponent, { size: 'lg' });
    const changeYachtStatusDialogInstance = modalRef.componentInstance;
    changeYachtStatusDialogInstance.yacht = yacht;
  
    this.changeStatusDialogSubscription = changeYachtStatusDialogInstance.statusChanged.subscribe((x: boolean) => {
      this.refreshToken.next(x);
    });
  }
  reserveYacht(id?: number) {
    const modalRef = this.modalService.open(AddYachtReservationDialogComponent, { size: 'lg' });
    const addYachtReservationDialogInstance = modalRef.componentInstance;
    addYachtReservationDialogInstance.yachtId = id;
  
    this.changeStatusDialogSubscription = addYachtReservationDialogInstance.reservationAdded.subscribe((x: boolean) => {
      this.refreshToken.next(x);
    });
  }

  handleClick(id?: number) {
    if (id) {
      void this.router.navigate(['reservation-details', id])
    }
  }

  goToYachtNotices(yachtId: number) {
    const queryParams = {
      yachtId: yachtId
    }

    this.router.navigate(['/notices'], {queryParams: queryParams});
  }

  showHistoryStatuses(yachtId: number) {
    const modalRef = this.modalService.open(YachtStatusestDialogComponent, { size: 'lg' });
    const yachtStatusesDialogInstance = modalRef.componentInstance;
    yachtStatusesDialogInstance.statuses$ = this.service.getYachtStatusesHistory(yachtId);
  }
}