import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { ReservationsFacade } from '../../facade/reservations.facade';
import { AddReservationDialogComponent } from '../../dialogs/add-reservation-dialog/add-reservation-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, take } from 'rxjs';
import { Router } from '@angular/router';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss'],
  providers: [ReservationsFacade]
})
export class ReservationsComponent implements OnInit, OnDestroy {
  @ViewChild('addDialog') addDialog?: AddReservationDialogComponent;
  viewCalendar = false;
  viewDate: Date = new Date();
  reservationList$ = this.facade.reservationList$;
  reservationCalendar$ = this.facade.reservationCalendar$;
  paging$ = this.facade.paging$;
  sort$ = this.facade.sort$;
  filters$ = this.facade.filters$;
  pageSizes = [5, 10, 20];
  private dialogSubscription: Subscription = Subscription.EMPTY;

  searchForm: FormGroup = this.fb.group({
    value: ['', Validators.required],
  });

  constructor(
    public location: Location,
    private facade: ReservationsFacade,
    private modalService: NgbModal,
    private router: Router,
    private fb: NonNullableFormBuilder,
    ) {}

  ngOnInit(): void {
    this.facade.loadAll();
    this.filters$.pipe(take(1)).subscribe((x) => {
      const searchValue = x.find(y => y.field === 'name')?.value;
      this.searchForm.patchValue({value: searchValue});
    })
  }

  ngOnDestroy(): void {
    this.dialogSubscription.unsubscribe();
  }

  openAddReservationDialog() {
    const modalRef = this.modalService.open(AddReservationDialogComponent, { size: 'lg' });
    const addReservationDialogInstance = modalRef.componentInstance;

    this.dialogSubscription = addReservationDialogInstance.reservationAdded.subscribe(() => {
      this.facade.loadAll()
    });
  }

  sortChange(value?: string) {
    this.facade.sortChange({dir: value});
  }

  pageChange(event: number, currentPageSize: number) {
    this.facade.pageChange({skip: (event - 1) * currentPageSize, pageSize: currentPageSize});
  }

  pageSizeChange(pageSize: number) {
    this.facade.pageChange({skip: 0, pageSize: pageSize});
  }

  handleClick(id?: number) {
    if (id) {
      void this.router.navigate(['reservation-details', id])
    }
  }

  clearSearch() {
    this.searchForm.patchValue({value: ''});
    this.facade.filterChange([{field: 'name', value: ''}]);
  }
  search() {
    const {value} = this.searchForm.value
    this.facade.filterChange([{field: 'name', value: value}]);
  }
}
