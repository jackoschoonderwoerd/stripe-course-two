import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CartItem } from './core/interfaces/cart-item';
import { CheckoutService } from './features/checkout/checkout.service';
import { CustomerService } from './core/services/customer.service';
import { AuthService } from './features/auth/auth.service';
import { User } from 'firebase';
import { Customer } from './core/interfaces/customer';
import { MatDialog } from '@angular/material/dialog';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';
import { NavigationService } from './features/navigation/navigation.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    isLoggedIn$: Observable<boolean>;

    customer: any;

    

    isLoggedOut$: Observable<boolean>;

    pictureUrl$: Observable<string>;
    showFilter: boolean = false
    cartItemsLength: number = 0;

    constructor(
        private afAuth: AngularFireAuth,
        private checkoutService: CheckoutService,
        private router: Router,
        private customerService: CustomerService,
        private authService: AuthService,
        private dialog: MatDialog,
        private navigationService: NavigationService
    ) {
        // afAuth.idToken.subscribe(jwt => console.log(jwt))
    }

    ngOnInit() {
        this.navigationService.showFilter.subscribe((showFilter: boolean) => {
            this.showFilter = showFilter;
            console.log(this.showFilter)
        })

        // this.dialog.open(DisclaimerComponent, {
        //     height: '100vh',
        //     minWidth: '320px',
        //     maxWidth: '500px'
        // });
        this.authService.customerChanged.subscribe((customer: Customer) => {
            this.customer = customer;
        });
        if(localStorage.getItem('cartItems')) {
            this.cartItemsLength = JSON.parse(localStorage.getItem('cartItems')).length
        } else {
            this.cartItemsLength = 0;
        }
        if(localStorage.getItem('customer')) {
            this.customer = JSON.parse(localStorage.getItem('customer'))
        }
        this.checkoutService.checkLocalStorageAfterReboot();
        this.checkoutService.cartItemsChanged.subscribe((cartItems: CartItem[]) => {
            console.log('subscription', cartItems);

            this.cartItemsLength = cartItems.length;
        })
        
        this.afAuth.authState.subscribe(state => {
            if(state) {
                // console.log(state.uid);

                this.customerService.getCustomerByUid(state.uid);
            } else {
                console.log('no user');
            }
        });

        // this.isLoggedIn$ = this.afAuth.authState.pipe(map(user => !!user));

        // this.isLoggedOut$ = this.isLoggedIn$.pipe(map(loggedIn => !loggedIn));

        // this.pictureUrl$ =
        //     this.afAuth.authState.pipe(map(user => user ? user.photoURL : null));
    }

    logout() {
        this.authService.logout();
    }

    onCartItemsLenth() {
        this.router.navigate(['/checkout'])
    }

    toggleFilter() {
        console.log('toggle');
        this.showFilter = !this.showFilter
    }
}
