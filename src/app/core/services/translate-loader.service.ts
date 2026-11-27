import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const TRANSLATIONS_VERSION = '2026-11-27';

export class BrowserTranslateLoader implements TranslateLoader {
  constructor(
    private http: HttpClient,
    private prefix: string = '/assets/i18n/',
    private suffix: string = '.json'
  ) {}

  getTranslation(lang: string): Observable<any> {
    // Bump TRANSLATIONS_VERSION whenever the i18n JSON files change so browsers don't use stale cached copies
    return this.http.get(`${this.prefix}${lang}${this.suffix}?v=${TRANSLATIONS_VERSION}`).pipe(
      catchError(() => {
        // Return empty object on error
        return of({});
      })
    );
  }
}

