import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, inject } from "@angular/core";
import { FormGroup, NonNullableFormBuilder, Validators } from "@angular/forms";
import { NgbActiveModal, NgbDateParserFormatter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { ReservationsService } from "../../service/reservations.service";
import { LoginService } from "src/app/core/service/login/login.service";
import { ADD_TIMES, PEOPLE } from "src/app/modules/home/constants/searchForm.constant";
import { Subscription } from "rxjs";
import { MyNgbDateParserFormatter } from "src/app/modules/home/formaters/my-ngb-date-parser.formatter";
import { DictionaryService } from "src/app/shared/service/dictionary.service";

@Component({
    selector: 'app-add-reservation',
    templateUrl: './add-reservation-dialog.component.html',
    styleUrls: ['./add-reservation-dialog.component.scss'],
    providers: [{provide: NgbDateParserFormatter, useClass: MyNgbDateParserFormatter}]
  })
  export class AddReservationDialogComponent implements OnInit, OnDestroy {
    @Output() reservationAdded: EventEmitter<boolean> = new EventEmitter<boolean>;
    pickupTimes = ADD_TIMES;
    dropoffTimes = ADD_TIMES;
    activeModal = inject(NgbActiveModal);
    formSubscription = Subscription.EMPTY;
    loading = false;
    numOfPeople = PEOPLE.filter(x => (x !== null));

    userInfo$ = this.loginService.userInfo.asObservable();
    yachts$ = this.dictionaryService.getYachtsDictionary();
    users$ = this.dictionaryService.getUsersDictionary();

    addReservationForm: FormGroup = this.fb.group({
      pickupDate: [null, Validators.required],
      pickupTime: [null, Validators.required],
      dropoffDate: [null, Validators.required],
      dropoffTime: [null, Validators.required],
      peopleNumber: [null, Validators.required],
      userId: [null, Validators.required],
      yachtId: [null, Validators.required],
    });
  
    constructor(
      private fb: NonNullableFormBuilder,
      private reservationService: ReservationsService,
      private dictionaryService: DictionaryService,
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

        const currentDate = this.getCurrentDate()
        if(pickupDate?.year === currentDate?.year && pickupDate?.month === currentDate?.month && pickupDate?.day === currentDate?.day)
        {
          this.pickupTimes = this.pickupTimes.filter(x => {
            const currentTime = new Date().getHours();
            return x === null || x > currentTime
          })
        }
        else {
          this.pickupTimes = ADD_TIMES;
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
                const minPickupTime = Math.min(...(this.pickupTimes.filter(x => x !== null) as  number[]));
                this.dropoffTimes = this.dropoffTimes.filter(x => x === null || x > (pickupTime ?? minPickupTime));
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

    addYacht(id: string) {
      if (this.addReservationForm.invalid) return;

      this.loading = true;
      
      const {
        pickupDate,
        pickupTime,
        dropoffDate,
        dropoffTime,
        peopleNumber,
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
      const reservingPersonId = id;
      
      this.reservationService.addReservation({
        pickup,
        dropoff,
        peopleNumber,
        reservingPersonId,
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