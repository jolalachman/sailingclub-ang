import { HttpClient } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { CommonModule, JsonPipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { LocalStorageService } from "src/app/core/service/storage/local-storage.service";
import { LANGUAGE_KEY } from "src/app/core/service/language/constants";
import { NoticeDetailsRoutingModule, routedComponents } from "./notice-details.routing.module";
import { ReservationsModule } from "../reservations/reservations.module";
import { EditNoticeDialogComponent } from "./dialogs/edit-notice-dialog/edit-notice-dialog.component";
import { ChangeNoticeStatusDialogComponent } from "./dialogs/change-notice-status-dialog/change-notice-status-dialog.component";
import { SharedModule } from "src/app/shared/shared.module";

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
    EditNoticeDialogComponent,
    ChangeNoticeStatusDialogComponent,
  ],
  imports: [
    CommonModule,
    NoticeDetailsRoutingModule,
    FormsModule,
    JsonPipe,
    ReactiveFormsModule,
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
export class NoticeDetailsModule {
  constructor(
    protected translate: TranslateService,
    protected localStorageService: LocalStorageService,
  ) {
    const language = this.localStorageService.get(LANGUAGE_KEY);
    const browserLang = translate.getBrowserLang();
    this.translate.setDefaultLang(language ?? browserLang ?? 'pl');
  }
 }
