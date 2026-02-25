import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { LanguageService } from './core/services/language.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'startravel';

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Configure translations
    this.translate.addLangs(['en', 'fr', 'ar']);
    this.translate.setDefaultLang('en');
  }

  private getStoredLanguage(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('language');
    }
    return null;
  }

  ngOnInit(): void {
    // Set language - translate.use() will automatically load translations
    const savedLang = this.getStoredLanguage() || 'en';
    this.translate.use(savedLang).subscribe({
      next: () => {
        // Translations loaded successfully
        this.languageService.setLanguage(savedLang);
      },
      error: () => {
        // If translation fails, use default
        this.translate.use('en').subscribe(() => {
          this.languageService.setLanguage('en');
        });
      }
    });
  }
}
