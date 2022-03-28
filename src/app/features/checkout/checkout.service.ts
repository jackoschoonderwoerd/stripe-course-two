import { EventEmitter, Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Cd, CdInfo } from '../../core/interfaces/cd';
import { CartItem } from '../../core/interfaces/cart-item'


@Injectable({
    providedIn: 'root'
})
export class CheckoutService {

    cartItems: CartItem[] = [];

    constructor() { }

    cartItemsChanged = new EventEmitter<CartItem[]>()

    addCdToCart(cd:Cd) {
        console.log(cd);
        this.cartItems.forEach((cartItem: CartItem) => {
            console.log(cartItem)
        })
        const index = this.cartItems.findIndex((cartItem: CartItem) => {
            return cartItem.cd.id === cd.id
        });
        console.log(index)
        if (index === -1) {
            this.cartItems.push({ cd, quantity: 1 });
        } else {
            this.cartItems[index].quantity += 1;
        }
        console.log(this.cartItems);
        this.cartItemsChanged.emit(this.cartItems);
        this.updateLocalStorage()
    }



    getCartItems() {
        console.log(this.cartItems)
        return this.cartItems;
    }

    plusOne(cdId: string) {
        this.cartItems.forEach((cartItem:any) => {
            if(cartItem.cd.id === cdId) {
                cartItem.quantity += 1
            }
        })
        this.updateLocalStorage();
        
        this.cartItemsChanged.emit(this.cartItems)
    }

    minusOne(cdId: string) {
        console.log(cdId);
        this.cartItems.forEach((cartItem:any) => {
            if(cartItem.cd.id === cdId) {
                if(cartItem.quantity > 1) {
                    cartItem.quantity -= 1
                } else {
                    const index = this.cartItems.findIndex((cartItem:any) => {
                        return cartItem.cd.id === cdId
                    })
                    this.cartItems.splice(index, 1);
                }
            }
        })
        this.updateLocalStorage();
        this.cartItemsChanged.emit(this.cartItems)
        
    }

    calculateGrandTotal() {
        let grandTotal = 0;
        this.cartItems.forEach((cartItem: CartItem) => {
            console.log(cartItem);
            grandTotal += cartItem.cd.cdInfo.price * cartItem.quantity
        })
        return grandTotal;
    }

  

    updateLocalStorage() {
        localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    }
    checkLocalStorageAfterReboot() {
        if(localStorage.getItem('cartItems')) {
            this.cartItems = JSON.parse(localStorage.getItem('cartItems'));
            this.cartItemsChanged.emit(this.cartItems);
        } else {
            this.cartItems = [];
        }
    }
    emptyCart() {
        this.cartItems = [];
        this.cartItemsChanged.emit(this.cartItems);
        console.log('emptied cart', this.cartItems);
    }

}
