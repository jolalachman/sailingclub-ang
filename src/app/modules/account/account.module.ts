import { CommonModule, JsonPipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { LANGUAGE_KEY } from "src/app/core/service/language/constants";
import { LocalStorageService } from "src/app/core/service/storage/local-storage.service";
import { AccountRoutingModule, routedComponents } from "./account.routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbToastModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "src/app/shared/shared.module";

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(
        http,
        `./assets/i18n/account/`,
        '.json',
    );
}

@NgModule({
    declarations: [
      routedComponents,
    ],
    imports: [
      CommonModule,
      AccountRoutingModule,
      JsonPipe,
      NgbToastModule,
      FormsModule,
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
  export class AccountModule {
    constructor(
      protected translate: TranslateService,
      protected localStorageService: LocalStorageService,
    ) {
      const language = this.localStorageService.get(LANGUAGE_KEY);
      const browserLang = translate.getBrowserLang();
      this.translate.setDefaultLang(language ?? browserLang ?? 'pl');
    }
   }