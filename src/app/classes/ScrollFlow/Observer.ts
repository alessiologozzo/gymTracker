import { Transition } from "./transitions/Transition"

export class Observer {
    private firstCall = true
    private intersectionObserver: IntersectionObserver
    containerLastScrollTop: number | null = null
    down = true

    constructor(public element: HTMLElement, private transition: Transition, thresold: number, public root: HTMLElement | null, rootMargin: string, once: boolean) {
        if(root) {
            this.containerLastScrollTop = root.scrollTop
        }
        this.intersectionObserver = new IntersectionObserver(entries => {
            if (this.firstCall) {
                this.firstCall = false
                if (entries[0].isIntersecting) {
                    this.onObserve()
                    if (once) {
                        this.intersectionObserver.unobserve(entries[0].target)
                    }
                }
            } else {
                this.onObserve()
                if (once) {
                    this.intersectionObserver.unobserve(entries[0].target)
                }
            }
        }, {
            threshold: thresold,
            root: root,
            rootMargin: rootMargin,
        })
        this.intersectionObserver.observe(element)
    }

    private onObserve() {
        this.transition.inNames.forEach(a => {
            this.element.classList.toggle(a)
        })
        this.transition.outNames.forEach(a => {
            this.element.classList.toggle(a)
        })

        if(this.down && this.transition.inNames.length > 0) {
            if(this.element.classList.contains(this.transition.inNames[0])) {
                this.transition.outDownNames.forEach(a => {
                    this.element.classList.remove(a)
                })
            } else {
                this.transition.outUpNames.forEach(a => {
                    this.element.classList.add(a)
                })
            }
        } else if(!this.down && this.transition.inNames.length > 0) {
            if(this.element.classList.contains(this.transition.inNames[0])) {
                this.transition.outUpNames.forEach(a => {
                    this.element.classList.remove(a)
                })
            } else {
                this.transition.outDownNames.forEach(a => {
                    this.element.classList.add(a)
                })
            }
        }
    }

    unobserve() {
        this.transition.inNames.forEach(a => {
            this.element.classList.remove(a)
        })
        this.transition.outNames.forEach(a => {
            this.element.classList.remove(a)
        })

        this.intersectionObserver.unobserve(this.element)
    }
}