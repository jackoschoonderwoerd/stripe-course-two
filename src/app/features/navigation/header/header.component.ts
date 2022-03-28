import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { CartItem } from 'app/core/interfaces/cart-item';
import { Customer } from 'app/core/interfaces/customer';
import { AuthService } from 'app/features/auth/auth.service';
import { Observable } from 'rxjs';
import { CheckoutService } from './../../checkout/checkout.service';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() sidenavToggle = new EventEmitter<void>()

  constructor(
    private router: Router,
    private checkoutService: CheckoutService,
    private authService: AuthService,
    private afAuth: AngularFireAuth  ) { }
    

  cartItemsLength: number = 0;
  customer: Customer
  

  ngOnInit(): void {
    this.checkLocalStorage();
   
    this.authService.customerChanged.subscribe((customer: Customer) => {
      if(customer) {
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
  onLogOut() {
    this.authService.logout();
  }
  checkLocalStorage() {
    if(localStorage.getItem('customer')) {
      this.customer = JSON.parse(localStorage.getItem('customer'));
    }
    if(localStorage.getItem('cartItems')) {
      this.cartItemsLength = JSON.parse(localStorage.getItem('cartItems')).length;
    }
  }
}
