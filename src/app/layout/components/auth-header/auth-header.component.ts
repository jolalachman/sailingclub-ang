import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from 'src/app/core/service/language/language.service';


@Component({
  selector: 'app-auth-header',
  templateUrl: './auth-header.component.html',
  styleUrls: ['./auth-header.component.scss'],
})
export class AuthHeaderComponent {

  arrayOptions = [
    { text: 'Search yacht', path: '/home', icon: 'bi-search' },
    { text: 'Yachts', path: '/yachts', icon: 'bi-life-preserver' },
  ];

  arrayLanguage = this.languageService.arrayLanguage;

  constructor(
    public languageService: LanguageService,
    ) {}

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
