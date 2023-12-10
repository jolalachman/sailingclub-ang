import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { NgModule, Optional, SkipSelf } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { LanguageService } from "./service/language/language.service";
import { LocalStorageService } from "./service/storage/local-storage.service";
import { WithCredentialsInterceptor, WithCredentialsInterceptorProvider } from "./interceptors/with-credentials.interceptor";
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
      CommonModule,
      HttpClientModule,
      RouterModule,
      TranslateModule,
      NgbDropdownModule,
    ],
    providers: [
      LanguageService,
      LocalStorageService,
      WithCredentialsInterceptorProvider,
    ],
  })
  export class CoreModule {
    constructor(
      @Optional()
      @SkipSelf()
      parentModule: CoreModule,
    ) {
      if (parentModule) {
        throw new Error('CoreModule is already loaded. Import only in AppModule');
      }
    }
  }