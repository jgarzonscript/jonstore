import {
    Directive,
    ElementRef,
    Input,
    OnChanges,
    Renderer2,
    SimpleChanges,
    OnDestroy
} from "@angular/core";

@Directive({
    selector: "[pdSaved]"
})
export class SavedDirective implements OnChanges, OnDestroy {
    @Input() pdSaved!: number;
    @Input() pdMessage!: string;
    private unlistener!: () => void;

    constructor(private el: ElementRef, private render: Renderer2) {
        render.setStyle(el.nativeElement, "opacity", "0");
        render.setStyle(el.nativeElement, "transition", "opacity 800ms");
    }

    ngOnChanges(changes: SimpleChanges): void {
        const pdSavedObj = changes.pdSaved,
            isFirst = pdSavedObj.isFirstChange(),
            element = <HTMLElement>this.el.nativeElement,
            defaultMsg = "saved!",
            outputMsg = this.pdMessage || defaultMsg;

        if (!isFirst) {
            // update message depending on context
            this.render.setProperty(element, "innerHTML", outputMsg);

            //transition to full opacity
            this.render.setStyle(element, "opacity", "1");

            // animate message
            const listener = this.render.listen(element, "transitionend", (event) => {
                setTimeout(() => {
                    this.render.setStyle(element, "transition", "");
                    this.render.setStyle(element, "opacity", "0");

                    setTimeout(() => {
                        this.render.setStyle(element, "transition", "opacity 800ms");
                    }, 0);
                    listener();
                }, 1000);
            });
        }
    }

    ngOnDestroy(): void {
        // this.unlistener();
    }
}
