import { HttpClient } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { CommonModule, JsonPipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { LocalStorageService } from "src/app/core/service/storage/local-storage.service";
import { LANGUAGE_KEY } from "src/app/core/service/language/constants";
import { UserDetailsRoutingModule, routedComponents } from "./user-details.routing.module";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { NgbCollapseModule, NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { DeactivateUsertDialogComponent } from "./dialogs/deactivate-user-dialog/deactivate-user-dialog.component";
import { EditUserDialogComponent } from "./dialogs/edit-user-dialog/edit-user-dialog.component";

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(
    http,
    `./assets/i18n/users/`,
    '.json',
  );
}

@NgModule({
  declarations: [
    routedComponents,
    DeactivateUsertDialogComponent,
    EditUserDialogComponent,
  ],
  imports: [
    CommonModule,
    UserDetailsRoutingModule,
    NgbCollapseModule,
    FormsModule,
    JsonPipe,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    ReactiveFormsModule,
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
  ]
})
export class UserDetailsModule {
  constructor(
    protected translate: TranslateService,
    protected localStorageService: LocalStorageService,
  ) {
    const language = this.localStorageService.get(LANGUAGE_KEY);
    const browserLang = translate.getBrowserLang();
    this.translate.setDefaultLang(language ?? browserLang ?? 'pl');
  }
 }
