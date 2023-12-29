import { Component, EventEmitter, OnInit, Output, inject } from "@angular/core";
import { FormGroup, NonNullableFormBuilder, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { NoticeDetailsService, NoticeEditModel, NoticeModel } from "../../service/notice-details.service";

@Component({
    selector: 'app-edit-notice',
    templateUrl: './edit-notice-dialog.component.html',
    styleUrls: ['./edit-notice-dialog.component.scss']
  })
  export class EditNoticeDialogComponent implements OnInit {
    @Output() noticeEdited: EventEmitter<boolean> = new EventEmitter<boolean>;
    notice?: NoticeModel;
    activeModal = inject(NgbActiveModal);
    loading = false;
  
    editNoticeForm: FormGroup = this.fb.group({
        description: [null, Validators.required]
    });
  
    constructor(
      private fb: NonNullableFormBuilder,
      private service: NoticeDetailsService
    ) {}

    ngOnInit(): void {
      if (this.notice) {
        this.editNoticeForm.patchValue({
          description: this.notice.description,
        });
      }
    }
  
    get formControls() {
      return this.editNoticeForm.controls;
    }
  
    editNotice() {
      if (this.editNoticeForm.invalid) return;
  
      this.loading = true;
        
      const {description} = this.editNoticeForm.value;
      const id = this.notice?.id ?? -1;
  
      this.service.editNotice({id, description}).subscribe({
        next: () => {
          this.loading = false
          this.noticeEdited.emit(true);
          void this.activeModal.close();
        },
        error: () => {
          this.loading = false;
          void this.activeModal.close();
        }
      })
    }
  }