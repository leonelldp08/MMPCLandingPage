import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { SkyBluePreset } from './primeng-theme';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import { LoaderService } from '../services/loader/loader';
import { AppConfigService } from '../services/config/config';
import { Toast } from '../services/toast/toast';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { ErrorInterceptor } from '../services/error-interceptor/error-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    providePrimeNG({
      theme: {
        preset: SkyBluePreset,
        options: {
          darkModeSelector: false || 'none',
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng',
          },
        },
      },
      ripple: true,
    }),
    provideAppInitializer(() => {
      const initializerFn = configFactory(inject(AppConfigService));
      return initializerFn();
    }),
    AppConfigService,
    LoaderService,
    Toast,
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
      { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ]
};

export const configFactory = (config: AppConfigService) => () => {
  return config.initialize();
};

