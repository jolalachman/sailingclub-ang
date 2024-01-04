import { HttpClient } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { CommonModule, JsonPipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { LocalStorageService } from "src/app/core/service/storage/local-storage.service";
import { LANGUAGE_KEY } from "src/app/core/service/language/constants";
import { ReservationDetailsComponent } from "./components/reservation-details/reservation-details.component";
import { ReservationDetailsRoutingModule, routedComponents } from "./reservation-details.routing.module";
import { SharedModule } from "src/app/shared/shared.module";
import { ReservationStatusesDialogComponent } from "./dialogs/reservation-statuses-dialog/reservation-statuses-dialog.component";
import { ReportNoticeDialogComponent } from "./dialogs/report-notice-dialog/report-notice-dialog.component";

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(
    http,
    `./assets/i18n/reservations/`,
    '.json',
  );
}

@NgModule({
  declarations: [
    ReservationDetailsComponent,
    routedComponents,
    ReservationStatusesDialogComponent,
    ReportNoticeDialogComponent,
  ],
  imports: [
    CommonModule,
    ReservationDetailsRoutingModule,
    FormsModule,
    JsonPipe,
    SharedModule,
    ReactiveFormsModule,

    // translation module
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      isolate: true,
    }),
  ]
})
export class ReservationDetailsModule {
  constructor(
    protected translate: TranslateService,
    protected localStorageService: LocalStorageService,
  ) {
    const language = this.localStorageService.get(LANGUAGE_KEY);
    const browserLang = translate.getBrowserLang();
    this.translate.setDefaultLang(language ?? browserLang ?? 'pl');
  }
 }
