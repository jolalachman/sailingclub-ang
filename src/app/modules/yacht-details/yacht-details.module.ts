import { HttpClient } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { YachtDetailsComponent } from "./components/yacht-details.component";
import { YachtDetailsRoutingModule, routedComponents } from "./yacht-details.routing.module";
import { CommonModule, JsonPipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { LocalStorageService } from "src/app/core/service/storage/local-storage.service";
import { LANGUAGE_KEY } from "src/app/core/service/language/constants";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { NgbCollapseModule, NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { EditYachtDialogComponent } from "./dialogs/edit-yacht-dialog/edit-yacht-dialog.component";
import { DeactivateYachtDialogComponent } from "./dialogs/deactivate-yacht-dialog/deactivate-yacht-dialog.component";
import { ChangeYachtStatusDialogComponent } from "./dialogs/change-yacht-status-dialog/change-yacht-status-dialog.component";
import { AddYachtReservationDialogComponent } from "./dialogs/add-yacht-reservation-dialog/add-yacht-reservation-dialog.component";
import { HomeModule } from "../home/home.module";
import { SharedModule } from "src/app/shared/shared.module";
import { YachtStatusestDialogComponent } from "./dialogs/yacht-statuses-dialog/yacht-statuses-dialog.component";

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(
    http,
    `./assets/i18n/yachts/`,
    '.json',
  );
}

@NgModule({
  declarations: [
    YachtDetailsComponent,
    EditYachtDialogComponent,
    DeactivateYachtDialogComponent,
    ChangeYachtStatusDialogComponent,
    AddYachtReservationDialogComponent,
    YachtStatusestDialogComponent,
    routedComponents,
  ],
  imports: [
    CommonModule,
    YachtDetailsRoutingModule,
    FormsModule,
    JsonPipe,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    NgbCollapseModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
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
  ]
})
export class YachtDetailsModule {
  constructor(
    protected translate: TranslateService,
    protected localStorageService: LocalStorageService,
  ) {
    const language = this.localStorageService.get(LANGUAGE_KEY);
    const browserLang = translate.getBrowserLang();
    this.translate.setDefaultLang(language ?? browserLang ?? 'pl');
  }
 }
