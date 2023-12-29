import { HttpClient } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { CommonModule, JsonPipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { LocalStorageService } from "src/app/core/service/storage/local-storage.service";
import { LANGUAGE_KEY } from "src/app/core/service/language/constants";
import { MyReservationsRoutingModule, routedComponents } from "./my-reservations.routing.module";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { NgbDatepickerModule, NgbDropdownModule, NgbPaginationModule, NgbTimepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { HomeModule } from "../home/home.module";
import { YachtsModule } from "../yachts/yachts.module";
import { EffectsModule } from "@ngrx/effects";
import { MyReservationsListEffect } from "./store/effects";
import { StoreModule } from "@ngrx/store";
import { MyReservationsListReducer } from "./store/reducers";
import { MyReservationRecordComponent } from "./components/my-reservation-record/my-reservation-record.component";
import { ReservationsModule } from "../reservations/reservations.module";
import { SharedModule } from "src/app/shared/shared.module";

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(
    http,
    `./assets/i18n/my-reservations/`,
    '.json',
  );
}

@NgModule({
  declarations: [
    routedComponents,
    MyReservationRecordComponent,
  ],
  imports: [
    CommonModule,
    MyReservationsRoutingModule,
    FormsModule,
    JsonPipe,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    NgbPaginationModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    SharedModule,

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
    EffectsModule.forFeature(MyReservationsListEffect.effects),
    StoreModule.forFeature(
      MyReservationsListReducer.STATE_KEY,
      MyReservationsListReducer.reducers,
    ),
  ]
})
export class MyReservationsModule {
  constructor(
    protected translate: TranslateService,
    protected localStorageService: LocalStorageService,
  ) {
    const language = this.localStorageService.get(LANGUAGE_KEY);
    const browserLang = translate.getBrowserLang();
    this.translate.setDefaultLang(language ?? browserLang ?? 'pl');
  }
 }
