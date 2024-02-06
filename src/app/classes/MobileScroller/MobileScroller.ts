import { Scrollable } from "./Scrollable"

export class MobileScroller {
    private scrollables: Scrollable[] = []
    private onMouseDownRef: EventListener
    private onMouseUpRef: EventListener

    constructor(scanOnInitialization: boolean = true) {
        this.insertCSS()
        if(scanOnInitialization) {
            this.scan()
        }

        this.onMouseDownRef = e => this.onMouseDown(e as MouseEvent)
        this.onMouseUpRef = () => this.onMouseUp()

        document.addEventListener('mousedown', this.onMouseDownRef)
        document.addEventListener('mouseup', this.onMouseUpRef)
    }

    scan() {
        const elements = document.body.querySelectorAll('[ms-type]')
        if(elements) {
            elements.forEach(element => {
                let hideScrollBar: boolean = true
                const hideScrollBarAttr = element.getAttribute('ms-hideScrollBar')
                if(hideScrollBarAttr) {
                    hideScrollBar = hideScrollBarAttr == 'true'
                }
                

                let grabbedElement: string | null = null
                const grabbedElementAttr = element.getAttribute('ms-grabbedElement')
                if(grabbedElementAttr) {
                    grabbedElement = grabbedElementAttr
                }

                let marginTop: number = 0
                let marginBottom: number = 0
                let marginLeft: number = 0
                let marginRight: number = 0
                const marginAttr = element.getAttribute('ms-margin')
                if(marginAttr) {
                    const marginArr = marginAttr.split(' ')

                    if(marginArr.length == 1) {
                        marginTop = marginBottom = marginLeft = marginRight = parseInt(marginArr[0])
                    } else if(marginArr.length == 2) {
                        marginTop = marginBottom = parseInt(marginArr[0])
                        marginLeft = marginRight = parseInt(marginArr[1])
                    } else if(marginArr.length == 3) {
                        marginTop = parseInt(marginArr[0])
                        marginLeft = marginRight = parseInt(marginArr[1])
                        marginBottom = parseInt(marginArr[2])
                    } else if(marginArr.length == 4) {
                        marginTop = parseInt(marginArr[0])
                        marginRight = parseInt(marginArr[1])
                        marginBottom = parseInt(marginArr[2])
                        marginLeft = parseInt(marginArr[3])
                    }
                }

                let type: string | null = element.getAttribute('ms-type')
                if(type) {
                    this.scrollables.push(new Scrollable(element as HTMLElement, type, hideScrollBar, grabbedElement, marginTop, marginBottom, marginLeft, marginRight))
                }
            })
        }
    }

    private onMouseDown(e: MouseEvent) {
        if(e.button == 0) {
            this.scrollables.forEach(s => {
                if(s.isElementIntersected(e)) {
                    e.preventDefault()
                    s.scroll(e)
                }
            })
        } else {
            this.onMouseUp()
        }
    }

    private onMouseUp() {
        this.scrollables.forEach(s => {
            s.release()
        })
    }

    destroy() {
        this.scrollables.forEach(s => {
            s.destroy()
        })
        this.scrollables = []

        document.removeEventListener('mousedown', this.onMouseDownRef)
        document.removeEventListener('mouseup', this.onMouseUpRef)
    }

    private insertCSS() {
        const style = document.getElementById('ms-style')
        if(!style) {
            const newStyle = document.createElement('style')
            newStyle.textContent = `
            .ms-hide-scrollbar {
                scrollbar-width: none;
            }
            .ms-hide-scrollbar::-webkit-scrollbar {
                display: none;
            }
            .ms-cursor-grab, .ms-cursor-grab * {
                cursor: grab;
            }
            .ms-cursor-grabbing {
                cursor: grabbing;
            }`
            document.head.appendChild(newStyle)
        }
    }
}