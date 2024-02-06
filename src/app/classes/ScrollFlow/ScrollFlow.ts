import { Observer } from "./Observer"
import { TransitionUtils } from "./TransitionUtils"
import { Transition } from "./transitions/Transition"

export class ScrollFlow {
    private observers: Observer[] = []
    private lastScrollTop: number
    private scrollListener: EventListener

    /**
     * 
     * @param options Default values applied to all transitions.  
     * - thresold: A number which indicate at what percentage of the target's visibility the transition will be triggered. A value of 0 means that as soon as even one pixel is visible, the transition will be run. A value of 1.0 means that the threshold isn't considered passed until every pixel is visible. Default is 0.25.  
     * - root: The element id that is used as the viewport for checking visibility of the target. Must be an ancestor of the targets. Default is null (the viewport).  
     * - rootMargin: Margin around the root. Can have values similar to the CSS margin property, e.g. "10px 20px 30px 40px" (top, right, bottom, left). The values can be percentages. This set of values serves to grow or shrink each side of the root element's bounding box before triggering the transitions. Default is "0".  
     * - factor: A factor to multiply default durations and mantain default transitions consistent. 0.5 means 750, 1 means 1500, 1.5 means 2250 and so on. Cannot be used together with durations and timings. Default is 1.   
     * - durations: An array that specifies the duration of the transitions in milliseconds. In 'fade' transition there is just one value but in more complex transitions like 'fade-left', 'fade-right' and 'fade-vertical' there are multiple durations: in 'fade-left' and 'fade-right' first value is inOpacity, second value is inTransform, third one is outOpacity and last one is outTransform. In 'fade-vertical' is the same but the out values apply to both outUp and outDown.   
     * - timings: An array that specifies the speed curve of the transitions effect. In 'fade' transition there is just a value but in more complex transitions like 'fade-left', 'fade-right' and 'fade-vertical' there are multiple durations: in 'fade-left' and 'fade-right' first value is inOpacity, second value is inTransform, third one is outOpacity and last one is outTransform. In 'fade-vertical' is the same but the out values apply to both outUp and outDown. Possible values are: "linear", "ease", "ease-in", "ease-out", "ease-in-out", "cubic-bezier(n, n, n, n)".    
     * - once: If set to true the transitions will be applied only once (for example an element will fade in but will never fade out even if the user scroll the element out of the screen). Default is false.
     * @param scanOnInitialization Wether the ScrollFlow should scan the document for the transitions upon initialization or not. If set to false method scan() must be called at a later time to observe the transitions. Default is true.
     */
    constructor(scanOnInitialization: boolean = true, private options: { thresold?: number, root?: HTMLElement, rootMargin?: string, factor?: number,  durations?: number[], timings?: string[], once?: boolean, exclude?: string[] } = {}) {
        if (scanOnInitialization) {
            this.scan()
        }
        this.lastScrollTop = document.documentElement.scrollTop
        this.scrollListener = () => this.onScrollListener()
        document.addEventListener('scroll', this.scrollListener)
    }

    private onScrollListener() {
        const currentScrollTop = document.documentElement.scrollTop
            if(this.lastScrollTop == currentScrollTop) {
                this.observers.forEach(o => {
                    if(o.containerLastScrollTop && o.root && o.containerLastScrollTop != o.root.scrollTop) {
                        o.down = o.containerLastScrollTop < o.root.scrollTop
                        o.containerLastScrollTop = o.root.scrollTop
                    }
                })
            } else {
                const down = this.lastScrollTop < currentScrollTop
                this.observers.forEach(o => {
                    o.down = down
                })
            }
            this.lastScrollTop = document.documentElement.scrollTop
    }

    private safelyCreateAndAppendStyleToDocument() {
        const head = document.head
        const oldStyle = document.getElementById('sf-style')
        if (!oldStyle) {
            const style = document.createElement('style')
            style.id = 'sf-style'
            head.appendChild(style)
        }
    }

    private initializeElementCSS(element: HTMLElement, transition: Transition) {
        transition.safelyInsertCSS()
        transition.outNames.forEach(a => {
            element.classList.add(a)
        })
        transition.outDownNames.forEach(a => {
            element.classList.add(a)
        })
    }

