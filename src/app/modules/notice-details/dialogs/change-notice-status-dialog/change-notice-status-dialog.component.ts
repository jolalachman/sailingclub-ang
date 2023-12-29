import { Component, EventEmitter, OnInit, Output, inject } from "@angular/core";
import { FormGroup, NonNullableFormBuilder } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { NoticeDetailsService, NoticeModel } from "../../service/notice-details.service";
import { map } from "rxjs";
import { DictionaryService } from "src/app/shared/service/dictionary.service";

@Component({
    selector: 'change-notice-status',
    templateUrl: './change-notice-status-dialog.component.html',
    styleUrls: ['./change-notice-status-dialog.component.scss']
  })
  export class ChangeNoticeStatusDialogComponent implements OnInit {
    @Output() statusChanged: EventEmitter<boolean> = new EventEmitter<boolean>;
    notice?: NoticeModel;
    activeModal = inject(NgbActiveModal);
    statusForm: FormGroup = this.fb.group({
      statusId: [null],
    });

    currentStatuses$ = this.dictionaryService.getNoticeStatusesDictionary().pipe(
      map(x => [null, ...x])
    );

    get formControls() {
      return this.statusForm.controls;
    }

    constructor(
      private service: NoticeDetailsService,
      private fb: NonNullableFormBuilder,
      private dictionaryService: DictionaryService,
      ) {}
    
    ngOnInit(): void {
      if (this.notice) {
        this.statusForm.patchValue({
          statusId: this.notice?.currentStatus.id,
        });
      }
    }

    changeStatus() {
      if (this.notice) {
        const {statusId} = this.statusForm.value;
        this.service.changeNoticeStatus({id: this.notice.id, statusId: statusId}).subscribe({
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