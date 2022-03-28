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
    grandTotal: number = 0;
    grandTotalWithShipping: number; 
    customer$: Observable<Customer>
    purchaseStarted: boolean = false;
    isChecked: boolean = false
    delivery: string = 'by mail';
    byMail: boolean = true;
    showShippingCosts: boolean = true;
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
        console.log(this.cartItems);
        
        this.grandTotal = this.checkoutService.calculateGrandTotal();
    }


    acualizeCustomer() {
        this.afAuth.user.subscribe(user => {
            if(user) {
                console.log(user.uid);
                this.customer$ = this.customerService.getCustomerByUid(user.uid)
            } else {
                console.log('no user')
                this.customer$ = null;
            }
        })
    }

    onCheckboxChange(event) {
        console.log(event)
        this.isChecked = event.checked;
    }

    onRadioChange(e) {
        this.delivery = e.value;
        if(e.value === 'byMail') {
            this.showShippingCosts = true;
            this.grandTotalWithShipping = this.grandTotal + this.shippingCosts
        } else  {
            this.showShippingCosts = false;
            
        }
        console.log(this.showShippingCosts)
    }

    onPlaceOrder() {
        
        console.log('THIS.CARTITEMS', this.cartItems);
        const orderedCds = []
        this.cartItems.forEach((cartItem: any) => {
            orderedCds.push({cdId: cartItem.cd.id, quantity: cartItem.quantity})
        })
        // console.log(orderedCds);
        this.checkoutSessionService.startCdsCheckoutSession(
            '7bt0FfOSgnUMEKToerD9', 
            this.cartItems)
            .subscribe(
                (session: CheckoutSession) => {
                    console.log(session)
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
        this.grandTotal = this.checkoutService.calculateGrandTotal()
    }
    onMinusOne(cdId) {
        this.checkoutService.minusOne(cdId);
        this.grandTotal = this.checkoutService.calculateGrandTotal()
    }

  
    toSignUp() {
        const dialogRef = this.dialog.open(SignupPageDialogComponent, {
            width: '95vw',
            maxWidth: '500px',
            autoFocus: false,
            maxHeight: '95vh',
            
            
            
        })
        dialogRef.afterClosed().subscribe((data: any) => {
            if(data) {
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
                if(this.afAuth.idToken) {
                    console.log('user present')
                } else {
                    console.log('no user');
                }
                this.authService.signUp(data.email, data.password)
                    .then(uid => {
                        this.customerService.addCustomerDataToDb(uid, customer)
                            .then(data => {
                                console.log('customer added to firestore db')})
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
            if(loginData) {
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
            }});
        dialogRef.afterClosed().subscribe((customer: Customer) => {
            if(customer) {
                this.afAuth.user.subscribe(user => {
                    this.customerService.updateCustomer(user.uid, customer).then(data => {
                        console.log(data);
                        this.acualizeCustomer()
                    })
                })
            } 
        })
    }
}
