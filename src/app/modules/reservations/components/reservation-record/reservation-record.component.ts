import { Component, Input } from "@angular/core";
import { ReservationShortDataModel } from "../../models/reservation.model";
import { Router } from "@angular/router";

@Component({
    selector: 'app-reservation-record',
    templateUrl: './reservation-record.component.html',
    styleUrls: ['./reservation-record.component.scss']
  })
  export class ReservationRecordComponent {
    @Input() record?: ReservationShortDataModel;

    constructor(private router: Router) {}

    handleClick(id?: number) {
      if (id) {
        void this.router.navigate(['reservation-details', id])
      }
    }
  }