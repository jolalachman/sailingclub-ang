import { Location } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ReportedNoticesFacade } from "../../facade/reported-notices.facade";
import { FormGroup, NonNullableFormBuilder, Validators } from "@angular/forms";
import { Subscription, map, take } from "rxjs";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { DictionaryService } from "src/app/shared/service/dictionary.service";

@Component({
  selector: 'app-notices',
  templateUrl: './notices.component.html',
  styleUrls: ['./notices.component.scss'],
  providers: [ReportedNoticesFacade]
})
export class NoticesComponent implements OnInit, OnDestroy {
  pageSizes = [5, 10, 20];

  paramsSubscription = Subscription.EMPTY;

  searchForm: FormGroup = this.fb.group({
    value: ['', Validators.required],
  });

  filtersForm: FormGroup = this.fb.group({
    showClosed: [false],
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
  yachts$ = this.dictionaryService.getAllYachtsDictionary().pipe(
    map(x => [null, ...x])
  );
  reservations$ = this.dictionaryService.getAllReservationsDictionary().pipe(
    map(x => [null, ...x])
  );
  clubMembers$ = this.dictionaryService.getUsersDictionary().pipe(
    map(x => [null, ...x])
  );
  currentStatuses$ = this.dictionaryService.getNoticeStatusesDictionary().pipe(
    map(x => [null, ...(x.filter(y => (y.name !== 'COMPLETED')))])
  );

  constructor(
    public location: Location,
    private facade: ReportedNoticesFacade,
    private fb: NonNullableFormBuilder,
    private dictionaryService: DictionaryService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.facade.loadAll();
    this.filters$.pipe(take(1)).subscribe((x) => {
      const searchValue = x.find(y => y.field === 'name')?.value;
      this.searchForm.patchValue({value: searchValue});
    })
    this.paramsSubscription = this.route.queryParams.subscribe(params => {
      this.filtersForm.patchValue({
        yacht: params['yachtId'] ?? null,
        clubMember: params['userId'] ?? null,
      });

      this.facade.filterChange([
        {field: 'yacht', value: params['yachtId'] ?? null},
        {field: 'clubMember', value: params['userId'] ?? null}
      ]);
    });
    this.filter();
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }

  pageChange(event: number, currentPageSize: number) {
    this.facade.pageChange({skip: (event - 1) * currentPageSize, pageSize: currentPageSize});
  }

  pageSizeChange(pageSize: number) {
    this.facade.pageChange({skip: 0, pageSize: pageSize});
  }

  clearSearch() {
    this.searchForm.patchValue({value: ''});
    this.filter();
    const {showClosed} = this.filtersForm.value;
    this.facade.filterChange([
      {field: 'name', value: ''},
      {field: 'closed', value: showClosed}
    ]);
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
      showClosed,
      reportedAt,
      yacht,
      reservationId,
      clubMember,
      currentStatus
    } = this.filtersForm.value;



    this.facade.filterChange([
      {field: 'closed', value: showClosed},
      {field: 'reportedAt', value: reportedAt ? this.getDate(reportedAt).toISOString() : null},
      {field: 'yacht', value: yacht},
      {field: 'reservationId', value: reservationId},
      {field: 'clubMember', value: clubMember},
      {field: 'currentStatus', value: currentStatus},
      {field: 'name', value: value},
    ]);

    const queryParams: NavigationExtras = {
      queryParams: {
        yachtId: yacht,
        userId: clubMember
      },
      replaceUrl: true
    };
    this.router.navigate([], queryParams);
  }

  sortChange(value?: string) {
    this.facade.sortChange({dir: value});
  }

  clearFilters() {
    this.filtersForm.patchValue({
      showClosed: false,
      reportedAt: null,
      yacht: null,
      reservationId: null,
      clubMember: null,
      currentStatus: null
    });
    const {value} = this.searchForm.value;
    const {showClosed} = this.filtersForm.value;
    this.facade.filterChange([
      {field: 'name', value: value},
      {field: 'closed', value: showClosed}
    ]);
    const queryParams: NavigationExtras = {
      queryParams: {},
      replaceUrl: true
    };
    this.router.navigate([], queryParams);
  }
}