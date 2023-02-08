import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Customer } from 'app/core/interfaces/customer';
import { CustomerService } from 'app/core/services/customer.service';
import { CdDialogComponent } from 'app/features/cds/cd-dialog/cd-dialog.component';
import { AuthService } from '../auth.service'

@Component({
    selector: 'signup-page-dialog',
    templateUrl: './signup-page-dialog.component.html',
    styleUrls: ['./signup-page-dialog.component.scss']
})
export class SignupPageDialogComponent implements OnInit {

    signUpForm: FormGroup;
    editmode: boolean = false;
    customer: Customer;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private customerService: CustomerService,
        public dialogRef: MatDialogRef<CdDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any
    ) { 
        
    }

    ngOnInit(): void {
        
        this.initSignUpForm();
        if(this.data) {
            this.customer = this.data.customer;
            console.log(this.customer)
            this.signUpForm.patchValue({
                ...this.customer,
                password: 0
            })
            this.signUpForm.updateValueAndValidity()
           
        }
    }

    initSignUpForm() {
        this.signUpForm = this.fb.group({
            firstName: new FormControl(null, [Validators.required]),
            lastName: new FormControl(null, [Validators.required]),
            email: new FormControl(null, [Validators.required]),
            street: new FormControl(null, [Validators.required]),
            houseNumber: new FormControl(null, [Validators.required]),
            addition: new FormControl(null),
            zipCode: new FormControl(null, [Validators.required]),
            city: new FormControl(null, [Validators.required]),
            country: new FormControl(null, [Validators.required]),
            password: new FormControl(null, [Validators.required]),
        })
    }
}
