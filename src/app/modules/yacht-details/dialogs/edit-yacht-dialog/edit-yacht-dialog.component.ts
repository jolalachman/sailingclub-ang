import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, inject } from "@angular/core";
import { FormGroup, NonNullableFormBuilder, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { YachtsService } from "src/app/modules/yachts/service/yachts.service";
import { YachtModel } from "../../service/yacht-details.service";
import { map } from "rxjs";
import { DictionaryService } from "src/app/shared/service/dictionary.service";
import { CABINS, PEOPLE } from "src/app/modules/home/constants/searchForm.constant";

@Component({
    selector: 'edit-add-yacht',
    templateUrl: './edit-yacht-dialog.component.html',
    styleUrls: ['./edit-yacht-dialog.component.scss']
  })
  export class EditYachtDialogComponent implements OnInit {
    @Output() yachtAdded: EventEmitter<boolean> = new EventEmitter<boolean>;
    yacht?: YachtModel;
    yachtTypes$ = this.dictionaryService.getYachtTypesDictionary().pipe(
      map(x => [null, ...x])
    );
    activeModal = inject(NgbActiveModal);
    loading = false;
    numOfCabins = CABINS;
    numOfPeople = PEOPLE;

    addYachtForm: FormGroup = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      type: [null],
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
      private dictionaryService: DictionaryService,
    ) {}
    ngOnInit(): void {
      if (this.yacht) {
        this.addYachtForm.patchValue({
          id: this.yacht.id,
          name: this.yacht.name,
          type: this.yacht.type.id,
          registrationNumber: this.yacht.registrationNumber,
          description: this.yacht.description,
          photo: this.yacht.photo,
          length: this.yacht.technicalData.length,
          width: this.yacht.technicalData.width,
          immersion: this.yacht.technicalData.immersion,
          sailArea: this.yacht.technicalData.sailArea,
          maxPeople: this.yacht.technicalData.maxPeople,
          cabinNumber: this.yacht.technicalData.cabinNumber,
          shower: this.yacht.equipment.shower,
          wc: this.yacht.equipment.wc,
          microwave: this.yacht.equipment.microwave,
          radio: this.yacht.equipment.radio,
          dailyPrice: this.yacht.dailyPrice,
          hourlyPrice: this.yacht.hourlyPrice,
        });
      }
    }
  
    get formControls() {
      return this.addYachtForm.controls;
    }

    editYacht() {
      if (this.addYachtForm.invalid) return;

      this.loading = true;
      
      const {
        id,
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

      this.yachtService.editYacht({
        id,
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
        next: () => {
          this.loading = false;
          this.yachtAdded.emit(true);
          void this.activeModal.close();
        },
        error: () => {
          this.loading = false;
          void this.activeModal.close();
        }
      })
    }

    onFileChange(event: any) {
      let reader = new FileReader();
     
      if(event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        if(file.type.includes('image')){
          reader.readAsDataURL(file);
      
          reader.onload = () => {
            this.addYachtForm.patchValue({
              photo: reader.result
            });
            this.cd.markForCheck();
          };
        }
      }
    }
  }