import { Component, effect } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCalculator, faCircleArrowRight, faDumbbell, faHouse } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingIconComponent } from '../../../components/loadingIcon/loading-icon/loading-icon.component';
import { AuthService } from '../../../services/auth/auth.service';
import { HttpErrorService } from '../../../services/httpError/http-error.service';

@Component({
  selector: 'app-personal-area',
  standalone: true,
  imports: [FontAwesomeModule, RouterOutlet, RouterLink, LoadingIconComponent, TranslateModule],
  templateUrl: './personal-area.component.html',
  styleUrl: './personal-area.component.scss'
})
export class PersonalAreaComponent {
    faCircleArrowRight = faCircleArrowRight
    faHouse = faHouse
    faCalculator = faCalculator
    faDumbbell = faDumbbell

    private fatalErrorEffect = effect(() => {
        if(this.httpErrorService.fatalError()) {
            this.router.navigateByUrl('/error')
        }
    })

    constructor(private authService: AuthService, private httpErrorService: HttpErrorService, private router: Router) {
        if(httpErrorService.fatalError()) {
            this.router.navigateByUrl('/error')
        }
        else if(!this.authService.isLoggedIn()) {
            this.authService.login()
        }
    }
}
