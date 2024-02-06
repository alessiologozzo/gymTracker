import { CustomTransition } from "./transitions/CustomTransition"
import { FadeLeftTransition } from "./transitions/FadeLeftTransition"
import { FadeRightTransition } from "./transitions/FadeRightTransition"
import { FadeTransition } from "./transitions/FadeTransition"
import { FadeVerticalTransition } from "./transitions/FadeVerticalTransition"
import { Transition } from "./transitions/Transition"

export class TransitionUtils {
    static THRESOLD_DEFAULT = 0.25
    static ROOT_DEFAULT = null
    static ROOT_MARGIN_DEFAULT = '0px'
    static DURATION_DEFAULT = 1500
    static TIMING_DEFAULT = 'linear'
    static ONCE_DEFAULT = false
    static FACTOR_DEFAULT = null
    static DURATION_DEFAULT_X = [1500, 750, 1500, 1500]
    static TIMING_DEFAULT_X = ['linear', 'ease-out', 'linear', 'ease-in']

    static assessTransition(element: HTMLElement, inNames: string[], outNames: string[], outUpNames: string[], outDownNames: string[], factor: number | null, durations: number[] | 'default', timings: string[] | 'default') {
        const transitionName = element.getAttribute('sf-transition')
        let transition: Transition | null
        let durationsParam: number[]
        let timingsParam: string[]
        switch (transitionName) {
            case 'custom':
                transition = new CustomTransition(inNames, outNames, outUpNames, outDownNames)
                break

            case 'fade':
                if (factor) {
                    transition = new FadeTransition(this.DURATION_DEFAULT * factor, this.TIMING_DEFAULT)
                } else {
                    durationsParam = durations == 'default' ? [this.DURATION_DEFAULT] : [durations[0]]
                    timingsParam = timings == 'default' ? [this.TIMING_DEFAULT] : [timings[0]]
                    transition = new FadeTransition(durationsParam[0], timingsParam[0])
                }
                break

            case 'fade-left':
                if (factor) {
                    const refactoredDurations = this.DURATION_DEFAULT_X.map(d => d * factor)
                    transition = new FadeLeftTransition(refactoredDurations, this.TIMING_DEFAULT_X)
                } else {
                    durationsParam = durations == 'default' ? this.DURATION_DEFAULT_X : durations
                    while (durationsParam.length < 4) {
                        durationsParam.push(durationsParam[0])
                    }
                    timingsParam = timings == 'default' ? this.TIMING_DEFAULT_X : timings
                    while (timingsParam.length < 4) {
                        timingsParam.push(timingsParam[0])
                    }
                    transition = new FadeLeftTransition(durationsParam, timingsParam)
                }
                break

            case 'fade-right':
                if (factor) {
                    const refactoredDurations = this.DURATION_DEFAULT_X.map(d => d * factor)
                    transition = new FadeRightTransition(refactoredDurations, this.TIMING_DEFAULT_X)
                } else {
                    durationsParam = durations == 'default' ? this.DURATION_DEFAULT_X : durations
                    while (durationsParam.length < 4) {
                        durationsParam.push(durationsParam[0])
                    }
                    timingsParam = timings == 'default' ? this.TIMING_DEFAULT_X : timings
                    while (timingsParam.length < 4) {
                        timingsParam.push(timingsParam[0])
                    }
                    transition = new FadeRightTransition(durationsParam, timingsParam)
                }
                break
            
            case 'fade-vertical':
                if (factor) {
                    const refactoredDurations = this.DURATION_DEFAULT_X.map(d => d * factor)
                    transition = new FadeVerticalTransition(refactoredDurations, this.TIMING_DEFAULT_X)
                } else {
                    durationsParam = durations == 'default' ? this.DURATION_DEFAULT_X : durations
                    while (durationsParam.length < 4) {
                        durationsParam.push(durationsParam[0])
                    }
                    timingsParam = timings == 'default' ? this.TIMING_DEFAULT_X : timings
                    while (timingsParam.length < 4) {
                        timingsParam.push(timingsParam[0])
                    }
                    transition = new FadeVerticalTransition(durationsParam, timingsParam)
                }
                break

            default:
                transition = null
                break
        }

        return transition
    }

    static getTransitionProperty(propertyTarget: string, duration: number, timing: string): string {
        return `transition: ` + propertyTarget + ` ` + duration + `ms ` + timing + `;`
    }

    static mergeTransitionProperties(transitions: string[]) {
        const normalizedTransitions: string[] = []
        transitions.forEach(t => {
            normalizedTransitions.push(t.replace('transition: ', '').replace(';', ''))
        })
        let result: string = ''
        normalizedTransitions.forEach(n => {
            result += n + ','
        })

        return 'transition: ' + result.substring(0, result.length - 1) + ';'
    }
}