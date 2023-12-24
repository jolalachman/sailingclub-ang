import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { YachtsFacade } from '../../facade/yachts.facade';
import { Location } from '@angular/common';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddYachtDialogComponent } from '../../dialogs/add-yacht-dialog/add-yacht-dialog.component';
import { Subscription, take } from 'rxjs';
import { YACHT_TYPES } from '../../constants/yacht-types.constant';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { CABINS, PEOPLE, TIMES } from 'src/app/modules/home/constants/searchForm.constant';
import { FiltersModel } from '../../models/yacht.model';
import { YACHT_STATUSES } from '../../constants/yacht-statuses.constant';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-yachts',
  templateUrl: './yachts.component.html',
  styleUrls: ['./yachts.component.scss'],
  providers: [YachtsFacade]
})
export class YachtsComponent implements OnInit, OnDestroy {
  @ViewChild('addDialog') addDialog?: AddYachtDialogComponent;
  constructor(
    private facade: YachtsFacade,
    public location: Location,
    private modalService: NgbModal,
    private fb: NonNullableFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    ) {}
  pageSizes = [5, 10, 20];
  yachtTypes = YACHT_TYPES;
  yachtStatuses = YACHT_STATUSES;
  pickupTimes = TIMES;
  dropoffTimes = TIMES;
  numOfCabins = CABINS;
  numOfPeople = PEOPLE;
  private dialogSubscription: Subscription = Subscription.EMPTY;
  formSubscription = Subscription.EMPTY;
  paramsSubscription = Subscription.EMPTY;

  filtersForm: FormGroup = this.fb.group({
    type: [null],
    status: [null],
    inputPickup: [null],
    inputPickupTime: [null],
    inputDropoff: [null],
    inputDropoffTime: [null],
    cabinInput: [null],
    peopleInput: [null],
  });

  yachtList$ = this.facade.yachtList$;
  paging$ = this.facade.paging$;
  sort$ = this.facade.sort$;
  filters$ = this.facade.filters$;

  searchForm: FormGroup = this.fb.group({
    value: ['', Validators.required],
  });

  get formControls() {
    return this.filtersForm.controls;
  }

  getCurrentDate(): NgbDateStruct {
    const today = new Date();
    return {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate()
    };
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

  getMinDate(): NgbDateStruct {
    const currentDate = this.getCurrentDate();
    const pickUpDate = this.filtersForm.get('inputPickup')?.value;
    return pickUpDate ?? currentDate;
  }
  
  ngOnInit(): void {
    this.facade.loadAll();
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
              this.dropoffTimes = TIMES.filter(num => num === null || num > +inputPickupTime )
              if (control.value !== null && (+inputPickupTime >= +inputDropoffTime || Number.isNaN(+inputPickupTime))) {
                control.patchValue(null);
              }
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

    this.paramsSubscription = this.route.queryParams.subscribe(params => {
      this.filtersForm.patchValue({
        inputPickup: params['pickup'] ? this.getDateObj(new Date(params['pickup'])) : null,
        inputPickupTime: params['pickupTime'],
        inputDropoff: params['dropoff'] ? this.getDateObj(new Date(params['dropoff'])) : null,
        inputDropoffTime: params['dropoffTime'],
        cabinInput: params['cabin'],
        peopleInput: params['people'],
      });

      const inputPickupDateTime = params['pickup']
      ? new Date(
        params['pickup'],
        params['pickupTime'] === 'null' || params['pickupTime'] === null || params['pickupTime'] === undefined
        ? 0
        : parseInt(params['pickupTime'])
      )
      : null;

    const inputDropoffDateTime = params['dropoff']
      ? new Date(
        params['dropoff'],
        params['dropoffTime'] === 'null' || params['dropoffTime'] === null || params['dropoffTime'] === undefined
        ? 0
        : parseInt(params['dropoffTime'])
        )
      : null;

      this.facade.filterChange([
        {field: 'pickup', value: inputPickupDateTime},
        {field: 'dropoff', value: inputDropoffDateTime},
        {field: 'cabin', value: parseInt(params['cabin'])},
        {field: 'people', value: parseInt(params['people'])}
      ]);
    });

  }

  ngOnDestroy(): void {
    this.dialogSubscription.unsubscribe();
    this.formSubscription.unsubscribe();
    this.paramsSubscription.unsubscribe();
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

  filtersChange(value: any) {}

  openAddYachtDialog() {
    const modalRef = this.modalService.open(AddYachtDialogComponent, { size: 'lg' });
    const addYachtDialogInstance = modalRef.componentInstance;

    this.dialogSubscription = addYachtDialogInstance.yachtAdded.subscribe(() => {
      this.facade.loadAll()
    });
	}

  clearSearch() {
    this.searchForm.patchValue({value: ''});
    this.filter();
    this.facade.filterChange([{field: 'name', value: ''}]);
  }

  search() {
    const {value} = this.searchForm.value
    this.facade.filterChange([{field: 'name', value: value}]);
  }
  filter() {
    const {value} = this.searchForm.value
    const {
      type,
      status,
      inputPickup,
      inputPickupTime,
      inputDropoff,
      inputDropoffTime,
      cabinInput,
      peopleInput
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
      {field: 'type', value: type},
      {field: 'status', value: status},
      {field: 'pickup', value: inputPickupDateTime},
      {field: 'dropoff', value: inputDropoffDateTime},
      {field: 'cabin', value: parseInt(cabinInput)},
      {field: 'people', value: parseInt(peopleInput)},
      {field: 'name', value: value},
    ]);

    const queryParams: NavigationExtras = {
      queryParams: {
        pickup: inputPickup ? this.getDate(inputPickup) : null,
        pickupTime: inputPickupTime,
        dropoff: inputDropoff ? this.getDate(inputDropoff) : null,
        dropoffTime: inputDropoffTime, 
        cabin: cabinInput, 
        people: peopleInput
      },
      replaceUrl: true
    };
    this.router.navigate([], queryParams);
  }

  clearFilters() {
    this.filtersForm.patchValue({
      status: null,
      type: null,
      inputPickup: null,
      inputPickupTime: null,
      inputDropoff: null,
      inputDropoffTime: null,
      cabinInput: null,
      peopleInput: null,
    });
    const {value} = this.searchForm.value;
    this.facade.filterChange([{field: 'name', value: value},]);
    const queryParams: NavigationExtras = {
      queryParams: {},
      replaceUrl: true
    };
    this.router.navigate([], queryParams);
  }
}
