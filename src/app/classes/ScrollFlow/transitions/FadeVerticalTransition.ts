import { TransitionUtils } from "../TransitionUtils";
import { Transition } from "./Transition";

export class FadeVerticalTransition extends Transition {
    constructor(durations: number[], timings: string[]) {
        const inTransitionProperties: string[] = [TransitionUtils.getTransitionProperty('opacity', durations[0], timings[0]), TransitionUtils.getTransitionProperty('transform', durations[1], timings[1])]
        const inTransitionPropertyMerged = TransitionUtils.mergeTransitionProperties(inTransitionProperties)

        const outTransitionProperties: string[] = [TransitionUtils.getTransitionProperty('opacity', durations[2], timings[2]), TransitionUtils.getTransitionProperty('transform', durations[3], timings[3])]
        const outTransitionPropertyMerged = TransitionUtils.mergeTransitionProperties(outTransitionProperties)

        const inName = `sf-fade-vertical-in-${durations[0]}-${timings[0]}-${durations[1]}-${timings[1]}`
        const outUpName = `sf-fade-vertical-up-out-${durations[2]}-${timings[2]}-${durations[3]}-${timings[3]}`
        const outDownName = `sf-fade-vertical-down-out-${durations[2]}-${timings[2]}-${durations[3]}-${timings[3]}`

        const codes: string[] = [
            `.${inName} {
                opacity: 1;
                transform: translateY(0);
                ${inTransitionPropertyMerged}
            }`,
            `.${outUpName} {
                opacity: 0;
                transform: translateY(-25%);
                ${outTransitionPropertyMerged}
            }`,
            `.${outDownName} {
                opacity: 0;
                transform: translateY(25%);
                ${outTransitionPropertyMerged}
            }`
        ]

        const inNames: string[] = [inName]
        const outUpNames: string[] = [outUpName]
        const outDownNames: string[] = [outDownName]

        super(codes, inNames, [], outUpNames, outDownNames)
    }
}