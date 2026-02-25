import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRouting } from '@angular/ssr';
import { TranslateLoader, provideTranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

// Server-only loader - inline to avoid bundling issues
class ServerTranslateLoader implements TranslateLoader {
  constructor(
    private prefix: string = '/assets/i18n/',
    private suffix: string = '.json'
  ) {}

  getTranslation(lang: string): Observable<any> {
    try {
      // Dynamically require Node.js modules only when this method is called
      const fs = require('fs');
      const path = require('path');

      // During build/prerender, the assets are in dist/browser/assets
      const cwd = process.cwd();
      const possiblePaths = [
        path.join(cwd, 'dist', 'startravel', 'browser', 'assets', 'i18n', `${lang}${this.suffix}`),
        path.join(cwd, 'dist', 'hamditour', 'browser', 'assets', 'i18n', `${lang}${this.suffix}`),
        path.join(cwd, 'browser', 'assets', 'i18n', `${lang}${this.suffix}`),
        path.join(cwd, 'src', 'assets', 'i18n', `${lang}${this.suffix}`)
      ];

      for (const filePath of possiblePaths) {
        try {
          const translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          return of(translations);
        } catch (e) {
          continue;
        }
      }
      
      console.warn(`Could not find translation file for ${lang}`);
      return of({});
    } catch (error) {
      console.error(`Error loading translation file for ${lang}:`, error);
      return of({});
    }
  }
}

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideServerRouting(serverRoutes),
    // Override the loader for server-side rendering
    ...provideTranslateService({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: () => {
          return new ServerTranslateLoader('/assets/i18n/', '.json');
        },
        deps: []
      }
    })
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
