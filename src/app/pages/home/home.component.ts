import { NgOptimizedImage } from '@angular/common';
import { Component, OnDestroy, OnInit, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ScrollFlow } from '../../classes/ScrollFlow/ScrollFlow';
import { TypeFlow } from '../../classes/TypeFlow/TypeFlow';
import { LoadingIconComponent } from '../../components/loadingIcon/loading-icon/loading-icon.component';
import { ConfigService } from '../../services/config/config.service';
import { ThreeSceneService } from '../../services/threeScene/three-scene.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [NgOptimizedImage, TranslateModule, LoadingIconComponent, RouterLink],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
    private scrollFlow!: ScrollFlow
    private typeFlow!: TypeFlow
    private changeLanguageEffect = effect(() => {
        this.configService.language()
        if (this.typeFlow) {
            this.translateService.get('autoTyped').subscribe({
                next: val => this.typeFlow.changeStringsAll(val)
            })
        }
    })
    private sceneLoadedSubscription!: Subscription
    fitnessSceneLoaded = false

    constructor(private translateService: TranslateService, private configService: ConfigService, private threeSceneService: ThreeSceneService) { }

    ngOnInit(): void {
        if (this.threeSceneService.isLoaded()) {
            this.sceneLoaded()
        } else {
            this.threeSceneService.create()
            this.sceneLoadedSubscription = this.threeSceneService.loadedSubject.subscribe({
                next: () => {
                    this.sceneLoaded()
                }
            })
        }
    }

    ngOnDestroy(): void {
        if (this.scrollFlow) {
            this.scrollFlow.destroy()
        }
        if (!this.fitnessSceneLoaded) {
            this.sceneLoadedSubscription.unsubscribe()
        }
    }

    private createAutoTypeEffect() {
        this.translateService.get('autoTyped').subscribe({
            next: (val) => {
                this.typeFlow = new TypeFlow(false)
                this.typeFlow.add('auto-typed', {
                    strings: val,
                    loop: true,
                    cursorClasses: ['text-secondary']
                })
            }
        })
    }

    sceneLoaded() {
        this.fitnessSceneLoaded = true
        this.scrollFlow = new ScrollFlow()
        this.createAutoTypeEffect()
    }
}
