export class TypeElement {
    private stringIndex: number = 0
    private charIndex: number = 0
    private repeated: number = 1
    private cursor: HTMLElement
    private content: HTMLElement
    private currentTimeout!: NodeJS.Timeout
    private currentFunction!: Function
    private isTyping: boolean = true
    private isSmartBack = false


    constructor(public element: HTMLElement, private strings: string[], private typeSpeed: number, private backSpeed: number, private typeDelay: number, private backDelay: number, private completeDelay: number, private loop: boolean, private repeat: number, cursorChar: string, private cursorColor: string | null, private cursorFontSize: string | null, private cursorClasses: string[], private blinkClasses: string[], private backOnLast: boolean, private smartBack: boolean, private onComplete: Function | null, private onStringTyped: Function | null, private onStringBack: Function | null, private onPause: Function | null, private onResume: Function | null, onStart: Function | null, private onReset: Function | null, private onDestroy: Function | null, private onChangeStrings: Function | null, startDelay: number, private resumeDelay: number) {
        this.safelyInsertCSS()
        this.content = document.createElement('span')
        this.content.textContent = ''
        this.cursor = document.createElement('span')
        this.cursorClasses.forEach(a => {
            this.cursor.classList.add(a)
        })
        this.cursor.textContent = cursorChar

        element.appendChild(this.content)
        element.appendChild(this.cursor)
        
        if(onStart) {
            onStart()
        }
        
        if(this.strings.length < 1) { // bad values
            this.blinkClasses.forEach(a => this.cursor.classList.add(a))
            this.content.textContent = ''
            return
        }

        this.currentFunction = this.evaluate
        this.currentTimeout = setTimeout(() => this.evaluate(), startDelay)
    }

    private safelyInsertCSS() {
        if (this.cursorColor || this.cursorFontSize) {
            const style = document.getElementById('tf-style')
            if (style instanceof HTMLElement) {
                const newCursorClassName = `tf-cursor-${this.cursorColor}-${this.cursorFontSize}`
                const newCursorClass = `tf-cursor-${this.cursorColor}-${this.cursorFontSize} {
                    color: ${this.cursorColor};
                    font-size: ${this.cursorFontSize};
                }`
                if (!style.textContent?.includes(newCursorClass)) {
                    style.textContent += '\n' + newCursorClass
                    this.cursorClasses = [newCursorClassName]
                }
            }
        }
    }

    destroy() {
        if(this.onDestroy) {
            this.onDestroy()
        }

        if (this.currentTimeout) {
            clearTimeout(this.currentTimeout)
        }
        if (this.content) {
            this.element.removeChild(this.content)
        }
        if (this.cursor) {
            this.element.removeChild(this.cursor)
        }
    }

    changeStrings(strings: string[], restart: boolean = false) {
        if(this.onChangeStrings) {
            this.onChangeStrings()
        }
        
        clearTimeout(this.currentTimeout)
        
        if(strings.length < 1) { // bad values
            this.blinkClasses.forEach(a => this.cursor.classList.add(a))
            this.content.textContent = ''
            return
        }

        this.strings = strings
        if(restart || (this.stringIndex < this.strings.length)) {
            if(restart) {
                this.stringIndex = 0
            }
            this.content.textContent = ''
            this.charIndex = 0
            this.isTyping = true

            if(this.stringIndex == -1) { // is completed
                this.stringIndex = this.strings.length - 1
            }
        } else if(this.stringIndex >= this.strings.length) {
            this.content.textContent = ''
            this.stringIndex = this.strings.length - 1
            this.charIndex = 0
        }
        this.evaluate()
    }

    pause() {
        if (this.onPause) {
            this.onPause()
        }
        clearTimeout(this.currentTimeout)
    }

    resume() {
        if (this.onResume) {
            this.onResume()
        }

        if(this.strings.length < 1) { // bad values
            this.blinkClasses.forEach(a => this.cursor.classList.add(a))
            this.content.textContent = ''
            return
        }

        this.currentTimeout = setTimeout(() => this.currentFunction(), this.resumeDelay)
    }

    reset(restart: boolean) {
        if(this.onReset) {
            this.onReset()
        }

        this.stringIndex = 0
        this.charIndex = 0
        this.repeated = 0
        this.content.textContent = ''

        if(restart) {
            this.evaluate()
        }
    }

    private evaluate() {
        if ((this.stringIndex == this.strings.length - 1 && this.charIndex == this.strings[this.stringIndex].length && !this.backOnLast) || (this.stringIndex == this.strings.length && this.charIndex == 0 && this.backOnLast)) { // completed
            if(this.onStringTyped) {
                this.onStringTyped()
            }
            if(this.onComplete) {
                this.onComplete()
            }
            this.blinkClasses.forEach(a => this.cursor.classList.add(a))

            if((this.loop && this.repeat < 1) || this.repeated < this.repeat) {
                if(this.repeat > 1) {
                    this.repeated++
                }

                if(this.backOnLast) {
                    this.stringIndex = 0
                    this.charIndex = 0
                    this.isTyping = true
                    this.currentFunction = this.type
                    this.currentTimeout = setTimeout(() => this.type(), this.completeDelay)
                } else {
                    this.stringIndex = -1
                    this.isTyping = false
                    this.currentFunction = this.back
                    this.currentTimeout = setTimeout(() => this.back(), this.completeDelay)
                }
            }
        } else if (this.isTyping && this.charIndex == this.strings[this.stringIndex].length) { // typed
            if(this.onStringTyped) {
                this.onStringTyped()
            }

            this.blinkClasses.forEach(a => this.cursor.classList.add(a))
            this.isTyping = false
            this.currentFunction = this.evaluate
            this.currentTimeout = setTimeout(() => this.evaluate(), this.typeDelay)
        } else if ((!this.isTyping && this.charIndex == 0) || this.isSmartBack) { // backspaced
            if(this.onStringBack) {
                this.onStringBack()
            }
            this.blinkClasses.forEach(a => this.cursor.classList.add(a))

            if(this.isSmartBack) {
                this.isSmartBack = false
            }

            this.stringIndex++
            this.isTyping = true
            this.currentFunction = this.evaluate
            this.currentTimeout = setTimeout(() => this.evaluate(), this.backDelay)
        } else if (this.isTyping) { // typing
            this.blinkClasses.forEach(a => this.cursor.classList.remove(a))
            this.currentFunction = this.type
            this.currentTimeout = setTimeout(() => this.type(), this.typeSpeed)
        } else { //backspacing
            this.blinkClasses.forEach(a => this.cursor.classList.remove(a))
            this.currentFunction = this.back
            this.currentTimeout = setTimeout(() => this.back(), this.backSpeed)
        }
    }

    private type() {
        this.content.textContent += this.strings[this.stringIndex][this.charIndex]
        this.charIndex++
        this.evaluate()
    }

    private back() {
        if(this.content.textContent) {
            if(this.smartBack && this.stringIndex < this.strings.length - 1) {
                if(this.content.textContent.length <= this.strings[this.stringIndex + 1].length && this.strings[this.stringIndex + 1].substring(0, this.charIndex) == this.content.textContent) {
                    this.isSmartBack = true
                } 
            } 
            
            if (!this.isSmartBack){
                this.charIndex--
                this.content.textContent = this.content.textContent?.substring(0, this.charIndex)
            }
        }
        this.evaluate()
    }
}