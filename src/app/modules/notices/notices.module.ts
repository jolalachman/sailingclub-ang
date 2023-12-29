import { HttpClient } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { CommonModule, JsonPipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { LocalStorageService } from "src/app/core/service/storage/local-storage.service";
import { LANGUAGE_KEY } from "src/app/core/service/language/constants";
import { NoticesRoutingModule, routedComponents } from "./notices.routing.module";
import { EffectsModule } from "@ngrx/effects";
import { ReportedNoticesListEffect } from "./store/effects";
import { StoreModule } from "@ngrx/store";
import { ReportedNoticesListReducer } from "./store/reducers";
import { YachtsModule } from "../yachts/yachts.module";
import { NgbDatepickerModule, NgbDropdownModule, NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";
import { NoticeRecordComponent } from "./components/notice-record/notice-record.component";
import { ReservationsComponent } from "../reservations/components/reservations/reservations.component";
import { ReservationsModule } from "../reservations/reservations.module";

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(
    http,
    `./assets/i18n/notices/`,
    '.json',
  );
}

@NgModule({
  declarations: [
    routedComponents,
    NoticeRecordComponent,
  ],
  imports: [
    CommonModule,
    NoticesRoutingModule,
    FormsModule,
    JsonPipe,
    ReactiveFormsModule,
    YachtsModule,
    NgbPaginationModule,
    NgbDropdownModule,
    ReservationsModule,
    NgbDatepickerModule,

    // translation module
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      isolate: true,
    }),

    EffectsModule.forFeature(ReportedNoticesListEffect.effects),
    StoreModule.forFeature(
      ReportedNoticesListReducer.STATE_KEY,
      ReportedNoticesListReducer.reducers,
    ),
  ]
})
export class NoticesModule {
  constructor(
    protected translate: TranslateService,
    protected localStorageService: LocalStorageService,
  ) {
    const language = this.localStorageService.get(LANGUAGE_KEY);
    const browserLang = translate.getBrowserLang();
    this.translate.setDefaultLang(language ?? browserLang ?? 'pl');
  }
 }
