import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from 'src/app/core/service/language/language.service';
import { LoginService } from 'src/app/core/service/login/login.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  arrayLanguage = this.languageService.arrayLanguage;
  isLoggedIn = this.loginService.isLoggedIn;
  userInfo$ = this.loginService.userInfo.asObservable();
  role = this.loginService.userInformation?.role ?? '';

  arrayOptions = [
    { show: true, text: 'Search yacht', path: '/home', icon: 'bi-search' },
    { show: true, text: 'Yachts', path: '/yachts', icon: 'bi-life-preserver' },
    { show: (this.role === 'SAILOR' || this.role === 'MAT' || this.role === 'BOSMAN' || this.role === 'ADMIN') , text: 'All reservations', path: '/reservations', icon: 'bi-book' }, 
    { show: (this.role === 'BOSMAN'), text: 'Club members', path: '/club-members', icon: 'bi-people' },
    { show: (this.role === 'ADMIN'), text: 'All users', path: '/users', icon: 'bi-people' },
    { show: (this.role === 'BOSMAN' || this.role === 'ADMIN'), text: 'Reported notices', path: '/notices', icon: 'bi-exclamation-circle' }, 
  ];

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
    void this.router.navigate(['/']).finally(() => window.location.reload());
  }

  changeLanguage(language: string): void {
    if (!language) {
      return;
    }

    this.languageService.setLanguage(language);
  }

  createUserInitials(firstName: string, lastName: string) {
    return firstName.charAt(0) + '' + (lastName.charAt(0) === '-' ? '' : lastName.charAt(0));
  }
}
