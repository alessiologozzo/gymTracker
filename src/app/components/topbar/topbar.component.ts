import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faCheck, faPalette } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import pkceChallenge from "pkce-challenge";
import { AuthService } from '../../services/auth/auth.service';
import { ConfigService } from '../../services/config/config.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [NgOptimizedImage, FontAwesomeModule, TranslateModule, RouterModule],
    templateUrl: './topbar.component.html',
    styleUrl: './topbar.component.scss'
})
export class TopbarComponent {
    faBars = faBars
    faPalette = faPalette
    faCheck = faCheck
    themes = ['light', 'garden', 'retro', 'dark', 'dracula', 'coffee']
    languages = [{ 'name': 'en', 'fullName': 'english' }, { 'name': 'it', 'fullName': 'italiano' }]
    loggedIn: boolean

    constructor(public configService: ConfigService, private authService: AuthService) {
        this.loggedIn = authService.isLoggedIn()
        authService.loggedInSubject.subscribe({
            next: val => this.loggedIn = val
        })
    }

    themeMatch(theme: string): boolean {
        return theme == this.configService.theme()
    }

    languageMatch(language: string): boolean {
        return language == this.configService.language()
    }

    chooseLogo(theme: string): string {
        let logo = 'assets/images/logo/'
        if (theme == 'light' || theme == 'garden' || theme == 'retro') {
            logo += 'logo-black.png'
        } else {
            logo += 'logo-white.png'
        }

        return logo
    }

    login() {
        this.authService.login()
    }

    logout() {
        this.authService.logout()
    }

    async register() {
        const codes = await pkceChallenge()

        const form = document.createElement('form')
        form.method = 'get'
        form.action = 'http://localhost:7080/realms/gymTracker/protocol/openid-connect/registrations'
        const clientIdElement = this.createParamElement('client_id', this.authService.clientId as string)
        const scopeElement = this.createParamElement('scope', this.authService.scope as string)
        const redirectUriElement = this.createParamElement('redirect_uri', 'http://localhost:4200/registrationRedirect')
        const responseTypeElement = this.createParamElement('response_type', this.authService.responseType as string)
        const codeChallengeMethodElement = this.createParamElement('code_challenge_method', 'S256')
        const codeChallengeElement = this.createParamElement('code_challenge', codes.code_challenge)

        form.appendChild(clientIdElement)
        form.appendChild(scopeElement)
        form.appendChild(redirectUriElement)
        form.appendChild(responseTypeElement)
        form.appendChild(codeChallengeMethodElement)
        form.appendChild(codeChallengeElement)

        document.body.appendChild(form)
        form.submit()
    }

    private createParamElement(name: string, value: string) {
        const paramElement = document.createElement('input')
        paramElement.type = 'hidden'
        paramElement.name = name
        paramElement.value = value

        return paramElement
    }
}
