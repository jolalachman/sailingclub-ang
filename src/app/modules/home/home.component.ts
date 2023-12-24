import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CABINS, PEOPLE, TIMES } from './constants/searchForm.constant';
import { Subscription } from 'rxjs';
import { MyNgbDateParserFormatter } from './formaters/my-ngb-date-parser.formatter';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [{provide: NgbDateParserFormatter, useClass: MyNgbDateParserFormatter}]
})
export class HomeComponent implements OnInit, OnDestroy {
  pickupTimes = TIMES;
  dropoffTimes = TIMES;
  numOfCabins = CABINS;
  numOfPeople = PEOPLE;
  loading = false;

  formSubscription = Subscription.EMPTY;
  
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
    const pickUpDate = this.searchForm.get('inputPickup')?.value;
    return pickUpDate ?? currentDate;
  }

  constructor(
    private fb: NonNullableFormBuilder,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.formSubscription = this.searchForm.valueChanges.subscribe((form) => {
      const {
        inputPickup,
        inputPickupTime,
        inputDropoff,
        inputDropoffTime
      } = form;

      const pickupTimeControl = this.searchForm.get('inputPickupTime');
      if(pickupTimeControl && pickupTimeControl.enabled && !inputPickup) {
        pickupTimeControl.disable();
        if (pickupTimeControl.value !== null) {
          pickupTimeControl.patchValue(null);
        }
      }
      else if(pickupTimeControl && pickupTimeControl.disabled && inputPickup) {
        pickupTimeControl.enable();
      }

      const control = this.searchForm.get('inputDropoffTime');
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
    this.formSubscription.unsubscribe();
  }

  searchForm: FormGroup = this.fb.group({
    inputPickup: [null , Validators.required],
    inputPickupTime: [null],
    inputDropoff: [null],
    inputDropoffTime: [null],
    cabinInput: [null],
    peopleInput: [null],
  });

  get formControls() {
    return this.searchForm.controls;
  }

  search() {
    if (this.searchForm.invalid) return;

    this.loading = true;
    
    const {
      inputPickup,
      inputPickupTime,
      inputDropoff,
      inputDropoffTime,
      cabinInput,
      peopleInput
    } = this.searchForm.value;

    const inputPickupDate = new Date(
      inputPickup?.year,
      inputPickup?.month - 1,
      inputPickup?.day
      );

    const inputDropoffDate = inputDropoff 
      ? new Date(
        inputDropoff.year,
        inputDropoff.month - 1,
        inputDropoff.day
        )
      : null;

      const queryParams = {
        pickup: inputPickupDate,
        pickupTime: inputPickupTime,
        dropoff: inputDropoffDate,
        dropoffTime: inputDropoffTime, 
        cabin: cabinInput, 
        people: peopleInput
      }

      this.router.navigate(['/yachts'], {queryParams: queryParams});
  }
}
