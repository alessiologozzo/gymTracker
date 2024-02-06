import { TypeElement } from "./TypeElement"

export class TypeFlow {
    private typeElements: TypeElement[] = []
    private static TYPE_SPEED_DEFAULT = 160
    private static BACK_SPEED_DEFAULT = 120
    private static TYPE_DELAY_DEFAULT = 3000
    private static BACK_DELAY_DEFAULT = 200
    private static COMPLETE_DELAY_DEFAULT = 6000
    private static LOOP_DEFAULT = false
    private static REPEAT_DEFAULT = 0
    private static CURSOR_CHAR_DEFAULT = '|'
    private static CURSOR_COLOR_DEFAULT = null
    private static CURSOR_FONT_SIZE_DEFAULT = null
    private static CURSOR_CLASSES_DEFAULT: string[] = ['tf-cursor']
    private static BLINK_CLASSES_DEFAULT: string[] = ['tf-cursor-blink']
    private static BACK_ON_LAST_DEFAULT = false
    private static SMART_BACK_DEFAULT = false
    private static START_DELAY_DEFAULT = 200
    private static RESUME_DELAY_DEFAULT = 0

    constructor(scanOnInitialization: boolean = true, private options: { strings?: string[], typeSpeed?: number, backSpeed?: number, typeDelay?: number, backDelay?: number, completeDelay?: number, loop?: boolean, repeat?: number, cursorChar?: string, cursorColor?: string, cursorFontSize?: string, cursorClasses?: string[], blinkClasses?: string[], backOnLast?: boolean, smartBack?: boolean, onComplete?: Function, onStringTyped?: Function, onStringBack?: Function, onPause?: Function, onResume?: Function, onStart?: Function, onReset?: Function, onDestroy?: Function, onChangeStrings?: Function, startDelay?: number, resumeDelay?: number } = {}) {
        if (scanOnInitialization) {
            this.scan()
        }
    }

