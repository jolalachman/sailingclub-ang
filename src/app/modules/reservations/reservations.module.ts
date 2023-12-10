import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { FormsModule } from '@angular/forms';
import { ReservationsComponent } from './reservations.component';
import { ReservationsRoutingModule, routedComponents } from './reservations.routing.module';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';


export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(
    http,
    `./assets/i18n/shared/`,
    '.json',
  );
}

@NgModule({
  declarations: [
    ReservationsComponent,
    routedComponents,
  ],
  imports: [
    CommonModule,
    ReservationsRoutingModule,
    FormsModule,
    JsonPipe,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),


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
export class ReservationsModule {
  constructor(
    protected translate: TranslateService,
    protected localStorageService: LocalStorageService,
  ) {
    const language = this.localStorageService.get(LANGUAGE_KEY);
    this.translate.setDefaultLang(language ?? 'pl');
  }
 }
