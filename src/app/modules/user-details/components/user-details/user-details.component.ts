import { Location } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormGroup, NonNullableFormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbDateStruct, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CalendarEvent } from "angular-calendar";
import { BehaviorSubject, Observable, Subscription, combineLatest, filter, map, switchMap } from "rxjs";
import { CALENDAR_COLORS } from "src/app/modules/reservations/constants/color.constant";
import { UserDetailsService, UserModel } from "../../service/user-details.service";
import { UserDetailsReservation } from "src/app/modules/users/models/user.model";
import { DeactivateUsertDialogComponent } from "../../dialogs/deactivate-user-dialog/deactivate-user-dialog.component";
import { EditUserDialogComponent } from "../../dialogs/edit-user-dialog/edit-user-dialog.component";
import { LoginService } from "src/app/core/service/login/login.service";

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  dialogSubscription: Subscription = Subscription.EMPTY;
  deactivateDialogSubscription: Subscription = Subscription.EMPTY;
  calendarFormSubscription: Subscription = Subscription.EMPTY;
  refreshToken: BehaviorSubject<boolean> = new BehaviorSubject(false);
  viewDate: Date = new Date();
  isCollapsed = false;
  isCollapsed2 = true;
  isCollapsed3 = true;
  isCollapsed4 = true;
  isCollapsed5 = true;

  
  role = this.loginService.userInformation?.role ?? '';

  viewCalendarForm: FormGroup = this.fb.group({
    viewCalendarDate: [null],
  });

  user$: Observable<UserModel> = combineLatest([
    this.route.paramMap,
    this.refreshToken.asObservable()
  ]).pipe(
    filter(p => p[0].get('userId') !== null),
    map(p => parseInt(p[0].get('userId') ?? '')),
    switchMap(userId => this.service.getUser(userId)),
  );
  constructor(
    public location: Location,
    private service: UserDetailsService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,    
    private fb: NonNullableFormBuilder,
    private loginService: LoginService,
  ) {}

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
    this.calendarFormSubscription.unsubscribe();
  }

  reservationCalendar$: Observable<CalendarEvent[]> = this.user$.pipe(
    map(user => {
        const startEndArray = user.reservations.map((item: UserDetailsReservation) => ({
            title: item.clientInfo,
            start: new Date(item.pickupDate),
            end: new Date(item.dropoffDate),
            color: {
                primary: item.currentStatus === 'PENDING' ? "#c0c0c0" : CALENDAR_COLORS[item.yachtId % CALENDAR_COLORS.length],
                secondary: item.currentStatus === 'PENDING' ? "#c0c0c0" : CALENDAR_COLORS[item.yachtId % CALENDAR_COLORS.length],
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

  editUser(user: UserModel) {
    const modalRef = this.modalService.open(EditUserDialogComponent, { size: 'lg' });
    const editUserDialogInstance = modalRef.componentInstance;
    editUserDialogInstance.user = user;
  
    this.dialogSubscription = editUserDialogInstance.userEdited.subscribe((x: boolean) => {
      this.refreshToken.next(x);
    });
  }
  deactivateUser(userId: number) {
    const modalRef = this.modalService.open(DeactivateUsertDialogComponent, { size: 'lg' });
    const deactivateUserDialogInstance = modalRef.componentInstance;
    deactivateUserDialogInstance.userId = userId;
  
    this.deactivateDialogSubscription = deactivateUserDialogInstance.userDeactivated.subscribe((x: boolean) => {
      this.refreshToken.next(x);
    });
  }

  handleClick(id?: number) {
    if (id) {
      void this.router.navigate(['reservation-details', id])
    }
  }

  validateCandidate(userId: number) {
    this.service.validateCandidate(userId).subscribe(x => this.refreshToken.next(x));
  }

  goToUserNotices(userId: number) {
    const queryParams = {
      userId: userId
    }
    this.router.navigate(['/notices'], {queryParams: queryParams});
  }
}