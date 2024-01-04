import { Location } from "@angular/common";
import { Component, OnDestroy } from "@angular/core";
import { BehaviorSubject, Observable, Subscription, combineLatest, filter, map, switchMap } from "rxjs";
import { ReportedNoticeShortDataModel } from "../../notices/models/reported-notice.model";
import { ActivatedRoute, Router } from "@angular/router";
import { NoticeDetailsService, NoticeModel } from "../service/notice-details.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { EditNoticeDialogComponent } from "../dialogs/edit-notice-dialog/edit-notice-dialog.component";
import { ChangeNoticeStatusDialogComponent } from "../dialogs/change-notice-status-dialog/change-notice-status-dialog.component";
import { LoginService } from "src/app/core/service/login/login.service";

@Component({
  selector: 'app-notice-details',
  templateUrl: './notice-details.component.html',
  styleUrls: ['./notice-details.component.scss']
})
export class NoticeDetailsComponent implements OnDestroy {
  dialogSubscription: Subscription = Subscription.EMPTY;
  changeNoticeStatusSubscription: Subscription = Subscription.EMPTY;
  refreshToken: BehaviorSubject<boolean> = new BehaviorSubject(false);
    
  role = this.loginService.userInformation?.role ?? '';
  id = this.loginService.userInformation?.id ?? '';

  notice$: Observable<NoticeModel> = combineLatest([
    this.route.paramMap,
    this.refreshToken.asObservable()
  ]).pipe(
    filter(p => p[0].get('noticeId') !== null),
    map(p => parseInt(p[0].get('noticeId') ?? '')),
    switchMap(noticeId => this.service.getNotice(noticeId)),
  );

  constructor(
    public location: Location,
    private route: ActivatedRoute,
    public router: Router,
    private service: NoticeDetailsService,
    private modalService: NgbModal,
    private loginService: LoginService,
  ) {}

  ngOnDestroy(): void {
    this.dialogSubscription.unsubscribe();
    this.changeNoticeStatusSubscription.unsubscribe();
  }

  editNotice(notice: NoticeModel) {
    const modalRef = this.modalService.open(EditNoticeDialogComponent, { size: 'lg' });
    const editNoticeDialogInstance = modalRef.componentInstance;
    editNoticeDialogInstance.notice = notice;
  
    this.dialogSubscription = editNoticeDialogInstance.noticeEdited.subscribe((x: boolean) => {
      this.refreshToken.next(x);
    });
  }

  changeNoticeStatus(notice: NoticeModel) {
    const modalRef = this.modalService.open(ChangeNoticeStatusDialogComponent, { size: 'lg' });
    const changeNoticeStatusDialogInstance = modalRef.componentInstance;
    changeNoticeStatusDialogInstance.notice = notice;
  
    this.changeNoticeStatusSubscription = changeNoticeStatusDialogInstance.statusChanged.subscribe((x: boolean) => {
      this.refreshToken.next(x);
    });
  }
}