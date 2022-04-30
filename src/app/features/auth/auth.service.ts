import { EventEmitter, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { CartItem } from 'app/core/interfaces/cart-item';
import { Customer } from 'app/core/interfaces/customer';
import { CustomerService } from 'app/core/services/customer.service';
import { convertSnaps } from './../../services/db-utils'
import { concatMap, finalize, catchError, last, tap, map } from 'rxjs/operators';
import { CheckoutService } from './../checkout/checkout.service'
import { Router } from '@angular/router';
import { Order } from './../../core/interfaces/order'



@Injectable({
    providedIn: 'root'
})
export class AuthService {

    isLoggedIn = new EventEmitter<boolean>();
    isAdmin = new EventEmitter<boolean>();
    customer: Customer;
    customerChanged = new EventEmitter<Customer>();

    uid: string
    cartItemsLength: number;

    constructor(
        private afAuth: AngularFireAuth,
        private db: AngularFirestore,
        private customerService: CustomerService,
        private checkoutService: CheckoutService,
        private router: Router

    ) { }

    signUp(email: string, password: string) {
        return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
            .then((data: any) => {
                console.log(data.user)
                const uid = data.user.uid
                this.db.collection('customers').doc(uid).get().subscribe(data => {
                    console.log(data.data());
                    
                    this.emitCustomerData(uid)
                })
                return uid
            })
    }

    login(email: string, password: string) {
        return this.afAuth.auth.signInWithEmailAndPassword(email, password)
            .then(data => {
                console.log(data.user.uid)
                this.uid = data.user.uid
                if (data.user.uid === 'OsZTBYWyXnQQ7rzN0TIoAByDSCI3') {
                    this.isAdmin.emit(true);
                }
                this.customerService.getCustomerByUid(data.user.uid);
                this.emitCustomerData(data.user.uid);
            })
    }

    logout() {
        if (this.checkoutService.getCartItems().length != 0) {
            console.log(this.checkoutService.getCartItems().length)
            if (!confirm('Are you sure, there are still items in you cart')) {
                return
            }
            // this.checkoutService.emptyCart()
        }
        this.customerService.getCustomerByUid(null)
        this.checkoutService.emptyCart();
        localStorage.removeItem('customer');
        localStorage.removeItem('cartItems');
        this.router.navigate(['cds'])
        this.customerChanged.emit(null);
        this.afAuth.auth.signOut();
    }


    emitCustomerData(uid) {
        this.db
            .collection('customers')
            .doc(uid)
            .get()
            .subscribe((data: any) => {
                console.log(data.data().firstName);
                const customer: Customer = data.data();
                console.log(customer)
                localStorage.setItem('customer', JSON.stringify(customer));
                this.customerChanged.emit(customer)
            })
    }
    getCustomer(uid) {
        // console.log(uid);
        return this.db.collection('customers')
            .doc(uid)
            .snapshotChanges()
            .pipe(
                map((snaps: any) => {
                    const customer: Customer = {
                        firstName: snaps.payload.data().firstName,
                        lastName: snaps.payload.data().lastName,
                        email: snaps.payload.data().email,
                        street: snaps.payload.data().street,
                        houseNumber: snaps.payload.data().houseNumber,
                        addition: snaps.payload.data().firstName,
                        zipCode: snaps.payload.data().zipCode,
                        city: snaps.payload.data().city,
                        country: snaps.payload.data().country,
                        orders: snaps.payload.data().orders
                    }
                    customer.orders.sort((a: any, b: any) => {
                        return a.dateOrdered > b.dateOrdered ? -1 : 1})
                    return customer
                }

                )
            )
    }
}
