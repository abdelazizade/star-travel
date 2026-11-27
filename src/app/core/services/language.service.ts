import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLangSubject = new BehaviorSubject<string>('en');
  public currentLang$ = this.currentLangSubject.asObservable();

  constructor(
    private translate: TranslateService,
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Don't set language in constructor - wait for translations to load
    // Language will be set from AppComponent after translations are loaded
  }

  private getStoredLanguage(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('language');
    }
    return null;
  }

  private setStoredLanguage(lang: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('language', lang);
    }
  }

  setLanguage(lang: string): void {
    this.currentLangSubject.next(lang);
    this.setStoredLanguage(lang);

    // Set lang/dir on <html> (works on the server too, so prerendered HTML is correct)
    this.document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    this.document.documentElement.setAttribute('lang', lang);

    // Update SEO title/description once the translations for this language are loaded
    this.translate.use(lang).subscribe(() => this.updateSeoTags());
  }

  private updateSeoTags(): void {
    const title = this.translate.instant('seo.title');
    const description = this.translate.instant('seo.description');

    if (title && title !== 'seo.title') {
      this.title.setTitle(title);
      this.meta.updateTag({ property: 'og:title', content: title });
      this.meta.updateTag({ name: 'twitter:title', content: title });
    }
    if (description && description !== 'seo.description') {
      this.meta.updateTag({ name: 'description', content: description });
      this.meta.updateTag({ property: 'og:description', content: description });
      this.meta.updateTag({ name: 'twitter:description', content: description });
    }
  }

  getCurrentLanguage(): string {
    return this.currentLangSubject.value;
  }

  isRTL(): boolean {
    return this.getCurrentLanguage() === 'ar';
  }
}

