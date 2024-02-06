import { TransitionUtils } from "../TransitionUtils";
import { Transition } from "./Transition";

export class FadeTransition extends Transition {

    constructor(duration: number, timing: string) {
        const transitionProperty = TransitionUtils.getTransitionProperty('opacity', duration, timing)
        const inName = `sf-fade-in-${duration}-${timing}`
        const outName = `sf-fade-out-${duration}-${timing}`

        const codes = [
            `.${inName} {
                opacity: 1;
                ${transitionProperty}
            }`,
            `.${outName} {
                opacity: 0;
                ${transitionProperty}
            }`
        ]

        const inNames: string[] = [inName]
        const outNames: string[] = [outName]

        super(codes, inNames, outNames, [], [])
    }
}