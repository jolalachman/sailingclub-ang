import { CommonModule, JsonPipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { LANGUAGE_KEY } from "src/app/core/service/language/constants";
import { LocalStorageService } from "src/app/core/service/storage/local-storage.service";
import { AuthRoutingModule, routedComponents } from "./auth.routing.module";
import { NgbNavModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(
        http,
        `./assets/i18n/login/`,
        '.json',
    );
}

@NgModule({
    declarations: [
      routedComponents,
    ],
    imports: [
      CommonModule,
      AuthRoutingModule,
      JsonPipe,
      NgbNavModule,
      NgbTypeaheadModule,
      FormsModule,
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
  export class AuthModule {
    constructor(
      protected translate: TranslateService,
      protected localStorageService: LocalStorageService,
    ) {
      const language = this.localStorageService.get(LANGUAGE_KEY);
      const browserLang = translate.getBrowserLang();
      this.translate.setDefaultLang(language ?? browserLang ?? 'pl');
    }
   }