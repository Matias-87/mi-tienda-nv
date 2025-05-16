import { FormControl } from "@angular/forms";

export interface SignUpForm {
    email: FormControl<string>;
    password: FormControl<string>;
    storeName: FormControl<string>;
}

export interface LogInForm {
    email: FormControl<string>;
    password: FormControl<string>;
}