    scan() {
        this.safelyCreateAndAppendStyleToDocument()

        const elements = document.body.querySelectorAll('[tf-strings]')

        elements.forEach(element => {
            let strings: string[] = this.options.strings ? this.options.strings : []
            const stringsAttr = element.getAttribute('tf-strings')
            if (stringsAttr) {
                strings = stringsAttr.split(',')
            }

            let typeSpeed: number = (this.options.typeSpeed || this.options.typeSpeed == 0) ? this.options.typeSpeed : TypeFlow.TYPE_SPEED_DEFAULT
            const typeSpeedAttr = element.getAttribute('tf-typeSpeed')
            if (typeSpeedAttr) {
                typeSpeed = parseInt(typeSpeedAttr)
            }

            let backSpeed: number = (this.options.backSpeed || this.options.backSpeed == 0) ? this.options.backSpeed : TypeFlow.BACK_SPEED_DEFAULT
            const backSpeedAttr = element.getAttribute('tf-backSpeed')
            if (backSpeedAttr) {
                backSpeed = parseInt(backSpeedAttr)
            }

            let typeDelay: number = (this.options.typeDelay || this.options.typeDelay == 0) ? this.options.typeDelay : TypeFlow.TYPE_DELAY_DEFAULT
            const typeDelayAttr = element.getAttribute('tf-delay')
            if (typeDelayAttr) {
                typeDelay = parseInt(typeDelayAttr)
            }

            let backDelay: number = (this.options.backDelay || this.options.backDelay == 0) ? this.options.backDelay : TypeFlow.BACK_DELAY_DEFAULT
            const backDelayAttr = element.getAttribute('tf-backDelay')
            if (backDelayAttr) {
                backDelay = parseInt(backDelayAttr)
            }

            let completeDelay: number = (this.options.completeDelay || this.options.completeDelay == 0) ? this.options.completeDelay : TypeFlow.COMPLETE_DELAY_DEFAULT
            const completeDelayAttr = element.getAttribute('tf-completeDelay')
            if(completeDelayAttr) {
                completeDelay = parseInt(completeDelayAttr)
            }

            let loop: boolean = this.options.loop ? this.options.loop : TypeFlow.LOOP_DEFAULT
            const loopAttr = element.getAttribute('tf-loop')
            if (loopAttr) {
                loop = loopAttr == 'true'
            }
            
            let repeat: number = this.options.repeat ? this.options.repeat : TypeFlow.REPEAT_DEFAULT
            const repeatAttr = element.getAttribute('tf-repeat')
            if (repeatAttr) {
                repeat = parseInt(repeatAttr)
            }

            let cursorChar: string = this.options.cursorChar ? this.options.cursorChar : TypeFlow.CURSOR_CHAR_DEFAULT
            const cursorCharAttr = element.getAttribute('tf-cursor-char')
            if (cursorCharAttr) {
                cursorChar = cursorCharAttr
            }

            let cursorColor: string | null = this.options.cursorColor ? this.options.cursorColor : TypeFlow.CURSOR_COLOR_DEFAULT
            const cursorColorAttr = element.getAttribute('tf-cursorColor')
            if (cursorColorAttr) {
                cursorColor = cursorColorAttr
            }

            let cursorFontSize: string | null = this.options.cursorFontSize ? this.options.cursorFontSize : TypeFlow.CURSOR_FONT_SIZE_DEFAULT
            const cursorFontSizeAttr = element.getAttribute('tf-fontSize')
            if (cursorFontSizeAttr) {
                cursorFontSize = cursorFontSizeAttr
            }

            let cursorClasses: string[] = this.options.cursorClasses ? this.options.cursorClasses : TypeFlow.CURSOR_CLASSES_DEFAULT
            const cursorClassesAttr = element.getAttribute('tf-cursorClasses')
            if (cursorClassesAttr) {
                cursorClasses = cursorClassesAttr.split(' ')
            }

            let blinkClasses: string[] = this.options.blinkClasses ? this.options.blinkClasses : TypeFlow.BLINK_CLASSES_DEFAULT
            const blinkClassesAttr = element.getAttribute('tf-blinkClasses')
            if (blinkClassesAttr) {
                blinkClasses = blinkClassesAttr.split(' ')
            }

            let backOnLast: boolean = this.options.backOnLast ? this.options.backOnLast : TypeFlow.BACK_ON_LAST_DEFAULT
            const backOnLastAttr = element.getAttribute('tf-backOnLast')
            if (backOnLastAttr) {
                backOnLast = backOnLastAttr == 'true'
            }

            let smartBack: boolean = this.options.smartBack ? this.options.smartBack : TypeFlow.SMART_BACK_DEFAULT
            const smartBackAttr = element.getAttribute('tf-smartBack')
            if (smartBackAttr) {
                smartBack = smartBackAttr == 'true'
            }

            let onComplete: Function | null = null

            let onStringTyped: Function | null = null

            let onStringBack: Function | null = null

            let onPause: Function | null = null

            let onResume: Function | null = null

            let onStart: Function | null = null

            let onReset: Function | null = null

            let onDestroy: Function | null = null

            let onChangeStrings: Function | null = null

            let startDelay: number = (this.options.startDelay || this.options.startDelay == 0) ? this.options.startDelay : TypeFlow.START_DELAY_DEFAULT
            const startDelayAttr = element.getAttribute('tf-startDelay')
            if (startDelayAttr) {
                startDelay = parseInt(startDelayAttr)
            }

            let resumeDelay: number = (this.options.resumeDelay || this.options.resumeDelay == 0) ? this.options.resumeDelay : TypeFlow.RESUME_DELAY_DEFAULT
            const resumeDelayAttr = element.getAttribute('tf-resumeDelay')
            if (resumeDelayAttr) {
                resumeDelay = parseInt(resumeDelayAttr)
            }

            const el = new TypeElement(element as HTMLElement, strings, typeSpeed, backSpeed, typeDelay, backDelay, completeDelay, loop, repeat, cursorChar, cursorColor, cursorFontSize, cursorClasses, blinkClasses, backOnLast, smartBack, onComplete, onStringTyped, onStringBack, onPause, onResume, onStart, onReset, onDestroy, onChangeStrings, startDelay, resumeDelay)
            this.typeElements.push(el)
        })
    }

    private safelyCreateAndAppendStyleToDocument() {
        const head = document.head
        const oldStyle = document.getElementById('tf-style')
        if (!oldStyle) {
            const style = document.createElement('style')
            style.id = 'tf-style'
            head.appendChild(style)
            const baseClass = `.tf-cursor {
                margin-left: 1px;
            }
            .tf-cursor-blink {
                animation: animate-cursor 700ms infinite;
            }
            @keyframes animate-cursor {
                0 {
                    opacity: 1;
                }
                50% {
                    opacity: 0;
                }
                100% {
                    opacity: 1;
                }
            }`
            if(!style.textContent?.includes(baseClass)) {
                style.textContent += baseClass
            }
        }
    }

