import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { IMAGE_CONFIG, IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';
import { HttpClient, HttpClientModule, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { TranslateLoader, TranslateModule, TranslateModuleConfig } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { routes } from './app.routes';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { authInterceptor } from './interceptors/auth/auth.interceptor';

export function HttpLoaderFactory(http: HttpClient) { return new TranslateHttpLoader(http, './assets/i18n/', '.json'); } //Translate stuff

const translateModuleConfig: TranslateModuleConfig = { defaultLanguage: 'en', loader: { provide: TranslateLoader, useFactory: HttpLoaderFactory, deps: [HttpClient] } }; //Translate stuff

const customImageLoader = (config: ImageLoaderConfig) => {
    let url = `${config.src}`
    if(config.width) {
        const splitted = config.src.split('.')
        url = `${splitted[0]}-${config.width}w.${splitted[1]}`
    }
    return url
}

export const appConfig: ApplicationConfig = {
    providers: [provideRouter(routes),
        {
            provide: IMAGE_CONFIG,
            useValue: {
              breakpoints: [768, 1024, 1536, 2048]
            }
          },
    {
        provide: IMAGE_LOADER,
        useValue: customImageLoader
    },
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(TranslateModule.forRoot(translateModuleConfig)),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])), provideOAuthClient()
    ]
};
