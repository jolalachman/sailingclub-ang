import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserShortDataModel } from '../../models/user.model';

@Component({
  selector: 'app-user-record',
  templateUrl: './user-record.component.html',
  styleUrls: ['./user-record.component.scss']
})
export class UserRecordComponent {
    @Input() record?: UserShortDataModel;

    constructor(private router: Router) {}

    handleClick(id?: number) {
      if (id) {
        void this.router.navigate(['user-details', id])
      }
    }
}