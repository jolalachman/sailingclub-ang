import { Location } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { UsersFacade } from "../../facade/users.facade";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AddUserDialogComponent } from "../../dialogs/add-user-dialog/add-user-dialog.component";
import { Subscription, map, take } from "rxjs";
import { FormGroup, NonNullableFormBuilder, Validators } from "@angular/forms";
import { DictionaryService } from "src/app/shared/service/dictionary.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [UsersFacade]
})
export class UsersComponent implements OnInit, OnDestroy {
  constructor(
    private facade: UsersFacade,
    public location: Location,
    private modalService: NgbModal,
    private fb: NonNullableFormBuilder,
    private dictionaryService: DictionaryService,
  //   private route: ActivatedRoute,
  //   private router: Router,
    ) {}
  pageSizes = [5, 10, 20];
  userRoles$ = this.dictionaryService.getUserRolesDictionary().pipe(
    map(x => [null, ...x])
  );
  sailingLicence$ = this.dictionaryService.getSailingLicensesDictionary().pipe(
    map(x => [null, ...x])
  );
  dialogSubscription: Subscription = Subscription.EMPTY;
  // paramsSubscription = Subscription.EMPTY;

  filtersForm: FormGroup = this.fb.group({
    role: [null],
    sailingLicence: [null],
  });

  userList$ = this.facade.usersList$;
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

  ngOnDestroy(): void {
    this.dialogSubscription.unsubscribe();
  //   this.formSubscription.unsubscribe();
  //   this.paramsSubscription.unsubscribe();
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

  openAddUserDialog() {
    const modalRef = this.modalService.open(AddUserDialogComponent, { size: 'lg' });
    const addUserDialogInstance = modalRef.componentInstance;

    this.dialogSubscription = addUserDialogInstance.userAdded.subscribe(() => {
      this.facade.loadAll()
    });
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