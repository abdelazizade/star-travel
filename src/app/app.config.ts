import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { TranslateLoader, provideTranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { BrowserTranslateLoader } from './core/services/translate-loader.service';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(),

    // 🔥 MAIN TRANSLATE PROVIDER
    ...provideTranslateService({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => {
          return new BrowserTranslateLoader(http, '/assets/i18n/', '.json');
        },
        deps: [HttpClient]
      }
    })
  ]
};

