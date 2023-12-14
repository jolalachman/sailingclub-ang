import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[clickEmitter]'
})
export class ClickEmitterDirective {
  @Output() clickEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  @HostListener('click')
  onClick(): void {
    this.clickEvent.emit(true);
  }
}
