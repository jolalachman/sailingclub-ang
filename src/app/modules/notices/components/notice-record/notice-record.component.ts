import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ReportedNoticeShortDataModel } from '../../models/reported-notice.model';

@Component({
  selector: 'app-notice-record',
  templateUrl: './notice-record.component.html',
  styleUrls: ['./notice-record.component.scss']
})
export class NoticeRecordComponent {
    @Input() record?: ReportedNoticeShortDataModel;

    constructor(private router: Router) {}

    handleClick(id?: number) {
      if (id) {
        void this.router.navigate(['notice-details', id])
      }
    }
}