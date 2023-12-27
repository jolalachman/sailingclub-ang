import { Location } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormGroup, NonNullableFormBuilder, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription, take } from "rxjs";
import { SAILING_LICENCES } from "src/app/modules/users/constants/sailing-licences.constant";
import { USER_ROLES } from "src/app/modules/users/constants/user-roles.constant";
import { ClubMembersFacade } from "../../facade/club-members.facade";

@Component({
  selector: 'app-club-members',
  templateUrl: './club-members.component.html',
  styleUrls: ['./club-members.component.scss'],
  providers: [ClubMembersFacade]
})
export class ClubMembersComponent implements OnInit {
  constructor(
    private facade: ClubMembersFacade,
    public location: Location,
    private fb: NonNullableFormBuilder
  //   private route: ActivatedRoute,
  //   private router: Router,
    ) {}
  pageSizes = [5, 10, 20];
  userRoles = USER_ROLES.filter(x => x !== 'ADMIN');
  sailingLicences = SAILING_LICENCES;
  // paramsSubscription = Subscription.EMPTY;

  filtersForm: FormGroup = this.fb.group({
    role: [null],
    sailingLicence: [null],
  });

  clubMembersList$ = this.facade.clubMembersList$;
  paging$ = this.facade.paging$;
  sort$ = this.facade.sort$;
  filters$ = this.facade.filters$;

  searchForm: FormGroup = this.fb.group({
    value: ['', Validators.required],
  });
  
  ngOnInit(): void {
    this.facade.loadAll();
    this.filters$.pipe(take(1)).subscribe((x) => {
      const searchValue = x.find(y => y.field === 'name')?.value;
      this.searchForm.patchValue({value: searchValue});
    })
  //   this.paramsSubscription = this.route.queryParams.subscribe(params => {
  //     this.filtersForm.patchValue({
  //       inputPickup: params['pickup'] ? this.getDateObj(new Date(params['pickup'])) : null,
  //       inputPickupTime: params['pickupTime'],
  //       inputDropoff: params['dropoff'] ? this.getDateObj(new Date(params['dropoff'])) : null,
  //       inputDropoffTime: params['dropoffTime'],
  //       cabinInput: params['cabin'],
  //       peopleInput: params['people'],
  //     });

  //     const inputPickupDateTime = params['pickup']
  //     ? new Date(
  //       params['pickup'],
  //       params['pickupTime'] === 'null' || params['pickupTime'] === null || params['pickupTime'] === undefined
  //       ? 0
  //       : parseInt(params['pickupTime'])
  //     )
  //     : null;

  //   const inputDropoffDateTime = params['dropoff']
  //     ? new Date(
  //       params['dropoff'],
  //       params['dropoffTime'] === 'null' || params['dropoffTime'] === null || params['dropoffTime'] === undefined
  //       ? 0
  //       : parseInt(params['dropoffTime'])
  //       )
  //     : null;

  //     this.facade.filterChange([
  //       {field: 'pickup', value: inputPickupDateTime},
  //       {field: 'dropoff', value: inputDropoffDateTime},
  //       {field: 'cabin', value: parseInt(params['cabin'])},
  //       {field: 'people', value: parseInt(params['people'])}
  //     ]);
  //   });
  }

  pageChange(event: number, currentPageSize: number) {
    this.facade.pageChange({skip: (event - 1) * currentPageSize, pageSize: currentPageSize});
  }

  pageSizeChange(pageSize: number) {
    this.facade.pageChange({skip: 0, pageSize: pageSize});
  }

  sortChange(value?: string) {
    this.facade.sortChange({dir: value});
  }

  clearSearch() {
    this.searchForm.patchValue({value: ''});
    // this.filter();
    this.facade.filterChange([{field: 'name', value: ''}]);
  }

  filter() {
    const {value} = this.searchForm.value
    const {
      role,
      sailingLicence
    } = this.filtersForm.value;

    this.facade.filterChange([
      {field: 'role', value: role},
      {field: 'sailingLicence', value: sailingLicence},
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

  clearFilters() {
    this.filtersForm.patchValue({
      role: null,
      sailingLicence: null,
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