import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { YachtDetailsService, YachtModel } from "../service/yacht-details.service";
import { BehaviorSubject, Observable, combineLatest, filter, map, switchMap, tap } from "rxjs";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-yacht-details',
  templateUrl: './yacht-details.component.html',
  styleUrls: ['./yacht-details.component.scss']
})
export class YachtDetailsComponent {

  refreshToken: BehaviorSubject<boolean> = new BehaviorSubject(false);

  yacht$: Observable<YachtModel> = combineLatest([
    this.route.paramMap,
    this.refreshToken.asObservable()
  ]).pipe(
    filter(p => p[0].get('yachtId') !== null),
    map(p => parseInt(p[0].get('yachtId') ?? '')),
    switchMap(yachtId => this.service.getYacht(yachtId)),
  );
  constructor(
    public location: Location,
    private service: YachtDetailsService,
    private route: ActivatedRoute,
  ){}

  editYacht() {}
  deactivateYacht() {}
}