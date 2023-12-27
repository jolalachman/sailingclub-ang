import { Component, EventEmitter, OnDestroy, OnInit, Output, inject } from "@angular/core";
import { FormGroup, NonNullableFormBuilder, Validators } from "@angular/forms";
import { NgbActiveModal, NgbDateParserFormatter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { LoginService } from "src/app/core/service/login/login.service";
import { ADD_TIMES, PEOPLE } from "src/app/modules/home/constants/searchForm.constant";
import { Subscription } from "rxjs";
import { MyNgbDateParserFormatter } from "src/app/modules/home/formaters/my-ngb-date-parser.formatter";
import { ReservationsService } from "src/app/modules/reservations/service/reservations.service";

@Component({
    selector: 'app-add-yacht-reservation',
    templateUrl: './add-yacht-reservation-dialog.component.html',
    styleUrls: ['./add-yacht-reservation-dialog.component.scss'],
    providers: [{provide: NgbDateParserFormatter, useClass: MyNgbDateParserFormatter}]
  })
  export class AddYachtReservationDialogComponent implements OnInit, OnDestroy {
    @Output() reservationAdded: EventEmitter<boolean> = new EventEmitter<boolean>;
    yachtId?: number;
    pickupTimes = ADD_TIMES;
    dropoffTimes = ADD_TIMES;
    activeModal = inject(NgbActiveModal);
    formSubscription = Subscription.EMPTY;
    loading = false;
    numOfPeople = PEOPLE.filter(x => (x !== null));

    userInfo$ = this.loginService.userInfo.asObservable();
    users$ = this.reservationService.getUsersDictionary();

    addReservationForm: FormGroup = this.fb.group({
      pickupDate: [null, Validators.required],
      pickupTime: [null, Validators.required],
      dropoffDate: [null, Validators.required],
      dropoffTime: [null, Validators.required],
      peopleNumber: [null, Validators.required],
      yachtId: [null, Validators.required],
    });
  
    constructor(
      private fb: NonNullableFormBuilder,
      private reservationService: ReservationsService,
      private loginService: LoginService,
    ) {}

    ngOnInit(): void {
      this.formSubscription = this.addReservationForm.valueChanges.subscribe((form) => {
        const {
          pickupDate,
          pickupTime,
          dropoffDate,
          dropoffTime
        } = form;
  
        const pickupTimeControl = this.addReservationForm.get('pickupTime');
        if(pickupTimeControl && pickupTimeControl.enabled && !pickupDate) {
          pickupTimeControl.disable();
          if (pickupTimeControl.value !== null) {
            pickupTimeControl.patchValue(null);
          }
        }
        else if(pickupTimeControl && pickupTimeControl.disabled && pickupDate) {
          pickupTimeControl.enable();
        }
  
        const control = this.addReservationForm.get('dropoffTime');
        if(control) {
          if(control.enabled) {
            if (!dropoffDate) {
              control.disable();
              if (control.value !== null) {
                control.patchValue(null);
              }
            }
            else {
              if (pickupDate?.year === dropoffDate?.year && pickupDate?.month === dropoffDate?.month && pickupDate?.day === dropoffDate?.day) {
                this.dropoffTimes = ADD_TIMES.filter(num => num > +pickupTime )
                if (control.value !== null && (+pickupTime >= +dropoffTime || Number.isNaN(+pickupTime))) {
                  control.patchValue(null);
                }
              }
              else {
                this.dropoffTimes = ADD_TIMES;
              }
            }
          }
          else if(control.disabled && dropoffDate) {
            control.enable();
          }
        }
      });

      this.addReservationForm.patchValue({
        yachtId: this.yachtId,
      })
    }

    ngOnDestroy(): void {
      this.formSubscription.unsubscribe();
    }
  
    get formControls() {
      return this.addReservationForm.controls;
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
      const pickUpDate = this.addReservationForm.get('pickupDate')?.value;
      return pickUpDate ?? currentDate;
    }

    reserveYacht(firstName: string, lastName: string, id: string) {
      if (this.addReservationForm.invalid) return;

      this.loading = true;

      const userId = parseInt(id, 10);
      
      const {
        pickupDate,
        pickupTime,
        dropoffDate,
        dropoffTime,
        peopleNumber,
        yachtId,
      } = this.addReservationForm.value;

      const pickupDateTime = new Date(
        pickupDate?.year,
        pickupDate?.month - 1,
        pickupDate?.day,
        pickupTime === 'null' || pickupTime === null || pickupTime === undefined
          ? 1
          : parseInt(pickupTime) + 1
        );
  
      const dropoffDateTime = new Date(
        dropoffDate.year,
        dropoffDate.month - 1,
        dropoffDate.day,
        dropoffTime === 'null' || dropoffTime === null || dropoffTime === undefined
          ? 1
          : parseInt(dropoffTime) + 1
        );

      const pickup = pickupDateTime.toISOString();
      const dropoff = dropoffDateTime.toISOString();
      const reservingPerson = firstName + " " + lastName;
      
      this.reservationService.addYachtReservation({
        pickup,
        dropoff,
        reservingPerson,
        peopleNumber,
        userId,
        yachtId,
      }).subscribe({
        next: () => {
          this.loading = false;
          this.reservationAdded.emit(true);
          void this.activeModal.close();
        },
        error: () => {
          this.loading = false;
          void this.activeModal.close();
        }
      });
    }
  }