import { NgModule } from "@angular/core";
import { ClickEmitterDirective } from "./directives/click.directive";
import { TimeFormatPipe } from "./pipes/time-format.pipe";
import { CustomDateFormatPipe } from "./pipes/dateformat.pipe";
import { DictionaryService } from "./service/dictionary.service";

@NgModule({
  declarations: [
    ClickEmitterDirective,
    TimeFormatPipe,
    CustomDateFormatPipe,
  ],

  exports: [
    ClickEmitterDirective,
    TimeFormatPipe,
    CustomDateFormatPipe,
  ]
  })
  export class SharedModule {
  }