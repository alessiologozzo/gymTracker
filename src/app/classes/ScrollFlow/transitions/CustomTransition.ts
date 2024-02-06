import { Transition } from "./Transition";

export class CustomTransition extends Transition {
    constructor(inNames: string[], outNames: string[], outUpNames: string[], outDownNames: string[]) {
        const codes: string[] = []

        super(codes, inNames, outNames, outUpNames, outDownNames)
    }
}