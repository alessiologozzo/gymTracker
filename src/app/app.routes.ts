import { Routes } from '@angular/router';
import { BodyMassIndexComponent } from './components/bodyMassIndex/body-mass-index/body-mass-index.component';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { httpErrorGuard } from './guards/HttpErrorGuard';
import { AboutComponent } from './pages/about/about.component';
import { HomeComponent } from './pages/home/home.component';
import { HttpErrorComponent } from './pages/httpError/http-error/http-error.component';
import { PersonalAreaComponent } from './pages/personalArea/personal-area/personal-area.component';
import { RegistrationRedirectComponent } from './pages/registrationRedirect/registration-redirect/registration-redirect.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'registrationRedirect', component: RegistrationRedirectComponent },
    { path: 'personalArea', component: PersonalAreaComponent, children: [
        { path: '', component: DashboardComponent },
        { path: 'bodyMassIndex', component: BodyMassIndexComponent },
    ] },
    { path: 'error', component: HttpErrorComponent, canActivate: [httpErrorGuard] }
];
