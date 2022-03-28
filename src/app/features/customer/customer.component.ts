import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { Cd } from 'app/core/interfaces/cd';
import { Customer } from 'app/core/interfaces/customer';
import { CdsService } from 'app/core/services/cds.service';

import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { SignupPageDialogComponent } from '../auth/signup-page-dialog/signup-page-dialog.component';
import { CdDialogComponent } from '../cds/cd-dialog/cd-dialog.component';
import { CustomerService } from './../../core/services/customer.service';


@Component({
    selector: 'customer',
    templateUrl: './customer.component.html',
    styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

    constructor(
        private customerService: CustomerService,
        private afAuth: AngularFireAuth,
        private authService: AuthService,
        private dialog: MatDialog,
        private cdsService: CdsService


    ) { }

    orders$: Observable<any>
    // customer: Customer;
    customer$: Observable<any>

    ngOnInit(): void {
        this.authService.customerChanged.subscribe((customer: Customer) => {
            if (!customer) {
                console.log('no customer');
                this.customer$ = null;
            }
        });

        this.afAuth.authState.subscribe(state => {
            if (state) {
                console.log(state.uid)
                this.customer$ = this.authService.getCustomer(state.uid);

            } else {
                console.log('no state');
            }
        })
    }
    onUpdateCustomer(customer) {
        const dialogRef = this.dialog.open(SignupPageDialogComponent, {
            data: {
                customer: customer
            }
        });
        dialogRef.afterClosed().subscribe((customer: Customer) => {
            if (customer) {
                this.afAuth.user.subscribe(user => {
                    this.customerService.updateCustomer(user.uid, customer).then(data => {
                        console.log(data);
                        this.acualizeCustomer()
                    })
                })
            }
        })
    }

    onCdInfo(cd) {
        this.cdsService.getCdById(cd.id).then((cd: Cd) => {
            console.log(cd);
            this.dialog.open(CdDialogComponent, {
                width: '25rem',
                data: {cd},
                autoFocus: false,
                maxHeight: '90vh'
            })
        })
        
    }

    acualizeCustomer() {
        this.afAuth.user.subscribe(user => {
            if (user) {
                console.log(user.uid);
                this.customer$ = this.customerService.getCustomerByUid(user.uid)
            } else {
                console.log('no user')
                this.customer$ = null;
            }
        })
    }

}
