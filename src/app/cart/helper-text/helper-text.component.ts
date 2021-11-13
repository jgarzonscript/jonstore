import {
    Component,
    OnInit,
    ContentChild,
    TemplateRef,
    ViewChild,
    Input,
    OnChanges,
    SimpleChanges,
    Output,
    EventEmitter
} from "@angular/core";
import { FormControl, FormGroup, ValidationErrors } from "@angular/forms";
import { Observable, Subscription, timer } from "rxjs";
import { debounce, tap } from "rxjs/operators";
import { OnValidateResponse } from "../client-form/client-form.component";

@Component({
    selector: "helper-text",
    templateUrl: "./helper-text.component.html",
    styleUrls: ["./helper-text.component.css"]
})
export class HelperTextComponent implements OnInit, OnChanges {
    /**
     * type of control, I.E: fullname, address, etc...
     */
    @Input() sourceRef!: string;

    /**
     * this formgroup is provided from the parent
     * component formgroup
     */
    @Input() formGroup!: FormGroup;

    /**
     * this gets emitted when validation is complete
     *
     * parent use for styling
     */
    @Output() onValidateEvent = new EventEmitter<OnValidateResponse>();

    /**
     * provide the different types of validators and its output text
     *
     * example:
     * - ["required", "this field is required"]
     * - ["minlength", "this field has a minimum length of 3 characters"]
     */
    @Input()
    validatorsAndMessages: [string, string][] = [];

    /**
     * provide the initial text (instructions) to display when on element focus
     */
    @Input()
    instructions: string = "";

    private helperText!: HelperText;
    private sub!: Subscription;
    content!: string;
    formControl!: FormControl;
    private _lastKnownError: string = "";

    constructor() {}

    ngOnInit(): void {
        // initialize the helper class

        this.helperText = new HelperText(this.instructions, this.validatorsAndMessages);

        this.formControl = <FormControl>this.formGroup.get(this.sourceRef);
    }

    ngOnChanges(changes: SimpleChanges): void {
        //
    }

    init(obs$: Observable<any>): void {
        // display the initial requirements

        const isLastKnownErrorExist = this._lastKnownError.length > 0,
            lastError = this._lastKnownError,
            initialText = this.helperText.initialText;

        this.content = isLastKnownErrorExist ? lastError : initialText;

        this.sub = obs$
            .pipe(
                tap((_) => this.preValidate()),
                debounce(() => timer(500)),
                tap((_) => this.validate())
            )
            .subscribe();
    }

    destroy(): void {
        this.sub.unsubscribe();
    }

    private preValidate(): void {
        // const initialText = this.helperText.initialText,
        //     validateText = `${initialText}`;
        // this.content = validateText;
    }

    private validate(): void {
        const helperObj = this.helperText,
            initialText = helperObj.initialText;

        // reset to initial text
        // this.content = helperObj.initialText;

        let validationErrors = <ValidationErrors>this.formControl.errors,
            friendlyResponse = helperObj.getFriendlyMsg(validationErrors),
            friendlyMsg = friendlyResponse.friendlyMsg,
            friendlyMsgExist = friendlyMsg.length > 0,
            validationIsGood = !validationErrors,
            anyErrorsFound = friendlyResponse.isErrors;

        // display friendly error message
        this.content = friendlyMsgExist ? friendlyMsg : initialText;
        this._lastKnownError = friendlyMsg;

        // bubble up validation to parent
        const validateResponse: OnValidateResponse = {
            source: this.sourceRef,
            valid: validationIsGood && !anyErrorsFound
        };

        this.onValidateEvent.emit(validateResponse);
    }
}

class HelperText {
    constructor(
        // private _sourceRef: string,
        private _sourceText: string,
        // private _required?: string,
        // private _minlength?: string,
        private htErrors?: [string, string][]
    ) {}

    get initialText() {
        return this._sourceText;
    }

    private getFriendlyResponse(key: string): FriendlyErrorMsgResponse {
        let doesKeyExist = false,
            htErrors = this.htErrors,
            response = this.createErrorObject();

        doesKeyExist = <boolean>htErrors?.map((tuple) => tuple[0]).includes(key);

        if (!doesKeyExist) {
            const errorMsg = `no htError exists for key ${key}; you must add it`;
            console.log(errorMsg);
            response.isErrors = true;
            response.errorMsg = errorMsg;
            return response;
        }

        const tupleItem = <[string, string]>htErrors?.find((tuple) => tuple[0] === key),
            keyValue = tupleItem[1];

        response.friendlyMsg = keyValue;
        return response;
    }

    getFriendlyMsg(validationErrors: ValidationErrors): FriendlyErrorMsgResponse {
        if (!validationErrors) {
            // validation is valid at this point

            const friendlyErrorResponse = this.createErrorObject();
            return friendlyErrorResponse;
        }

        /* 
        there will always be only one error at a time
        in ValidationErrors -- so grab the first index */

        const vError = Object.keys(<ValidationErrors>validationErrors)[0],
            friendlyErrorResponse = this.getFriendlyResponse(vError);

        return friendlyErrorResponse;
    }

    /**
     * creates a new object of type FriendlyErrorMsgResponse
     */
    private createErrorObject(): FriendlyErrorMsgResponse {
        const Obj: FriendlyErrorMsgResponse = {
            friendlyMsg: "",
            isErrors: false,
            errorMsg: ""
        };

        return Obj;
    }
}

type FriendlyErrorMsgResponse = {
    friendlyMsg: string;
    isErrors?: boolean;
    errorMsg?: string;
};
