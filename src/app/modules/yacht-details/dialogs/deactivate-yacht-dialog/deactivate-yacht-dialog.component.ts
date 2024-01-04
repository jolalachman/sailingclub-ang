import { Component, EventEmitter, OnInit, Output, inject } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { YachtsService } from "src/app/modules/yachts/service/yachts.service";

@Component({
    selector: 'deactivate-yacht',
    templateUrl: './deactivate-yacht-dialog.component.html',
    styleUrls: ['./deactivate-yacht-dialog.component.scss']
  })
  export class DeactivateYachtDialogComponent {
    @Output() yachtDeactivated: EventEmitter<boolean> = new EventEmitter<boolean>;
    yachtId?: number;
    activeModal = inject(NgbActiveModal);
    loading = false;
  
    constructor(private yachtService: YachtsService) {}

    deactivateYacht() {
      if (this.yachtId) {
        this.loading = true;
        this.yachtService.deactivateYacht(this.yachtId).subscribe({
          next: () => {
            this.yachtDeactivated.emit(true);
            this.loading = false;
            void this.activeModal.close();
          },
          error: () => {
            this.loading = false;
            void this.activeModal.close();
          }
        })
      }
    }
  }