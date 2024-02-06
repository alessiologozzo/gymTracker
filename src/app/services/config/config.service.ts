import { Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    language = signal('')
    theme = signal('')

    constructor(private translateService: TranslateService) {
        this.useLanguage(localStorage.getItem('language') as string)
        this.useTheme(localStorage.getItem('theme') as string)
    }

    useLanguage(language: string) {
        this.language.set(language)
        localStorage.setItem('language', language)
        this.translateService.use(language)
    }

    useTheme(theme: string) {
        this.theme.set(theme)
        localStorage.setItem('theme', theme)
        document.documentElement.dataset['theme'] = theme
    }
}
