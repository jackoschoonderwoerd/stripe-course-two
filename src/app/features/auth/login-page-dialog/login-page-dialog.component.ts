import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'login-page-dialog',
    templateUrl: './login-page-dialog.component.html',
    styleUrls: ['./login-page-dialog.component.scss']
})
export class LoginPageDialogComponent implements OnInit {


    loginForm: FormGroup;

    constructor(
        private fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.initLoginForm();
    }
    initLoginForm() {
        this.loginForm = this.fb.group({
            email: new FormControl('jackoschoonderwoerd@yahoo.nl', [Validators.required]),
            password: new FormControl('123456', [Validators.required])
        })
    }

}