    remove(element: HTMLElement | string | null) {
        if(typeof element === 'string') {
            element = document.getElementById(element)
        }
        if(!element) {
            return
        }

        for (let i = 0; i < this.typeElements.length; i++) {
            if (this.typeElements[i].element.isSameNode(element)) {
                this.typeElements[i].destroy()
                this.typeElements = this.typeElements.filter(el => el != this.typeElements[i])
                break
            }
        }
    }

    removeAll() {
        this.typeElements.forEach(el => {
            el.destroy()
        })
        this.typeElements = []
    }

    changeStrings(element: HTMLElement | string | null, strings: []) {
        if(typeof element === 'string') {
            element = document.getElementById(element)
        }
        if(!element) {
            return
        }

        for (let i = 0; i < this.typeElements.length; i++) {
            if (this.typeElements[i].element.isSameNode(element)) {
                this.typeElements[i].changeStrings(strings)
                break
            }
        }
    }

    pause(element: HTMLElement | string | null) {
        if(typeof element === 'string') {
            element = document.getElementById(element)
        }
        if(!element) {
            return
        }

        for (let i = 0; i < this.typeElements.length; i++) {
            if (this.typeElements[i].element.isSameNode(element)) {
                this.typeElements[i].pause()
                break
            }
        }
    }

    resume(element: HTMLElement | string | null) {
        if(typeof element === 'string') {
            element = document.getElementById(element)
        }
        if(!element) {
            return
        }

        for (let i = 0; i < this.typeElements.length; i++) {
            if (this.typeElements[i].element.isSameNode(element)) {
                this.typeElements[i].resume()
                break
            }
        }
    }

    reset(element: HTMLElement | string | null, restart: boolean = true) {
        if(typeof element === 'string') {
            element = document.getElementById(element)
        }
        if(!element) {
            return
        }

        for (let i = 0; i < this.typeElements.length; i++) {
            if (this.typeElements[i].element.isSameNode(element)) {
                this.typeElements[i].reset(restart)
                break
            }
        }
    }

    changeStringsAll(strings: string[]) {
        this.typeElements.forEach(el => {
            el.changeStrings(strings)
        })
    }

    pauseAll() {
        this.typeElements.forEach(el => {
            el.pause()
        })
    }

    resumeAll() {
        this.typeElements.forEach(el => {
            el.resume()
        })
    }

    resetAll(restart: boolean = true) {
        this.typeElements.forEach(el => {
            el.reset(restart)
        })
    }

