import { Location } from "@angular/common";
import { Component } from "@angular/core";
import { ReportedNoticesFacade } from "../../facade/reported-notices.facade";
import { FormGroup, NonNullableFormBuilder, Validators } from "@angular/forms";
import { map, take } from "rxjs";
import { ReservationsService } from "src/app/modules/reservations/service/reservations.service";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-notices',
  templateUrl: './notices.component.html',
  styleUrls: ['./notices.component.scss'],
  providers: [ReportedNoticesFacade]
})
export class NoticesComponent {
  pageSizes = [5, 10, 20];

  searchForm: FormGroup = this.fb.group({
    value: ['', Validators.required],
  });

  filtersForm: FormGroup = this.fb.group({
    reportedAt: [null],
    yacht: [null],
    reservationId: [null],
    clubMember: [null],
    currentStatus: [null]
  });

  reportedNoticesList$ = this.facade.reportedNoticesList$;
  paging$ = this.facade.paging$;
  sort$ = this.facade.sort$;
  filters$ = this.facade.filters$;
  yachts$ = this.reservationService.getAllYachtsDictionary().pipe(
    map(x => [null, ...x])
  );
  reservations$ = this.reservationService.getAllReservationsDictionary().pipe(
    map(x => [null, ...x])
  );
  clubMembers$ = this.reservationService.getUsersDictionary().pipe(
    map(x => [null, ...x])
  );
  currentStatuses$ = this.reservationService.getNoticeStatusesDictionary().pipe(
    map(x => [null, ...x])
  );

  constructor(
    public location: Location,
    private facade: ReportedNoticesFacade,
    private fb: NonNullableFormBuilder,
    private reservationService: ReservationsService,
  ) {}

  ngOnInit(): void {
    this.facade.loadAll();
    this.filters$.pipe(take(1)).subscribe((x) => {
      const searchValue = x.find(y => y.field === 'name')?.value;
      this.searchForm.patchValue({value: searchValue});
    })
  }

  pageChange(event: number, currentPageSize: number) {
    this.facade.pageChange({skip: (event - 1) * currentPageSize, pageSize: currentPageSize});
  }

  pageSizeChange(pageSize: number) {
    this.facade.pageChange({skip: 0, pageSize: pageSize});
  }

  clearSearch() {
    this.searchForm.patchValue({value: ''});
    // this.filter();
    this.facade.filterChange([{field: 'name', value: ''}]);
  }

  getDate(dateObj: NgbDateStruct) {
    return new Date(
      dateObj?.year,
      dateObj?.month - 1,
      dateObj?.day
      );
  }

  filter() {
    const {value} = this.searchForm.value
    const {
      reportedAt,
      yacht,
      reservationId,
      clubMember,
      currentStatus
    } = this.filtersForm.value;



    this.facade.filterChange([
      {field: 'reportedAt', value: reportedAt ? this.getDate(reportedAt).toISOString() : null},
      {field: 'yacht', value: yacht},
      {field: 'reservationId', value: reservationId},
      {field: 'clubMember', value: clubMember},
      {field: 'currentStatus', value: currentStatus},
      {field: 'name', value: value},
    ]);

    // const queryParams: NavigationExtras = {
    //   queryParams: {
    //     pickup: inputPickup ? this.getDate(inputPickup) : null,
    //     pickupTime: inputPickupTime,
    //     dropoff: inputDropoff ? this.getDate(inputDropoff) : null,
    //     dropoffTime: inputDropoffTime, 
    //     cabin: cabinInput, 
    //     people: peopleInput
    //   },
    //   replaceUrl: true
    // };
    // this.router.navigate([], queryParams);
  }

  sortChange(value?: string) {
    this.facade.sortChange({dir: value});
  }

  clearFilters() {
    this.filtersForm.patchValue({
      reportedAt: null,
      yacht: null,
      reservationId: null,
      clubMember: null,
      currentStatus: null
    });
    const {value} = this.searchForm.value;
    this.facade.filterChange([{field: 'name', value: value},]);
    // const queryParams: NavigationExtras = {
    //   queryParams: {},
    //   replaceUrl: true
    // };
    // this.router.navigate([], queryParams);
  }
}