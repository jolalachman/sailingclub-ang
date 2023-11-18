import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../../service/storage/local-storage.service';
import { LANGUAGE_KEY } from './constants';

type Nullable = string | null | undefined;

@Injectable()
export class LanguageService {
  readonly defaultLanguage = 'pl';
  readonly arrayLanguage = ['pl', 'en'];

  constructor(
    private translate: TranslateService,
    private localStorageService: LocalStorageService,
  ) {
    this.translate.addLangs(this.arrayLanguage);
  }

  get currentLang(): string {
    return this.translate.currentLang ?? this.defaultLanguage;
  }

  get language(): string | null {
    return this.localStorageService.get(LANGUAGE_KEY);
  }

  load(): Observable<unknown> {
    // Get saved language from local storage
    const savedLanguage = this.language;

    // Determine the language to use
    const languageToUse = this.determineLanguageToUse(savedLanguage);

    // Save the determined language
    this.saveLanguage(languageToUse);

    // Use the determined language
    return this.translate.use(languageToUse);
  }

  setLanguage(language: string) {
    // if the same language then do nothing
    if (this.language === language) {
      return;
    }

    // If language not supported then proceed to switch to default application language
    if (!this.arrayLanguage.includes(language)) {
      this.saveLanguage(this.defaultLanguage);
      return;
    }

    this.saveLanguage(language);
    window.location.reload();
  }

  private determineLanguageToUse(savedLang: Nullable): string {
    return savedLang && this.arrayLanguage.includes(savedLang)
      ? savedLang
      : this.defaultLanguage;
  }

  private saveLanguage(value: string) {
    this.localStorageService.set([{ key: LANGUAGE_KEY, value }]);
  }
}
