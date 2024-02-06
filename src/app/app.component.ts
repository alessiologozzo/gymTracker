import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { TopbarComponent } from './components/topbar/topbar.component';
import { AuthService } from './services/auth/auth.service';
import { HttpErrorService } from './services/httpError/http-error.service';
import { ThreeSceneService } from './services/threeScene/three-scene.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, TranslateModule, TopbarComponent],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    constructor(router: Router, threeSceneService: ThreeSceneService, httpErrorService: HttpErrorService, authService: AuthService) {
        authService.init()

        router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe({
            next: event => {
                const navigationEnd = event as NavigationEnd
                if (threeSceneService.isLoaded()) {
                    if (navigationEnd.url == '/') {
                        threeSceneService.start()
                    } else {
                        threeSceneService.stop()
                    }
                }

                if (navigationEnd.url.includes('/personalArea') && httpErrorService.fatalError()) {
                    router.navigateByUrl('/error')
                }
            }
        })
    }
}
