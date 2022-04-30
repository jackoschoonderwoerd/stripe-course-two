import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { CartItem } from 'app/core/interfaces/cart-item';
import { Customer } from 'app/core/interfaces/customer';
import { CdsService } from 'app/core/services/cds.service';
import { AuthService } from 'app/features/auth/auth.service';
import { Observable } from 'rxjs';
import { NavigationService } from '../navigation.service';
import { CheckoutService } from './../../checkout/checkout.service';

@Component({
    selector: 'header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    @Output() sidenavToggle = new EventEmitter<void>()
    @Output() toggleFilter = new EventEmitter<void>()

    constructor(
        private router: Router,
        private checkoutService: CheckoutService,
        private authService: AuthService,
        private cdsService: CdsService,
        private navigationService: NavigationService,
        ) { }


    cartItemsLength: number = 0;
    customer: Customer;
    viewCovers: boolean = false;
    viewList: boolean = true;
    filterActive: boolean = false;
    cdsViewOptionsVisible: boolean = false;


    ngOnInit(): void {
        
        if(window.location.pathname === '/cds') {
            console.log(window.location.pathname);
            this.cdsViewOptionsVisible = true;
        } else {
            console.log(window.location.pathname);
        }
        this.checkLocalStorage();
        this.navigationService.cdsViewOptionsVisible.subscribe((cdsViewOptionsVisible: boolean) => {
            this.cdsViewOptionsVisible = cdsViewOptionsVisible
        })
        this.authService.customerChanged.subscribe((customer: Customer) => {
            if (customer) {
                this.customer = customer;
                console.log(customer)
            } else {
                this.customer = null;
            }
        })
        this.checkoutService.cartItemsChanged.subscribe(((cartItems: CartItem[]) => {
            console.log(cartItems)
            this.cartItemsLength = cartItems.length;
        }))
    }
    onCartItemsLength() {
        this.router.navigate(['/checkout'])
    }
    onMenu() {
        console.log('onMenu')
        this.sidenavToggle.emit();
    }

    cdsSelected() {
        this.cdsViewOptionsVisible = true;
    }

    onFilter() {
        this.cdsService.getCdsByQueryString(null)
        this.filterActive = !this.filterActive
        // console.log('filter');
        this.toggleFilter.emit();
    }
    onViewType(viewType: string) {
        console.log(viewType)
        if(viewType === 'covers') {
            this.viewCovers = true;
            this.viewList = false;
        } else if(viewType === 'list') {
            this.viewCovers = false;
            this.viewList = true;
        }
        
        this.cdsService.setViewType(viewType)
    }
    onLogOut() {
        this.authService.logout();
    }
    checkLocalStorage() {
        if (localStorage.getItem('customer')) {
            this.customer = JSON.parse(localStorage.getItem('customer'));
        }
        if (localStorage.getItem('cartItems')) {
            this.cartItemsLength = JSON.parse(localStorage.getItem('cartItems')).length;
        }
    }

    onShoppingBasket(e) {
        console.log(e.target.outerText);
        this.checkLinkIfCds(e)
        // this.navigationService.cdsViewOptionsVisible.emit(false);
        this.navigationService.showFilter.emit(false)
    }

    onAccount(e) {
        this.checkLinkIfCds(e)
        this.navigationService.showFilter.emit(false);
    }

    onHome(e) {
        this.checkLinkIfCds(e)
        this.navigationService.showFilter.emit(false);
    }

    checkLinkIfCds(e) {
        console.log(e.target.outerText);
        if(e.target.outerText.toLowerCase() === 'cds') {
            this.cdsViewOptionsVisible = true;
        } else {
            this.cdsViewOptionsVisible = false;
        }
        this.filterActive = false;
    }

}
