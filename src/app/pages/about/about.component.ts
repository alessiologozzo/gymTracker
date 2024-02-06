import { NgOptimizedImage } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faFaceSmileBeam, faLaughSquint, faSailboat, faSmile, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MobileScroller } from '../../classes/MobileScroller/MobileScroller';
import { TypeFlow } from '../../classes/TypeFlow/TypeFlow';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { ScrollFlow } from '../../classes/ScrollFlow/ScrollFlow';

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [TranslateModule, NgOptimizedImage, FontAwesomeModule],
    templateUrl: './about.component.html',
    styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit, OnDestroy {
    counter = 0
    private typeFlow!: TypeFlow
    private mobileScroller!: MobileScroller
    private scrollFlow!: ScrollFlow
    faSmile = faSmile
    faLaughSquint = faLaughSquint
    faBoat = faSailboat
    faThumbsUp = faThumbsUp
    faFaceSmileBean = faFaceSmileBeam
    faGithub = faGithub
    faLinkedin = faLinkedin
    faEnvelope = faEnvelope
    
    constructor(private translateService: TranslateService) {
    }

    ngOnInit(): void {
        this.scrollFlow = new ScrollFlow(true, { exclude: ['three-scene-parent'] })
        this.mobileScroller = new MobileScroller()
        this.translateService.get('questions').subscribe({
            next: vals => {
                this.typeFlow = new TypeFlow(false)
                this.typeFlow.add('auto-typed', {
                    strings: vals,
                    typeSpeed: 20,
                    backSpeed: 0,
                    typeDelay: 100,
                    backDelay: 20,
                })
            }
        })
    }

    ngOnDestroy(): void {
        if(this.scrollFlow) {
            this.scrollFlow.destroy()
        }
        if(this.mobileScroller) {
            this.mobileScroller.destroy()
        }
    }
}
