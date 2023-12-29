import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ClubMemberShortDataModel } from '../../models/club-member.model';

@Component({
  selector: 'app-club-member-record',
  templateUrl: './club-member-record.component.html',
  styleUrls: ['./club-member-record.component.scss']
})
export class ClubMemberRecordComponent {
    @Input() record?: ClubMemberShortDataModel;

    constructor(private router: Router) {}

    handleClick(id?: number) {
      if (id) {
        void this.router.navigate(['user-details', id])
      }
    }
}