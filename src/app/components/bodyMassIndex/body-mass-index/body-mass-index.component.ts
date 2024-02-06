import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, computed, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLocationPin } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { UserBodyStats } from '../../../interfaces/UserBodyStats';
import { Observable } from 'rxjs';
import { HttpErrorService } from '../../../services/httpError/http-error.service';
import { LoadingIconComponent } from '../../loadingIcon/loading-icon/loading-icon.component';

@Component({
    selector: 'app-body-mass-index',
    standalone: true,
    imports: [FormsModule, TranslateModule, FontAwesomeModule, LoadingIconComponent],
    templateUrl: './body-mass-index.component.html',
    styleUrl: './body-mass-index.component.scss'
})
export class BodyMassIndexComponent {
    weight = signal<number>(65)
    height = signal<number>(170)
    oldWeight: number = this.weight()
    oldHeight: number = this.height()
    bmi = computed<number>(() => Number((this.weight() / Math.pow(this.height() / 100, 2)).toFixed(2)))
    effect = effect(() => {
        if (Number.isFinite(this.weight()) && this.weight() >= this.MIN_WEIGHT && this.weight() <= this.MAX_WEIGHT) {
            this.oldWeight = this.weight()
        } else {
            this.weight.set(this.oldWeight)
            this.changeInputValue('weight-element', this.weight())
        }

        if (Number.isFinite(this.height()) && this.height() >= this.MIN_HEIGHT && this.height() <= this.MAX_HEIGHT) {
            this.oldHeight = this.height()
        } else {
            this.height.set(this.oldHeight)
            this.changeInputValue('height-element', this.height())
        }

    }, { allowSignalWrites: true })
    readonly MIN_WEIGHT: number = 1
    readonly MIN_HEIGHT: number = 1
    readonly MAX_WEIGHT: number = 300
    readonly MAX_HEIGHT: number = 250
    readonly STEP: number = 0.5
    readonly faLocationPin = faLocationPin
    private readonly GATEWAY_URL = 'http://localhost:8080'
    dataLoaded = false

    constructor(private httpClient: HttpClient, private router: Router, private httpErrorService: HttpErrorService) {
        this.getUserBodyStats()
    }

    private changeInputValue(id: string, value: number) {
        const element = document.getElementById(id) as HTMLInputElement
        element.value = value.toString()
    }

    saveData() {
        const body = { 'weight': this.weight(), 'height': this.height() }

        this.httpClient.post('http://localhost:8080/mass/user', body).subscribe({
            next: () => {
                const toast = document.getElementById('bmi-toast')
                toast?.classList.remove('toast-fade')
                setTimeout(() => {
                    toast?.classList.add('toast-fade')
                }, 100)
            }
        })
    }

    private getUserBodyStats() {
        (this.httpClient.get(this.GATEWAY_URL + '/mass/user') as Observable<UserBodyStats>).subscribe({
            next: data => {
                if (data) {
                    this.weight.set(data.weight)
                    this.height.set(data.height)
                }
                this.dataLoaded = true
            },
            error: err => {
                this.httpErrorService.errorOccured = true
                this.router.navigateByUrl('/error')
            }
        })
    }
}
