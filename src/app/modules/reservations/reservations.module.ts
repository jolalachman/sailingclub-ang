import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from 'src/app/core/service/storage/local-storage.service';
import { LANGUAGE_KEY } from 'src/app/core/service/language/constants';
import { JsonPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReservationsComponent } from './components/reservations/reservations.component';
import { ReservationsRoutingModule, routedComponents } from './reservations.routing.module';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbDatepickerModule, NgbDropdownModule, NgbPaginationModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { EffectsModule } from '@ngrx/effects';
import { ReservationsListEffect } from './store/effects';
import { StoreModule } from '@ngrx/store';
import { ReservationsListReducer } from './store/reducers';
import { ReservationRecordComponent } from './components/reservation-record/reservation-record.component';
import { AddReservationDialogComponent } from './dialogs/add-reservation-dialog/add-reservation-dialog.component';
import { CustomDateFormatPipe } from './pipes/dateformat.pipe';
import { HomeModule } from '../home/home.module';
import { YachtsModule } from '../yachts/yachts.module';


export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(
    http,
    `./assets/i18n/reservations/`,
    '.json',
  );
}

@NgModule({
  declarations: [
    ReservationsComponent,
    ReservationRecordComponent,
    AddReservationDialogComponent,
    routedComponents,
    CustomDateFormatPipe,
  ],
  imports: [
    CommonModule,
    ReservationsRoutingModule,
    FormsModule,
    JsonPipe,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    NgbPaginationModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    HomeModule,
    YachtsModule,


    // translation module
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      isolate: true,
    }),

    //ng store
    EffectsModule.forFeature(ReservationsListEffect.effects),
    StoreModule.forFeature(
      ReservationsListReducer.STATE_KEY,
      ReservationsListReducer.reducers,
    ),
  ],
  exports: [
    CustomDateFormatPipe,
  ]
})
export class ReservationsModule {
  constructor(
    protected translate: TranslateService,
    protected localStorageService: LocalStorageService,
  ) {
    const language = this.localStorageService.get(LANGUAGE_KEY);
    const browserLang = translate.getBrowserLang();
    this.translate.setDefaultLang(language ?? browserLang ?? 'pl');
  }
 }
