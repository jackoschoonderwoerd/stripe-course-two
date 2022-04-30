import { Component, EventEmitter, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CartItem } from 'app/core/interfaces/cart-item';
import { Cd } from 'app/core/interfaces/cd';
import { AuthService } from 'app/features/auth/auth.service';
import { CdsService } from 'app/core/services/cds.service';
import { CheckoutService } from './checkout.service';
import { Observable } from 'rxjs';
import { LoginPageDialogComponent } from '../auth/login-page-dialog/login-page-dialog.component';
import { SignupPageDialogComponent } from '../auth/signup-page-dialog/signup-page-dialog.component';
import { Customer } from './../../core/interfaces/customer';
import { CustomerService } from './../../core/services/customer.service'
import { CheckoutSessionService } from './checkout-session.service'
import { CheckoutSession } from 'app/core/interfaces/checkout-session.model';
import { Router } from '@angular/router';
import { PickUpInfoDialogComponent } from './pick-up-info-dialog/pick-up-info-dialog.component';

@Component({
    selector: 'checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

    signUpForm: FormGroup
    cartItems: CartItem[]
    cds: Cd[] = []
    cds$: Observable<Cd[]>
    totalCds: number = 0;
    totalWithShipping: number;
    customer$: Observable<Customer>
    purchaseStarted: boolean = false;
    isOrderCheckboxChecked: boolean = false
    isCustomerInfoCheckboxChecked: boolean = false;
    // delivery: boolean = false;
    // byMail: boolean = true;
    // shippingCosts: boolean = true;
    // shipping: boolean = true;
    shippingCosts: number = 4.5;

    constructor(
        private checkoutService: CheckoutService,
        private checkoutSessionService: CheckoutSessionService,
        private cdsService: CdsService,
        private dialog: MatDialog,
        private authService: AuthService,
        private customerService: CustomerService,
        private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.checkoutService.cartItemsChanged.subscribe(cartItems => {
            this.cartItems = cartItems
        })
        this.acualizeCustomer()
        this.cartItems = this.checkoutService.getCartItems();
        // console.log(this.cartItems);

        this.totalCds = this.checkoutService.calculateGrandTotal();
    }


    acualizeCustomer() {
        this.afAuth.user.subscribe(user => {
            if (user) {
                // console.log(user.uid);
                this.customer$ = this.customerService.getCustomerByUid(user.uid)
            } else {
                console.log('no user')
                this.customer$ = null;
            }
        })
    }

    onCustomerInfoCheckboxChange(event) {
        this.isCustomerInfoCheckboxChecked = event.checked;
    }

    onOrderCheckboxChange(event) {
        // console.log(event)
        this.isOrderCheckboxChecked = event.checked;
    }

    onShippingOptionChange(e) {
        console.log(e.value);
        if (e.value == 'shipping') {
            this.shippingCosts = 4.5;
        } else {
            this.shippingCosts = 0;
        }
    }
    onPickUp() {
        this.dialog.open(PickUpInfoDialogComponent)
    }

    onPlaceOrder() {

        // console.log('THIS.CARTITEMS', this.cartItems);
        const orderedCds = []
        this.cartItems.forEach((cartItem: any) => {
            orderedCds.push({ cdId: cartItem.cd.id, quantity: cartItem.quantity })
        })
        // console.log(orderedCds);
        this.checkoutSessionService.startCdsCheckoutSession(
            '7bt0FfOSgnUMEKToerD9',
            this.cartItems, 
            this.shippingCosts)
            .subscribe(
                (session: CheckoutSession) => {
                    // console.log(session)
                    this.checkoutSessionService.redirectToCheckout(session)
                },
                err => {
                    console.log('Error creating checkout session', err)
                    this.purchaseStarted = false;
                }

            )
    }

    onContinue() {
        this.router.navigate(['check-user-data'])
    }

    onPlusOne(cdId) {
        this.checkoutService.plusOne(cdId);
        this.totalCds = this.checkoutService.calculateGrandTotal()
    }
    onMinusOne(cdId) {
        this.checkoutService.minusOne(cdId);
        this.totalCds = this.checkoutService.calculateGrandTotal()
    }


    toSignUp() {
        const dialogRef = this.dialog.open(SignupPageDialogComponent, {
            width: '95vw',
            maxWidth: '500px',
            minWidth: '320px',
            autoFocus: false,
            maxHeight: '95vh',
        })

        dialogRef.afterClosed().subscribe((data: any) => {
            if (data) {
                console.log(data)
                const customer: Customer = {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    street: data.street,
                    zipCode: 'TODO',
                    houseNumber: data.houseNumber,
                    addition: data.addition,
                    city: data.city,
                    country: data.country,
                    orders: []
                }
                if (this.afAuth.idToken) {
                    console.log('user present')
                } else {
                    console.log('no user');
                }
                this.authService.signUp(data.email, data.password)
                    .then(uid => {
                        this.customerService.addCustomerDataToDb(uid, customer)
                            .then(data => {
                                console.log('customer added to firestore db')
                            })
                            .catch(err => console.log(err));
                    })
                    .catch(err => console.log(err));
            }
        })
    }

    toLogIn() {
        const dialogRef = this.dialog.open(LoginPageDialogComponent, {
            width: '95vw',
            maxWidth: '500px',
            autoFocus: false,
            maxHeight: '90vh',
        })
        dialogRef.afterClosed().subscribe((loginData) => {
            if (loginData) {
                console.log(loginData)
                this.authService.login(loginData.email, loginData.password)
                    .catch(err => {
                        console.log(err)
                        alert(err.message);
                    });
            }

        })
    }

    onUpdateCustomer(customer) {
        const dialogRef = this.dialog.open(SignupPageDialogComponent, {
            data: {
                customer: customer
            },
            width: '95vw',
            maxWidth: '500px',
            minWidth: '320px',
            autoFocus: false,
            maxHeight: '95vh',

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
    getCustomerInfoCheckboxColor() {
        return this.isCustomerInfoCheckboxChecked ? 'green' : 'red'; 
    }
    getOrderInfoCheckboxColor() {
        return this.isOrderCheckboxChecked ? 'green' : 'red'; 
    }
}
