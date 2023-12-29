import { Component, Input } from "@angular/core";
import { MyReservationShortDataModel } from "../../models/my-reservation.model";
import { Router } from "@angular/router";

@Component({
    selector: 'app-my-reservation-record',
    templateUrl: './my-reservation-record.component.html',
    styleUrls: ['./my-reservation-record.component.scss']
  })
  export class MyReservationRecordComponent {
    @Input() record?: MyReservationShortDataModel;

    constructor(private router: Router) {}

    handleClick(id?: number) {
      if (id) {
        void this.router.navigate(['reservation-details', id])
      }
    }
  }