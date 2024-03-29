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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { YachtsRoutingModule, routedComponents } from './yachts.routing.module';
import { YachtsComponent } from './components/yachts/yachts.component';
import { YachtRecordComponent } from './components/yacht-record/yacht-record.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { YachtsListReducer } from './store/reducers';
import { YachtsListEffect } from './store/effects';
import { NgbActiveModal, NgbDatepickerModule, NgbDropdownModule, NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { AddYachtDialogComponent } from './dialogs/add-yacht-dialog/add-yacht-dialog.component';
import { HomeModule } from '../home/home.module';
import { SharedModule } from 'src/app/shared/shared.module';


export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(
    http,
    `./assets/i18n/yachts/`,
    '.json',
  );
}

@NgModule({
  declarations: [
    YachtsComponent,
    YachtRecordComponent,
    AddYachtDialogComponent,
    routedComponents
  ],
  imports: [
    CommonModule,
    YachtsRoutingModule,
    FormsModule,
    JsonPipe,
    NgbPaginationModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
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
    EffectsModule.forFeature(YachtsListEffect.effects),
    StoreModule.forFeature(
      YachtsListReducer.STATE_KEY,
      YachtsListReducer.reducers,
    ),
  ]
})
export class YachtsModule {
  constructor(
    protected translate: TranslateService,
    protected localStorageService: LocalStorageService,
  ) {
    const language = this.localStorageService.get(LANGUAGE_KEY);
    const browserLang = translate.getBrowserLang();
    this.translate.setDefaultLang(language ?? browserLang ?? 'pl');
  }
 }
