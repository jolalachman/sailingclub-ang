import { Injectable } from "@angular/core";
import { NgbDateParserFormatter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

@Injectable()
export class MyNgbDateParserFormatter extends NgbDateParserFormatter {
    parse(value: string | null): NgbDateStruct | null {
        if (value) {
            const dateParts = value.trim().split('-');
            if (dateParts.length === 3) {
              const day = parseInt(dateParts[0], 10);
              const month = parseInt(dateParts[1], 10);
              const year = parseInt(dateParts[2], 10);
              
              if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                return { year, month, day };
              }
            }
        }
        return null;
    }

    format(date: NgbDateStruct | null ): string {
        return date ? ''+date.day+'-'+date.month+'-'+date.year : '';
    }
}