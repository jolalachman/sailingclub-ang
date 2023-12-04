import { Component } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  pickupDate: NgbDateStruct | undefined;
  dropoffDate: NgbDateStruct | undefined;
  time = { hour: 13, minute: 30 };
  cabinValue: number = 1;
  peopleValue: number = 1;
}
