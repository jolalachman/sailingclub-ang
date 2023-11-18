import { Component } from '@angular/core';
import { LanguageService } from '../../service/language/language.service';

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

  constructor(public languageService: LanguageService) {}

  get currentLang(): string {
    return this.languageService.currentLang;
  }

  changeLanguage(language: string): void {
    if (!language) {
      return;
    }

    this.languageService.setLanguage(language);
  }
}
