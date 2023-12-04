import { Component } from '@angular/core';
import { LanguageService } from '../../service/language/language.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  arrayOptions = [
    { text: 'Yachts', path: '/yachts', icon: 'bi-life-preserver' },
    { text: 'Bookings', path: '/bookings', icon: 'bi-book' }, 
    { text: 'Club members', path: '/club-members', icon: 'bi-people' }, 
    { text: 'Reported notices', path: '/notices', icon: 'bi-exclamation-circle' }, 
  ];

  arrayLanguage = this.languageService.arrayLanguage;
  isLoggedIn = false;

  constructor(public languageService: LanguageService, private router: Router) {}

  get currentLang(): string {
    return this.languageService.currentLang;
  }

  logout() {
    this.isLoggedIn=false;
  }

  changeLanguage(language: string): void {
    if (!language) {
      return;
    }

    this.languageService.setLanguage(language);
  }
}
