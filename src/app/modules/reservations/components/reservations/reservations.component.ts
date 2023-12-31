import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ReservationsFacade } from '../../facade/reservations.facade';
import { AddReservationDialogComponent } from '../../dialogs/add-reservation-dialog/add-reservation-dialog.component';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, filter, map, take } from 'rxjs';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { TIMES } from 'src/app/modules/home/constants/searchForm.constant';
import { ReservationsService } from '../../service/reservations.service';
import { DictionaryService } from 'src/app/shared/service/dictionary.service';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss'],
  providers: [ReservationsFacade]
})
export class ReservationsComponent implements OnInit, OnDestroy {
  @ViewChild('addDialog') addDialog?: AddReservationDialogComponent;
  viewCalendar = true;
  viewDate: Date = new Date();
  reservationList$ = this.facade.reservationList$;
  reservationCalendar$ = this.facade.reservationCalendar$;
  paging$ = this.facade.paging$;
  sort$ = this.facade.sort$;
  filters$ = this.facade.filters$;
  pageSizes = [5, 10, 20];
  private dialogSubscription: Subscription = Subscription.EMPTY;
  formSubscription = Subscription.EMPTY;
  paramsSubscription = Subscription.EMPTY;
  calendarFormSubscription = Subscription.EMPTY;
  reservationStatuses$ = this.dictionaryService.getReservationStatusesDictionary().pipe(
    map(x => [null, ...(x.filter(y => (y.name !== 'CANCELLED' && y.name !== 'REJECTED')))])
  );
  pickupTimes = TIMES;
  dropoffTimes = TIMES;
  clubMembers$ = this.dictionaryService.getUsersDictionary().pipe(
    map(x => [null, ...x])
  );
  reservingUsers$ = this.dictionaryService.getReservingUsersDictionary().pipe(
    map(x => [null, ...x])
  );
  yachts$ = this.dictionaryService.getAllYachtsDictionary().pipe(
    map(x => [null, ...x])
  );

  viewCalendarForm: FormGroup = this.fb.group({
    viewCalendarDate: [null],
  });

  searchForm: FormGroup = this.fb.group({
    value: ['', Validators.required],
  });

  filtersForm: FormGroup = this.fb.group({
    showCancelled: [false],
    showRejected: [false],
    yacht: [null],
    clubMember: [null],
    reservingUser: [null],
    status: [null],
    inputPickup: [null],
    inputPickupTime: [null],
    inputDropoff: [null],
    inputDropoffTime: [null],
  });

  get formControls() {
    return this.filtersForm.controls;
  }

  constructor(
    public location: Location,
    private facade: ReservationsFacade,
    private modalService: NgbModal,
    private router: Router,
    private fb: NonNullableFormBuilder,
    private route: ActivatedRoute,
    private reservationService: ReservationsService,
    private dictionaryService: DictionaryService,
    ) {}

  ngOnInit(): void {
    this.facade.loadAll();
    this.filter();
    this.viewCalendarForm.patchValue({
      viewCalendarDate: this.getCurrentDate(),
    })
    this.filters$.pipe(take(1)).subscribe((x) => {
      const searchValue = x.find(y => y.field === 'name')?.value;
      this.searchForm.patchValue({value: searchValue});
    })
    this.formSubscription = this.filtersForm.valueChanges.subscribe((form) => {
      const {
        inputPickup,
        inputPickupTime,
        inputDropoff,
        inputDropoffTime
      } = form;

      const pickupTimeControl = this.filtersForm.get('inputPickupTime');
      if(pickupTimeControl && pickupTimeControl.enabled && !inputPickup) {
        pickupTimeControl.disable();
        if (pickupTimeControl.value !== null) {
          pickupTimeControl.patchValue(null);
        }
      }
      else if(pickupTimeControl && pickupTimeControl.disabled && inputPickup) {
        pickupTimeControl.enable();
      }

      const control = this.filtersForm.get('inputDropoffTime');
      if(control) {
        if(control.enabled) {
          if (!inputDropoff) {
            control.disable();
            if (control.value !== null) {
              control.patchValue(null);
            }
          }
          else {
              if (inputPickup?.year === inputDropoff?.year && inputPickup?.month === inputDropoff?.month && inputPickup?.day === inputDropoff?.day) {
                const minPickupTime = Math.min(...(this.pickupTimes.filter(x => x !== null) as  number[]));
                this.dropoffTimes = this.dropoffTimes.filter(x => x === null || x > (inputPickupTime ?? minPickupTime));
              }
              else {
                this.dropoffTimes = TIMES;
              }
          }
        }
        else if(control.disabled && inputDropoff) {
          control.enable();
        }
      }
    });

    this.calendarFormSubscription = this.viewCalendarForm.valueChanges.subscribe(form => {
      const { viewCalendarDate } = form;
      this.viewDate = this.getDate(viewCalendarDate);
    });

    // this.paramsSubscription = this.route.queryParams.subscribe(params => {
    //   this.filtersForm.patchValue({
    //     inputPickup: params['pickup'] ? this.getDateObj(new Date(params['pickup'])) : null,
    //     inputPickupTime: params['pickupTime'],
    //     inputDropoff: params['dropoff'] ? this.getDateObj(new Date(params['dropoff'])) : null,
    //     inputDropoffTime: params['dropoffTime'],
    //   });

    //   const inputPickupDateTime = params['pickup']
    //   ? new Date(
    //     params['pickup'],
    //     params['pickupTime'] === 'null' || params['pickupTime'] === null || params['pickupTime'] === undefined
    //     ? 0
    //     : parseInt(params['pickupTime'])
    //   )
    //   : null;

    // const inputDropoffDateTime = params['dropoff']
    //   ? new Date(
    //     params['dropoff'],
    //     params['dropoffTime'] === 'null' || params['dropoffTime'] === null || params['dropoffTime'] === undefined
    //     ? 0
    //     : parseInt(params['dropoffTime'])
    //     )
    //   : null;

    //   this.facade.filterChange([
    //     {field: 'pickup', value: inputPickupDateTime},
    //     {field: 'dropoff', value: inputDropoffDateTime},
    //     {field: 'cabin', value: parseInt(params['cabin'])},
    //     {field: 'people', value: parseInt(params['people'])}
    //   ]);
    // });
  }

