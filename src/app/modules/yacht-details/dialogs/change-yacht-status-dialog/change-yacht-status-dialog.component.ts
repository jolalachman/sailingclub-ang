import { Component, EventEmitter, OnInit, Output, inject } from "@angular/core";
import { FormGroup, NonNullableFormBuilder } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { YACHT_STATUSES } from "src/app/modules/yachts/constants/yacht-statuses.constant";
import { YachtsService } from "src/app/modules/yachts/service/yachts.service";
import { YachtModel } from "../../service/yacht-details.service";

@Component({
    selector: 'change-yacht-status',
    templateUrl: './change-yacht-status-dialog.component.html',
    styleUrls: ['./change-yacht-status-dialog.component.scss']
  })
  export class ChangeYachtStatusDialogComponent implements OnInit {
    @Output() statusChanged: EventEmitter<boolean> = new EventEmitter<boolean>;
    yacht?: YachtModel;
    activeModal = inject(NgbActiveModal);
    yachtStatuses = YACHT_STATUSES.filter(x => x!== null);
    statusForm: FormGroup = this.fb.group({
      status: [null],
    });

    get formControls() {
      return this.statusForm.controls;
    }

    constructor(
      private yachtService: YachtsService,
      private fb: NonNullableFormBuilder
      ) {}
    
    ngOnInit(): void {
      if (this.yacht) {
        this.statusForm.patchValue({
          status: this.yacht?.currentStatus,
        });
      }
    }

    changeStatus() {
      if (this.yacht) {
        const {status} = this.statusForm.value;
        this.yachtService.changeYachtStatus({id: this.yacht.id, status: status}).subscribe({
          next: () => {
            this.statusChanged.emit(true);
            void this.activeModal.close();
          },
          error: () => {
            void this.activeModal.close();
          }
        })
      }
    }
  }