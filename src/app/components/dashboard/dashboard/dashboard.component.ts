import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { UserInfo } from '../../../interfaces/UserInfo';
import { HttpErrorService } from '../../../services/httpError/http-error.service';
import { Router } from '@angular/router';
import { LoadingIconComponent } from '../../loadingIcon/loading-icon/loading-icon.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TranslateModule, LoadingIconComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
    userInfo!: UserInfo
    dataLoaded = false
    
    constructor(private httpClient: HttpClient, private httpErrorService: HttpErrorService, private router: Router) {
        this.getUserInfo()
    }

    private getUserInfo() {
        this.httpClient.get('http://localhost:7080/realms/gymTracker/protocol/openid-connect/userinfo').subscribe({
            next: (data: any) => {
                this.userInfo = {
                    subject: data.sub,
                    username: data.preferred_username as string,
                    email: data.email as string,
                    fullName: data.name,
                    firstName: data.given_name,
                    lastName: data.family_name
                }
                this.dataLoaded = true
            }
        })
        
    }
}
