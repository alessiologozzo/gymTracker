import { ThreeSceneService } from './../threeScene/three-scene.service';
import { Injectable, signal } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authCodeFlowConfig } from '../../auth.config';
import { Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { HttpErrorService } from '../httpError/http-error.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private firstLoginSubscription!: Subscription
    private loggedIn = false
    loggedInSubject = new Subject<boolean>()
    clientId!: string
    scope!: string
    responseType!: string

    constructor(private oAuthService: OAuthService, private router: Router, private threeSceneService: ThreeSceneService, private httpErrorService: HttpErrorService) {}

    init() {
        this.oAuthService.configure(authCodeFlowConfig)
        this.oAuthService.loadDiscoveryDocumentAndTryLogin()

        // Solo la prima volta, per renderizzare in fase di registrazione o in caso di errori di configurazione
        if (!this.oAuthService.hasValidAccessToken()) {
            this.firstLoginSubscription = this.oAuthService.events.subscribe({
                next: value => {
                    if (value.type == 'discovery_document_load_error') {
                        this.httpErrorService.fatalError.set(true)
                        this.firstLoginSubscription.unsubscribe()
                    }
                    else if (value.type == 'token_received') {
                        this.router.navigateByUrl('/personalArea')
                        this.threeSceneService.stop()
                        this.firstLoginSubscription.unsubscribe()
                    }
                }
            })
        } else {
            this.oAuthService.refreshToken()
        }

        // Logica per refreshare e per verificare se si è loggati
        this.oAuthService.events.subscribe({
            next: value => {
                if (value.type == 'token_expires') {
                    this.oAuthService.refreshToken()
                } else if (value.type == 'token_received' || value.type == 'token_refreshed') {
                    this.loggedIn = true
                    this.loggedInSubject.next(true)
                }

                if (!this.oAuthService.hasValidAccessToken() || !this.oAuthService.hasValidIdToken()) {
                    this.loggedIn = false
                    this.loggedInSubject.next(false)
                }
            }
        })

        this.clientId = this.oAuthService.clientId as string
        this.scope = this.oAuthService.scope as string
        this.responseType = this.oAuthService.responseType as string
    }

    login() {
        this.oAuthService.initCodeFlow()
    }

    logout() {
        this.oAuthService.logOut()
    }

    isLoggedIn() {
        return this.loggedIn
    }
}
