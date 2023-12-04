import { Component } from '@angular/core';
import { LanguageService } from '../../service/language/language.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  menu = [
    {
      items: [{ text: 'page.person.catalog', path: '/persons-list' }],
    },
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