    /**
     * Scan the document to observe all transitions. Can be called multiple times if needed.
     */
    scan() {
        this.safelyCreateAndAppendStyleToDocument()

        const excludedStrIds: string[] | null = this.options.exclude ? this.options.exclude : null
        let excludedElements: HTMLElement[] = []
        if(excludedStrIds) {
           excludedStrIds.forEach(id => {
            const elementToBeExcluded = document.getElementById(id)
            if(elementToBeExcluded) {
                excludedElements.push(elementToBeExcluded)
            }
           })
        }

        const elements = document.body.querySelectorAll("[sf-transition]")
        elements.forEach(element => {
            for(let i = 0; i < excludedElements.length; i++) {
                if(excludedElements[i].isSameNode(element)) {
                    return
                }
            }

            for (let i = 0; i < this.observers.length; i++) {
                if (this.observers[i].element.isSameNode(element)) {
                    return
                }
            }

            let thresold: number = this.options.thresold ? this.options.thresold : TransitionUtils.THRESOLD_DEFAULT
            const thresoldAttr = element.getAttribute('sf-thresold')
            if (thresoldAttr) {
                thresold = parseFloat(thresoldAttr)
            }

            let root: HTMLElement | null = this.options.root ? this.options.root : TransitionUtils.ROOT_DEFAULT
            const rootAttr = element.getAttribute('sf-root')
            if (rootAttr) {
                const rootElement = document.getElementById(rootAttr)
                if (rootElement instanceof HTMLElement) {
                    root = rootElement
                }
            }

            let rootMargin: string = this.options.rootMargin ? this.options.rootMargin : TransitionUtils.ROOT_MARGIN_DEFAULT
            const rootMarginAttr = element.getAttribute('sf-rootMargin')
            if (rootMarginAttr) {
                rootMargin = rootMarginAttr
            }

            let factor: number | null = this.options.factor ? this.options.factor : TransitionUtils.FACTOR_DEFAULT
            const factorAttr = element.getAttribute('sf-factor')
            if(factorAttr) {
                factor = parseFloat(factorAttr)
            }

            let durations: number[] | 'default' = this.options.durations ? this.options.durations : 'default'
            const durationsAttr = element.getAttribute('sf-durations')
            if (durationsAttr) {
                durations = durationsAttr.split(' ').map(d => parseInt(d))
            }

            let timings: string[] | 'default' = this.options.timings ? this.options.timings : 'default'
            const timingsAttr = element.getAttribute('sf-timings')
            if (timingsAttr) {
                timings = timingsAttr.split(' ')
            }

            let once = this.options.once ? this.options.once : TransitionUtils.ONCE_DEFAULT
            const onceAttr = element.getAttribute('sf-once')
            if (onceAttr) {
                once = onceAttr == 'true'
            }

            let inNames: string[] = []
            const inNamesAttr = element.getAttribute('sf-in')
            if (inNamesAttr) {
                inNames = inNamesAttr?.split(' ')
            }

            let outNames: string[] = []
            const outNamesAttr = element.getAttribute('sf-out')
            if (outNamesAttr) {
                outNames = outNamesAttr.split(' ')
            }

            let outUpNames: string[] = []
            const outUpNamesAttr = element.getAttribute('sf-out-up')
            if(outUpNamesAttr) {
                outUpNames = outUpNamesAttr.split(' ')
            }

            let outDownNames: string[] = []
            const outDownNamesAttr = element.getAttribute('sf-out-down')
            if(outDownNamesAttr) {
                outDownNames = outDownNamesAttr.split(' ')
            }

            const transition = TransitionUtils.assessTransition(element as HTMLElement, inNames, outNames, outUpNames, outDownNames, factor, durations, timings)
            if (!transition) {
                return
            }
            this.initializeElementCSS(element as HTMLElement, transition)
            const observer = new Observer(element as HTMLElement, transition, thresold, root, rootMargin, once)
            this.observers.push(observer)
        })
    }

    /**
     * Unobserve and remove the transition from the ScrollAnimator
     * @param element Transition's element to be removed
     */
    remove(element: HTMLElement) {
        for (let i = 0; i < this.observers.length; i++) {
            if (this.observers[i].element.isSameNode(element)) {
                this.observers[i].unobserve()
                this.observers = this.observers.filter(observer => observer != this.observers[i])
                break
            }
        }
    }

    /**
     * Unobserve and remove all transitions from the ScrollAnimator
     */
    removeAll() {
        this.observers.forEach(observer => {
            observer.unobserve()
        })
        this.observers = []
    }

    destroy() {
        document.removeEventListener('scroll', this.scrollListener)
        this.removeAll()
    } 
}