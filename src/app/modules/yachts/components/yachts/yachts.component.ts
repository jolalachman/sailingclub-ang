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
  }

  ngOnDestroy(): void {
    this.dialogSubscription.unsubscribe();
    this.formSubscription.unsubscribe();
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
  }
}
