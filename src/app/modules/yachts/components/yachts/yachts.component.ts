import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { YachtsFacade } from '../../facade/yachts.facade';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddYachtDialogComponent } from '../../dialogs/add-yacht-dialog/add-yacht-dialog.component';
import { Subscription } from 'rxjs';
import { YACHT_TYPES } from '../../constants/yacht-types.constant';

@Component({
  selector: 'app-yachts',
  templateUrl: './yachts.component.html',
  styleUrls: ['./yachts.component.scss'],
  providers: [YachtsFacade]
})
export class YachtsComponent implements OnInit, OnDestroy {
  @ViewChild('addDialog') addDialog?: AddYachtDialogComponent;
  constructor(
    private facade: YachtsFacade,
    public location: Location,
    private modalService: NgbModal,
    ) {}
  pageSizes = [5, 10, 20];
  yachtTypes = YACHT_TYPES;
  private dialogSubscription: Subscription = Subscription.EMPTY;

  yachtList$ = this.facade.yachtList$;
  paging$ = this.facade.paging$;

  ngOnInit(): void {
    this.facade.loadAll();
  }

  ngOnDestroy(): void {
    this.dialogSubscription.unsubscribe();
  }

  pageChange(event: number, currentPageSize: number) {
    this.facade.pageChange({skip: (event - 1) * currentPageSize, pageSize: currentPageSize});
  }

  pageSizeChange(pageSize: number) {
    this.facade.pageChange({skip: 0, pageSize: pageSize});
  }

  sortChange(value?: string) {
    this.facade.sortChange({dir: value});
  }

  filtersChange(type: any) {}

  openAddYachtDialog() {
    const modalRef = this.modalService.open(AddYachtDialogComponent, { size: 'lg' });
    const addYachtDialogInstance = modalRef.componentInstance;

    this.dialogSubscription = addYachtDialogInstance.yachtAdded.subscribe(() => {
      this.facade.loadAll()
    });
	}
}
