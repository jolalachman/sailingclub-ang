import { Component, Input } from '@angular/core';
import { YachtShortDataModel } from '../../models/yacht.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-yacht-record',
  templateUrl: './yacht-record.component.html',
  styleUrls: ['./yacht-record.component.scss']
})
export class YachtRecordComponent {
    @Input() record?: YachtShortDataModel;

    constructor(private router: Router) {}

    handleClick(id?: number) {
      if (id) {
        void this.router.navigate(['yacht-details', id])
      }
    }
}