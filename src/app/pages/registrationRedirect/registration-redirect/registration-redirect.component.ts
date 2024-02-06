import { Component } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
    selector: 'app-registration-redirect',
    standalone: true,
    imports: [],
    templateUrl: './registration-redirect.component.html',
    styleUrl: './registration-redirect.component.scss'
})
export class RegistrationRedirectComponent {
    constructor(oAuthService: OAuthService) {
        oAuthService.initCodeFlow()
    }
}
