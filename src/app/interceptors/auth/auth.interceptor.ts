import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { catchError, retry } from 'rxjs';
import { HttpErrorService } from '../../services/httpError/http-error.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const oAuthService = inject(OAuthService)
    const httpErrorService = inject(HttpErrorService)
    const router = inject(Router)
    if(oAuthService.hasValidAccessToken()) {
        req = req.clone({ setHeaders: { 'Authorization': 'Bearer ' + oAuthService.getAccessToken() } })
    }
    
    return next(req).pipe(retry(2)).pipe(catchError((err: HttpErrorResponse) => {   
        if(!err.url?.includes('realms/gymTracker/.well-known/openid-configuration') && !err.url?.includes('realms/gymTracker/protocol/openid-connect/token')) { // non voglio che faccia il redirect se non riesce a prendere la configurazione in fase di caricamento dell'app
            httpErrorService.errorOccured = true
            router.navigateByUrl("error")
        }
        return next(req)
    }))
};
