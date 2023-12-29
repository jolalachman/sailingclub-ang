import { HttpClient } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { CommonModule, JsonPipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { LocalStorageService } from "src/app/core/service/storage/local-storage.service";
import { LANGUAGE_KEY } from "src/app/core/service/language/constants";
import { UsersRoutingModule, routedComponents } from "./users.routing.module";
import { EffectsModule } from "@ngrx/effects";
import { UsersListEffect } from "./store/effects";
import { StoreModule } from "@ngrx/store";
import { UsersListReducer } from "./store/reducers";
import { UserRecordComponent } from "./components/user-record/user-record.component";
import { NgbDropdownModule, NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";
import { AddUserDialogComponent } from "./dialogs/add-user-dialog/add-user-dialog.component";
import { SharedModule } from "src/app/shared/shared.module";

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
    UserRecordComponent,
    AddUserDialogComponent,
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    FormsModule,
    JsonPipe,
    NgbPaginationModule,
    NgbDropdownModule,
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

      //ng store
      EffectsModule.forFeature(UsersListEffect.effects),
      StoreModule.forFeature(
        UsersListReducer.STATE_KEY,
        UsersListReducer.reducers,
      ),
  ]
})
export class UsersModule {
  constructor(
    protected translate: TranslateService,
    protected localStorageService: LocalStorageService,
  ) {
    const language = this.localStorageService.get(LANGUAGE_KEY);
    const browserLang = translate.getBrowserLang();
    this.translate.setDefaultLang(language ?? browserLang ?? 'pl');
  }
 }
