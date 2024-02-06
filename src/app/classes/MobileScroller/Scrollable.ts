export class Scrollable {
    private onMove!: EventListener
    private speedY!: number
    private speedX!: number
    private yTimeout!: NodeJS.Timeout
    private xTimeout!: NodeJS.Timeout
    private static REDUCING_Y_SPEED_INTERVAL = 10
    private static REDUCING_X_SPEED_INTERVAL = 10
    private realElement: HTMLElement

    constructor(private element: HTMLElement, private type: string, hideScrollBar: boolean, grabbedElementStr: string | null, private marginTop: number, private marginBottom: number, private marginLeft: number, private marginRight: number) {
        this.realElement = element
        
        if (hideScrollBar) {
            element.classList.add('ms-hide-scrollbar')
        }
        if (grabbedElementStr) {
            this.element = document.getElementById(grabbedElementStr) as HTMLElement
        }
        if(this.marginTop  != 0|| this.marginBottom != 0|| this.marginLeft != 0|| this.marginLeft != 0) {
            this.element.classList.add('relative')
            const newElement = document.createElement('div')
            newElement.style.content = ''
            newElement.style.position = 'absolute'
            newElement.style.top = this.marginTop + 'px'
            newElement.style.bottom = this.marginBottom + 'px'
            newElement.style.left = this.marginLeft + 'px'
            newElement.style.right = this.marginRight + 'px'
            newElement.style.zIndex = '20'
            this.element.appendChild(newElement)
            this.element = newElement
        }

        this.element.classList.add('ms-cursor-grab')
    }

    isElementIntersected(e: MouseEvent): boolean {
        const left = this.element.getBoundingClientRect().left
        const right = this.element.getBoundingClientRect().right
        const top = this.element.getBoundingClientRect().top
        const bottom = this.element.getBoundingClientRect().bottom

        return (e.clientX >= left && e.clientX <= right) && (e.clientY >= top && e.clientY <= bottom)
    }

    scroll(e: MouseEvent) {
        this.element.classList.remove('ms-cursor-grab')
        document.body.classList.add('ms-cursor-grabbing')

        this.speedY = e.movementY
        this.speedX = e.movementX

        this.onMove = e => this.move(e as MouseEvent)
        document.addEventListener('mousemove', this.onMove)
    }

    private move(e: MouseEvent) {
        if (this.type == 'y' || this.type == 'xy') {
            this.realElement.scrollTop += - e.movementY
            this.speedY = e.movementY
        }

        if (this.type == 'x' || this.type == 'xy') {
            this.realElement.scrollLeft += - e.movementX
            this.speedX = e.movementX
        }
    }

    release() {
        this.element.classList.add('ms-cursor-grab')
        document.body.classList.remove('ms-cursor-grabbing')

        if (this.speedY > 0 && (this.type == 'y' || this.type == 'xy')) {
            this.yTimeout = setTimeout(() => this.reduceYSpeedPositive(), Scrollable.REDUCING_Y_SPEED_INTERVAL)
        } else if (this.speedY < 0 && (this.type == 'y' || this.type == 'xy')) {
            this.yTimeout = setTimeout(() => this.reduceYSpeedNegative(), Scrollable.REDUCING_Y_SPEED_INTERVAL)
        }

        if (this.speedX > 0 && (this.type == 'x' || this.type == 'xy')) {
            this.xTimeout = setTimeout(() => this.reduceXSpeedPositive(), Scrollable.REDUCING_X_SPEED_INTERVAL)
        } else if (this.speedX < 0 && (this.type == 'x' || this.type == 'xy')) {
            this.xTimeout = setTimeout(() => this.reduceXSpeedNegative(), Scrollable.REDUCING_X_SPEED_INTERVAL)
        }

        document.removeEventListener('mousemove', this.onMove)
    }

    private reduceYSpeedPositive() {
        this.realElement.scrollTop += -this.speedY
        this.speedY--

        if (this.speedY > 0) {
            this.yTimeout = setTimeout(() => this.reduceYSpeedPositive(), Scrollable.REDUCING_Y_SPEED_INTERVAL)
        }
    }

    private reduceYSpeedNegative() {
        this.realElement.scrollTop += -this.speedY
        this.speedY++

        if (this.speedY < 0) {
            this.yTimeout = setTimeout(() => this.reduceYSpeedNegative(), Scrollable.REDUCING_Y_SPEED_INTERVAL)
        }
    }

    private reduceXSpeedPositive() {
        this.realElement.scrollLeft += -this.speedX
        this.speedX--

        if (this.speedX > 0) {
            this.xTimeout = setTimeout(() => this.reduceXSpeedPositive(), Scrollable.REDUCING_X_SPEED_INTERVAL)
        }
    }

    private reduceXSpeedNegative() {
        this.realElement.scrollLeft += -this.speedX
        this.speedX++

        if (this.speedX < 0) {
            this.xTimeout = setTimeout(() => this.reduceXSpeedNegative(), Scrollable.REDUCING_X_SPEED_INTERVAL)
        }
    }

    destroy() {
        clearTimeout(this.yTimeout)
        clearTimeout(this.xTimeout)
    }
}