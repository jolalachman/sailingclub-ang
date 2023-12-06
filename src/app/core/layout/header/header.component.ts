import { Component } from '@angular/core';
import { LanguageService } from '../../service/language/language.service';
import { Router } from '@angular/router';
import { LoginService } from '../../service/login/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  arrayOptions = [
    { text: 'Yachts', path: '/yachts', icon: 'bi-life-preserver' },
    { text: 'All bookings', path: '/all-bookings', icon: 'bi-book' }, 
    { text: 'Club members', path: '/club-members', icon: 'bi-people' }, 
    { text: 'Reported notices', path: '/notices', icon: 'bi-exclamation-circle' }, 
  ];

  arrayLanguage = this.languageService.arrayLanguage;
  isLoggedIn = this.loginService.isLoggedIn;

  constructor(
    public languageService: LanguageService,
    private loginService: LoginService,
    private router: Router,
    ) {}

  get currentLang(): string {
    return this.languageService.currentLang;
  }

  logout() {
    this.loginService.signOut();
    void this.router.navigate(['/']);
  }

  changeLanguage(language: string): void {
    if (!language) {
      return;
    }

    this.languageService.setLanguage(language);
  }
}
