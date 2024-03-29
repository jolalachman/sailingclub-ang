import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LanguageService } from './core/service/language/language.service';
import { StoreModule } from '@ngrx/store';
import { LayoutModule } from './layout/layout.module';
import { HomeModule } from './modules/home/home.module';
import { EffectsModule } from '@ngrx/effects';
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';

export function InitializeAppLanguage(appLanguage: LanguageService) {
  return () => appLanguage.load();
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/shared/', '.json');
}

registerLocaleData(localePl);

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    CoreModule,
    LayoutModule,
    HomeModule,
    HttpClientModule,

    // translation module
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
      isolate: false,
    }),

    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot([]),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: InitializeAppLanguage,
      deps: [LanguageService],
      multi: true,
    },
    {
      provide: LOCALE_ID,
      deps: [LanguageService],
      useFactory: (languageService: LanguageService) => languageService.currentLang
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
