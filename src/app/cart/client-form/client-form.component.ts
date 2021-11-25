import {
    Component,
    ElementRef,
    OnInit,
    TemplateRef,
    ViewChild,
    AfterViewInit,
    Input,
    Output,
    EventEmitter
} from "@angular/core";

import {
    FormControl,
    FormBuilder,
    FormGroup,
    Validators,
    AbstractControl,
    ValidationErrors
} from "@angular/forms";
import { NgbPopoverWindow } from "@ng-bootstrap/ng-bootstrap/popover/popover";
import { timer } from "rxjs";

// import { createPopper } from "@popperjs/core";
// import { NgbPopover } from "@ng-bootstrap/ng-bootstrap";
import { debounce, map, tap } from "rxjs/operators";
import { HelperTextComponent } from "../helper-text/helper-text.component";

@Component({
    selector: "client-form",
    templateUrl: "./client-form.component.html",
    styleUrls: ["./client-form.component.css"]
})
export class ClientFormComponent implements OnInit {
    profileForm!: FormGroup;

    @Input()
    cartItemsCount: number = 0;

    @Output()
    submitEvent = new EventEmitter<submitFormRequest>();

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        // lets gooo...
        this.setInitHeights();

        this.profileForm = this.fb.group({
            fullName: ["", [Validators.required, Validators.minLength(3)]],
            address: ["", [Validators.required, Validators.minLength(6)]],
            creditcard: ["", [Validators.required, Validators.pattern("^[0-9]{16}$")]]
        });
    }
    //requiredPattern
    // ngAfterViewInit(): void {}

    /**
     * this hardcodes its actual heights so it can be used with transitions later
     */
    private setInitHeights(): void {
        const node = document.querySelectorAll<HTMLElement>(".mb-3");

        node.forEach((thisDiv) => {
            const initialHeight = thisDiv.offsetHeight,
                initialTransition = thisDiv.style.transition;

            // remove any transitions for the moment
            thisDiv.style.transition = "";

            // set its actual height hardcoded (needs to be for transitions to work later)
            thisDiv.style.height = initialHeight + "px";
            thisDiv.setAttribute("initialHeight", initialHeight + ""); // saved for later

            // put back any transition setting it had
            thisDiv.style.transition = initialTransition;
        });
    }

    get f() {
        return this.profileForm;
    }

    onFocus(element: HTMLElement, helper: HelperTextComponent): void {
        const inputElement = element,
            mb3ParentElement = <HTMLElement>inputElement.parentElement,
            isWindowOpen = mb3ParentElement.getAttribute("content-open") == "open";

        const ctrl = <FormControl>this.profileForm.controls[helper.sourceRef];
        helper.init(ctrl.valueChanges);

        setTimeout(() => {
            !isWindowOpen && this.expandSection(mb3ParentElement);
        }, 0);
    }

    onBlur(element: HTMLElement, helper: HelperTextComponent): void {
        const inputElement = element,
            mb3ParentElement = <HTMLElement>inputElement.parentElement;

        helper.destroy();

        this.collapseSection(mb3ParentElement);

        // const parentElement = element.parentElement as HTMLElement;
        // this.collapseSection(parentElement).then((_) => {
        //     this.template = null;
        // });
    }

    private expandSection(element: HTMLElement): void {
        const transitionEnd =
            "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend";

        // get the height of the element's inner content, regardless of its actual size
        var sectionHeight = element.scrollHeight + 5;

        // have the element transition to the height of its inner content
        element.style.height = sectionHeight + "px";

        element.addEventListener(transitionEnd, function removeFunc() {
            element.style.height = "initial";
            element.removeEventListener(transitionEnd, removeFunc);
        });

        // mark the section as "currently not collapsed"
        element.setAttribute("content-open", "open");
    }

    private collapseSection(element: HTMLElement) {
        // return new Promise((resolve) => {
        const initHeight = element.getAttribute("initialHeight");

        // get the height of the element's inner content, regardless of its actual size
        var sectionHeight = element.scrollHeight;

        // temporarily disable all css transitions
        var elementTransition = element.style.transition;
        element.style.transition = "";

        // on the next frame (as soon as the previous style change has taken effect),
        // explicitly set the element's height to its current pixel height, so we
        // aren't transitioning out of 'auto'
        requestAnimationFrame(function () {
            element.style.height = sectionHeight + "px";
            element.style.transition = elementTransition;

            // on the next frame (as soon as the previous style change has taken effect),
            // have the element transition back to its initial height
            requestAnimationFrame(function () {
                element.style.height = initHeight + "px";
                // resolve(true);
            });
        });

        // mark the section as "currently collapsed"
        element.setAttribute("content-open", "closed");
        // });
    }

    onValidate(validationResponse: OnValidateResponse): void {
        const openElement = <HTMLElement>document.querySelector("div[content-open=open]"),
            isValid = validationResponse.valid,
            classList = { true: "green", false: "red" };

        // reset and remove any classes from the classList
        Object.values(classList).forEach((thisClass) =>
            openElement.classList.remove(thisClass)
        );

        openElement.classList.add(classList[isValid ? "true" : "false"]);
        // console.log(JSON.stringify(validationResponse));
    }

    onSubmit(): void {
        const formValues = this.profileForm.value,
            fullName = formValues["fullName"],
            address = formValues["address"];

        const request: submitFormRequest = {
            fullName,
            address
        };

        this.submitEvent.emit(request);
    }
}

export type OnValidateResponse = {
    source: string;
    valid: boolean;
};

export type submitFormRequest = {
    orderId?: number;
    fullName: string;
    address: string;
};
