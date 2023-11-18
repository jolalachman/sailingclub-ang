import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {
  get(key: string): string | null {
    return localStorage.getItem(key);
  }

  set(tokens: { key: string; value: string }[]): void {
    tokens.forEach(token => {
      localStorage.setItem(token.key, token.value);
    });
  }

  remove(keys: string[]): void {
    keys.forEach(key => {
      localStorage.removeItem(key);
    });
  }
}