    add(element: HTMLElement | string | null, options: { strings?: string[], typeSpeed?: number, backSpeed?: number, typeDelay?: number, backDelay?: number, completeDelay?: number, loop?: boolean, repeat?: number, cursorChar?: string, cursorColor?: string, cursorFontSize?: string, cursorClasses?: string[], blinkClasses?: string[], backOnLast?: boolean, smartBack?: boolean, onComplete?: Function, onStringTyped?: Function, onStringBack?: Function, onPause?: Function, onResume?: Function, onStart?: Function, onReset?: Function, onDestroy?: Function, onChangeStrings?: Function, startDelay?: number, resumeDelay?: number } = {}) {
        if(typeof element === 'string') {
            element = document.getElementById(element)
        }
        if(!element) {
            return
        }

        this.safelyCreateAndAppendStyleToDocument()
        for (let i = 0; i < this.typeElements.length; i++) {
            if (this.typeElements[i].element.isSameNode(element)) {
                this.typeElements[i].resume()
                return
            }
        }
            
        const strings: string[] = options.strings ? options.strings : (this.options.strings ? this.options.strings : [])
        const typeSpeed: number = (options.typeSpeed || options.typeSpeed == 0) ? options.typeSpeed : (this.options.typeSpeed ? this.options.typeSpeed : TypeFlow.TYPE_SPEED_DEFAULT)
        const backSpeed: number = (options.backSpeed || options.backSpeed == 0) ? options.backSpeed : (this.options.backSpeed ? this.options.backSpeed : TypeFlow.BACK_SPEED_DEFAULT)
        const typeDelay: number = (options.typeDelay || options.typeDelay == 0) ? options.typeDelay : (this.options.typeDelay ? this.options.typeDelay : TypeFlow.TYPE_DELAY_DEFAULT)
        const backDelay: number = (options.backDelay || options.backDelay == 0) ? options.backDelay : (this.options.backDelay ? this.options.backDelay : TypeFlow.BACK_DELAY_DEFAULT)
        const completeDelay: number = (options.completeDelay || options.completeDelay == 0) ? options.completeDelay : (this.options.completeDelay ? this.options.completeDelay : TypeFlow.COMPLETE_DELAY_DEFAULT)
        const loop: boolean = options.loop ? options.loop : (this.options.loop ? this.options.loop : TypeFlow.LOOP_DEFAULT)
        const repeat: number = options.repeat ? options.repeat : (this.options.repeat ? this.options.repeat : TypeFlow.REPEAT_DEFAULT)
        const cursorChar: string = options.cursorChar ? options.cursorChar : (this.options.cursorChar ? this.options.cursorChar : TypeFlow.CURSOR_CHAR_DEFAULT)
        const cursorColor: string | null = options.cursorColor ? options.cursorColor : (this.options.cursorColor ? this.options.cursorColor : TypeFlow.CURSOR_COLOR_DEFAULT)
        const cursorFontSize: string | null = options.cursorFontSize ? options.cursorFontSize : (this.options.cursorFontSize ? this.options.cursorFontSize : TypeFlow.CURSOR_FONT_SIZE_DEFAULT)
        const cursorClasses: string[] = options.cursorClasses ? options.cursorClasses : (this.options.cursorClasses ? this.options.cursorClasses : TypeFlow.CURSOR_CLASSES_DEFAULT)
        const blinkClasses: string[] = options.blinkClasses ? options.blinkClasses : (this.options.blinkClasses ? this.options.blinkClasses : TypeFlow.BLINK_CLASSES_DEFAULT)
        const backOnLast: boolean = options.backOnLast ? options.backOnLast : (this.options.backOnLast ? this.options.backOnLast : TypeFlow.BACK_ON_LAST_DEFAULT)
        const smartBack: boolean = options.smartBack ? options.smartBack : (this.options.smartBack ? this.options.smartBack : TypeFlow.SMART_BACK_DEFAULT)
        const onComplete: Function | null = options.onComplete ? options.onComplete : (this.options.onComplete ? this.options.onComplete : null)
        const onStringTyped: Function | null = options.onStringTyped ? options.onStringTyped : (this.options.onStringTyped ? this.options.onStringTyped : null)
        const onStringBack: Function | null = options.onStringBack ? options.onStringBack : (this.options.onStringBack ? this.options.onStringBack : null)
        const onPause: Function | null = options.onPause ? options.onPause : (this.options.onStringBack ? this.options.onStringBack : null)
        const onResume: Function | null = options.onResume ? options.onResume : (this.options.onResume ? this.options.onResume : null)
        const onStart: Function | null = options.onStart ? options.onStart : (this.options.onStart ? this.options.onStart : null)
        const onReset: Function | null = options.onReset ? options.onReset : (this.options.onReset ? this.options.onReset : null)
        const onDestroy: Function | null = options.onDestroy ? options.onDestroy : (this.options.onDestroy ? this.options.onDestroy : null)
        const onChangeStrings: Function | null = options.onChangeStrings ? options.onChangeStrings : (this.options.onChangeStrings ? this.options.onChangeStrings : null)
        const startDelay: number = (options.startDelay || options.startDelay == 0) ? options.startDelay : (this.options.startDelay ? this.options.startDelay : TypeFlow.START_DELAY_DEFAULT)
        const resumeDelay: number = (options.resumeDelay || options.resumeDelay == 0) ? options.resumeDelay : (this.options.resumeDelay ? this.options.resumeDelay : TypeFlow.RESUME_DELAY_DEFAULT)

        const el = new TypeElement(element, strings, typeSpeed, backSpeed, typeDelay, backDelay, completeDelay, loop, repeat, cursorChar, cursorColor, cursorFontSize, cursorClasses, blinkClasses, backOnLast, smartBack, onComplete, onStringTyped, onStringBack, onPause, onResume, onStart, onReset, onDestroy, onChangeStrings, startDelay, resumeDelay)
        this.typeElements.push(el)
    }
}