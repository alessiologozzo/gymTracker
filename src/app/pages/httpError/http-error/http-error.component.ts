import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HttpErrorService } from '../../../services/httpError/http-error.service';

@Component({
  selector: 'app-http-error',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './http-error.component.html',
  styleUrl: './http-error.component.scss'
})
export class HttpErrorComponent {
    constructor(private httpErrorService: HttpErrorService) {
        httpErrorService.errorOccured = false
    }

}