  ngOnDestroy(): void {
    this.dialogSubscription.unsubscribe();
    this.formSubscription.unsubscribe();
    this.paramsSubscription.unsubscribe();
    this.calendarFormSubscription.unsubscribe();
  }

  getCurrentDate(): NgbDateStruct {
    const today = new Date();
    return {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate()
    };
  }

  getPickupMinDate(): NgbDateStruct {
    return this.getDateObj(new Date(0));
  }

  getMinDate(): NgbDateStruct {
    const pickUpDate = this.filtersForm.get('inputPickup')?.value;
    return pickUpDate ?? this.getPickupMinDate();
  }

  getDateObj(date: Date): NgbDateStruct {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };
  }

  getDate(dateObj: NgbDateStruct) {
    return new Date(
      dateObj?.year,
      dateObj?.month - 1,
      dateObj?.day
      );
  }

  openAddReservationDialog() {
    const modalRef = this.modalService.open(AddReservationDialogComponent, { size: 'lg' });
    const addReservationDialogInstance = modalRef.componentInstance;

    this.dialogSubscription = addReservationDialogInstance.reservationAdded.subscribe(() => {
      this.facade.loadAll()
    });
  }

  sortChange(value?: string) {
    this.facade.sortChange({dir: value});
  }

  pageChange(event: number, currentPageSize: number) {
    this.facade.pageChange({skip: (event - 1) * currentPageSize, pageSize: currentPageSize});
  }

  pageSizeChange(pageSize: number) {
    this.facade.pageChange({skip: 0, pageSize: pageSize});
  }

  handleClick(id?: number) {
    if (id) {
      void this.router.navigate(['reservation-details', id])
    }
  }

  clearSearch() {
    this.searchForm.patchValue({value: ''});
    this.filter();
    const {showCancelled, showRejected} = this.filtersForm.value;
    this.facade.filterChange([
      {field: 'name', value: ''},
      {field: 'cancelled', value: showCancelled},
      {field: 'rejected', value: showRejected},
    ]);
  }

  filter() {
    const {value} = this.searchForm.value
    const {
      showCancelled,
      showRejected,
      yacht,
      clubMember,
      reservingUser,
      status,
      inputPickup,
      inputPickupTime,
      inputDropoff,
      inputDropoffTime
    } = this.filtersForm.value;

    const inputPickupDateTime = inputPickup
      ? new Date(
      inputPickup?.year,
      inputPickup?.month - 1,
      inputPickup?.day,
      inputPickupTime === 'null' || inputPickupTime === null || inputPickupTime === undefined
        ? 0
        : parseInt(inputPickupTime)
      )
      : null;

    const inputDropoffDateTime = inputDropoff 
      ? new Date(
        inputDropoff.year,
        inputDropoff.month - 1,
        inputDropoff.day,
        inputDropoffTime === 'null' || inputDropoffTime === null || inputDropoffTime === undefined
          ? 0
          : parseInt(inputDropoffTime)
        )
      : null;
    this.facade.filterChange([
      {field: 'cancelled', value: showCancelled},
      {field: 'rejected', value: showRejected},
      {field: 'yacht', value: yacht},
      {field: 'club-member', value: clubMember},
      {field: 'reserving-user', value: reservingUser},
      {field: 'status', value: status},
      {field: 'pickup', value: inputPickupDateTime},
      {field: 'dropoff', value: inputDropoffDateTime},
      {field: 'name', value: value},
    ]);

    // const queryParams: NavigationExtras = {
    //   queryParams: {
    //     pickup: inputPickup ? this.getDate(inputPickup) : null,
    //     pickupTime: inputPickupTime,
    //     dropoff: inputDropoff ? this.getDate(inputDropoff) : null,
    //     dropoffTime: inputDropoffTime,
    //   },
    //   replaceUrl: true
    // };
    // this.router.navigate([], queryParams);
  }

  clearFilters() {
    this.filtersForm.patchValue({
      showCancelled: false,
      showRejected: false,
      yacht: null,
      clubMember: null,
      reservingUser: null,
      status: null,
      inputPickup: null,
      inputPickupTime: null,
      inputDropoff: null,
      inputDropoffTime: null,
    });
    const {value} = this.searchForm.value;
    const {showCancelled, showRejected} = this.filtersForm.value;
    this.facade.filterChange([
      {field: 'name', value: value},
      {field: 'cancelled', value: showCancelled},
      {field: 'rejected', value: showRejected},
  ]);
    // const queryParams: NavigationExtras = {
    //   queryParams: {},
    //   replaceUrl: true
    // };
    // this.router.navigate([], queryParams);
  }
}
