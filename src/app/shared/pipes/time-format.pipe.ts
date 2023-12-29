import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {
  transform(hour: number | null): string {
    if (hour) {
      const formattedHour = hour.toString().padStart(2, '0');
      return `${formattedHour}:00`;
    } else {
      return '-';
    }
  }
}
