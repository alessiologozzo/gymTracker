import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class HttpErrorService {
    errorOccured: boolean = false
    fatalError = signal(false)
}
