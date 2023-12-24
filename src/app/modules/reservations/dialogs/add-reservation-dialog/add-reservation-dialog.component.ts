import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, inject } from "@angular/core";
import { FormGroup, NonNullableFormBuilder, Validators } from "@angular/forms";
import { NgbActiveModal, NgbDateParserFormatter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { ReservationsService } from "../../service/reservations.service";
import { LoginService } from "src/app/core/service/login/login.service";
import { TIMES } from "src/app/modules/home/constants/searchForm.constant";
import { Subscription } from "rxjs";
import { MyNgbDateParserFormatter } from "src/app/modules/home/formaters/my-ngb-date-parser.formatter";

@Component({
    selector: 'app-add-reservation',
    templateUrl: './add-reservation-dialog.component.html',
    styleUrls: ['./add-reservation-dialog.component.scss'],
    providers: [{provide: NgbDateParserFormatter, useClass: MyNgbDateParserFormatter}]
  })
  export class AddReservationDialogComponent implements OnInit, OnDestroy {
    @Output() reservationAdded: EventEmitter<boolean> = new EventEmitter<boolean>;
    pickupTimes = TIMES;
    dropoffTimes = TIMES;
    activeModal = inject(NgbActiveModal);
    formSubscription = Subscription.EMPTY;
    loading = false;

    userInfo$ = this.loginService.userInfo.asObservable();
    yachts$ = this.reservationService.getYachtsDictionary();
    users$ = this.reservationService.getUsersDictionary();

    addReservationForm: FormGroup = this.fb.group({
      pickupDate: [null, Validators.required],
      pickupTime: [null],
      dropoffDate: [null, Validators.required],
      dropoffTime: [null],
      userId: [1, Validators.required],
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
                this.dropoffTimes = TIMES.filter(num => num === null || num > +pickupTime )
                if (control.value !== null && (+pickupTime >= +dropoffTime || Number.isNaN(+pickupTime))) {
                  control.patchValue(null);
                }
              }
              else {
                this.dropoffTimes = TIMES;
              }
            }
          }
          else if(control.disabled && dropoffDate) {
            control.enable();
          }
        }
      });
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

    addYacht(firstName: string, lastName: string) {
      if (this.addReservationForm.invalid) return;

      this.loading = true;
      
      const {
        pickupDate,
        pickupTime,
        dropoffDate,
        dropoffTime,
        userId,
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
      
      this.reservationService.addReservation({
        pickup,
        dropoff,
        reservingPerson,
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