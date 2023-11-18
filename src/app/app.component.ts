import { Component, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-root',
  template: ` <app-header></app-header>
  <router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {
  constructor(private renderer: Renderer2) {}
  
  ngOnInit(): void {
    if (window.top !== window.self) {
      this.renderer.setProperty(window.top, 'location', window.self.location);
    }
  }
}
