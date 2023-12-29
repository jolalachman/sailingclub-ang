import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import {
  HomeRoutingModule,
  routedComponents,
} from './home.routing.module';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from 'src/app/core/service/storage/local-storage.service';
import { LANGUAGE_KEY } from 'src/app/core/service/language/constants';
import { JsonPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule, NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';


export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(
    http,
    `./assets/i18n/shared/`,
    '.json',
  );
}

@NgModule({
  declarations: [
    HomeComponent,
    routedComponents
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    NgbDatepickerModule, 
    NgbAlertModule, 
    FormsModule,
    JsonPipe,
    NgbTimepickerModule,
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
export class HomeModule {
  constructor(
    protected translate: TranslateService,
    protected localStorageService: LocalStorageService,
  ) {
    const language = this.localStorageService.get(LANGUAGE_KEY);
    const browserLang = translate.getBrowserLang();
    this.translate.setDefaultLang(language ?? browserLang ?? 'pl');
  }
 }
