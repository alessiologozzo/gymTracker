import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class FrameRateLimiterService {
    private readonly FPS = 60
    private oldTime: number

    constructor() {
        this.oldTime = new Date().getTime()
    }

    needToRender(): boolean {
        let result: boolean
        const currentTime = new Date().getTime()
        const deltaTime = 1000 / this.FPS
        if (currentTime - this.oldTime > deltaTime) {
            result = true
            this.oldTime = currentTime
        } else {
            result = false
        }

        return result
    }
}
