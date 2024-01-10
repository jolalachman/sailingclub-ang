import { ChangeDetectorRef, Component, EventEmitter, Output, inject } from "@angular/core";
import { FormGroup, NonNullableFormBuilder, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { YachtsService } from "../../service/yachts.service";
import { DictionaryService } from "src/app/shared/service/dictionary.service";
import { map } from "rxjs";
import { CABINS, PEOPLE } from "src/app/modules/home/constants/searchForm.constant";

@Component({
    selector: 'app-add-yacht',
    templateUrl: './add-yacht-dialog.component.html',
    styleUrls: ['./add-yacht-dialog.component.scss']
  })
  export class AddYachtDialogComponent {
    @Output() yachtAdded: EventEmitter<boolean> = new EventEmitter<boolean>;
    yachtTypes$ = this.dictionaryService.getYachtTypesDictionary();
    activeModal = inject(NgbActiveModal);
    loading = false;
    numOfCabins = CABINS;
    numOfPeople = PEOPLE;

    addYachtForm: FormGroup = this.fb.group({
      name: ['', Validators.required],
      type: [null, Validators.required],
      registrationNumber: ['', Validators.required],
      description: [''],
      photo: [null],
      length: [null],
      width: [null],
      immersion: [null],
      sailArea: [null],
      maxPeople: [null],
      cabinNumber: [null],
      shower: [false],
      wc: [false],
      microwave: [false],
      radio: [false],
      dailyPrice: [null],
      hourlyPrice: [null]
    });
  
    constructor(
      private fb: NonNullableFormBuilder,
      private cd: ChangeDetectorRef,
      private yachtService: YachtsService,
      private dictionaryService: DictionaryService
    ) {}
  
    get formControls() {
      return this.addYachtForm.controls;
    }

    addYacht() {
      if (this.addYachtForm.invalid) return;

      this.loading = true;
      
      const {
        name,
        type,
        registrationNumber,
        description,
        photo,
        length,
        width,
        immersion,
        sailArea,
        maxPeople,
        cabinNumber,
        shower,
        wc,
        microwave,
        radio,
        dailyPrice,
        hourlyPrice
      } = this.addYachtForm.value;

      this.yachtService.addYacht({
        name,
        type,
        registrationNumber,
        description,
        photo,
        dailyPrice,
        hourlyPrice,
        length,
        width,
        immersion,
        sailArea,
        maxPeople,
        cabinNumber,
        shower,
        wc,
        microwave,
        radio
      }).subscribe({
        next: (x) => {
          this.loading = false;
          if (x) {
            this.yachtAdded.emit(true);
            void this.activeModal.close();
          }
          else {
            this.addYachtForm.get('registrationNumber')?.setErrors({
              wrongRegistration: true,
            })
          }
        },
        error: () => {
          this.loading = false;
        }
      })
    }

    onFileChange(event: any) {
      let reader = new FileReader();
     
      if(event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        if(file.type.includes('image') && file.type.includes('png') && file.size < 65535){
          reader.readAsDataURL(file);
      
          reader.onload = () => {
            this.addYachtForm.patchValue({
              photo: reader.result
            });
            this.cd.markForCheck();
          };
        }
        else {
          this.addYachtForm.get('photo')?.setErrors({
            wrongPhoto: true,
          })   
        }
      }
    }
  }