
export abstract class Transition {
    constructor(protected codes: string[], public inNames: string[], public outNames: string[], public outUpNames: string[], public outDownNames: string[]) {}

    safelyInsertCSS() {
        const head = document.head
        const style = document.getElementById('sf-style')

        if(style instanceof HTMLElement) {
            this.codes.forEach(a => {
                if(!style.textContent?.includes(a)) {
                    style.textContent += '\n' + a
                }
            })
        }
    }
}