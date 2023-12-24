import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'customDateFormat'
})
export class CustomDateFormatPipe implements PipeTransform {
  transform(value?: Date): string {
    if (!value) {
      return '';
    }

    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(value, 'dd.MM.yyyy HH:mm');
    return formattedDate || '';
  }
}
