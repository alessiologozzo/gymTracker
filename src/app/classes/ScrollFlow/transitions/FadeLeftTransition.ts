import { TransitionUtils } from "../TransitionUtils";
import { Transition } from "./Transition";

export class FadeLeftTransition extends Transition {
    //duration and timing must have 4 elements each
    constructor(durations: number[], timings: string[]) {
        const inTransitionProperties: string[] = [TransitionUtils.getTransitionProperty('opacity', durations[0], timings[0]), TransitionUtils.getTransitionProperty('transform', durations[1], timings[1])]
        const inTransitionPropertyMerged = TransitionUtils.mergeTransitionProperties(inTransitionProperties)

        const outTransitionProperties: string[] = [TransitionUtils.getTransitionProperty('opacity', durations[2], timings[2]), TransitionUtils.getTransitionProperty('transform', durations[3], timings[3])]
        const outTransitionPropertyMerged = TransitionUtils.mergeTransitionProperties(outTransitionProperties)

        const inName = `sf-fade-left-in-${durations[0]}-${timings[0]}-${durations[1]}-${timings[1]}`
        const outName = `sf-fade-left-out-${durations[2]}-${timings[2]}-${durations[3]}-${timings[3]}`

        const codes: string[] = [
            `.${inName} {
                opacity: 1;
                transform: translateX(0);
                ${inTransitionPropertyMerged}
            }`,
            `.${outName} {
                opacity: 0;
                transform: translateX(-25%);
                ${outTransitionPropertyMerged}
            }`
        ]

        const inNames: string[] = [inName]
        const outNames: string[] = [outName]
        super(codes, inNames, outNames, [], [])
    }
}