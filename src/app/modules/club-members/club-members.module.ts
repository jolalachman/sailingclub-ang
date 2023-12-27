import { HttpClient } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { CommonModule, JsonPipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { LocalStorageService } from "src/app/core/service/storage/local-storage.service";
import { LANGUAGE_KEY } from "src/app/core/service/language/constants";
import { ClubMembersRoutingModule, routedComponents } from "./club-members.routing,module";
import { ClubMemberRecordComponent } from "./components/club-member-record/club-member-record.component";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { ClubMembersListReducer } from "./store/reducers";
import { ClubMembersListEffect } from "./store/effects";
import { YachtsModule } from "../yachts/yachts.module";
import { NgbDropdownModule, NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(
    http,
    `./assets/i18n/club-members/`,
    '.json',
  );
}

@NgModule({
  declarations: [
    routedComponents,
    ClubMemberRecordComponent,
  ],
  imports: [
    CommonModule,
    ClubMembersRoutingModule,
    FormsModule,
    JsonPipe,
    ReactiveFormsModule,
    YachtsModule,
    NgbPaginationModule,
    NgbDropdownModule,

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
    EffectsModule.forFeature(ClubMembersListEffect.effects),
    StoreModule.forFeature(
      ClubMembersListReducer.STATE_KEY,
      ClubMembersListReducer.reducers,
    ),
  ]
})
export class ClubMembersModule {
  constructor(
    protected translate: TranslateService,
    protected localStorageService: LocalStorageService,
  ) {
    const language = this.localStorageService.get(LANGUAGE_KEY);
    const browserLang = translate.getBrowserLang();
    this.translate.setDefaultLang(language ?? browserLang ?? 'pl');
  }
 }
