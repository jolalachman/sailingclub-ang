import { Component, EventEmitter, OnInit, Output, inject } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ReservationDetailsService } from "src/app/modules/reservation-details/service/reservation-details.service";
import { YachtsService } from "src/app/modules/yachts/service/yachts.service";
import { YachtDetailsService, YachtStatusHistoryModel } from "../../service/yacht-details.service";
import { Observable } from "rxjs";

@Component({
    selector: 'yacht-statuses',
    templateUrl: './yacht-statuses-dialog.component.html',
    styleUrls: ['./yacht-statuses-dialog.component.scss']
  })
  export class YachtStatusestDialogComponent {
    @Output() yachtDeactivated: EventEmitter<boolean> = new EventEmitter<boolean>;
    activeModal = inject(NgbActiveModal);

    statuses$?: Observable<YachtStatusHistoryModel[]>;
  
    constructor(private service: YachtDetailsService) {}
  }