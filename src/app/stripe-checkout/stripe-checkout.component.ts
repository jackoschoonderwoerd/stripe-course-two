// 18.02 strike-checkout component

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StripeCheckoutService } from 'app/services/stripe-checkout.service';
import {CheckoutService } from './../features/checkout/checkout.service'

@Component({
    selector: 'stripe-checkout',
    templateUrl: './stripe-checkout.component.html',
    styleUrls: ['./stripe-checkout.component.scss']
})
export class StripeCheckoutComponent implements OnInit {

    message = "Waiting for purchase to complete...";

    waiting = true;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private stripeCheckout: StripeCheckoutService,
        private checkoutService: CheckoutService) {
        
    }

    ngOnInit() {
        const result = this.route.snapshot.queryParamMap.get('purchaseResult');
        console.log(result)

        if (result == "success") {
            const ongoingPurchaseSessionId = this.route.snapshot.queryParamMap.get('ongoingPurchaseSessionId');
            // TODO empty cart clear localstorage
            this.checkoutService.emptyCart();
            this.stripeCheckout.waitForPurchaseCompleted(ongoingPurchaseSessionId)
                .subscribe(
                    (res) => {
                        console.log(res);
                        this.checkoutService.emptyCart();
                        this.waiting = false;
                        this.message = "Purchase SUCCESSFUL, redirecting...";
                        
                        setTimeout(() => {
                            this.router.navigateByUrl('/cds')
                        }, 3000);
                    }
                );

        } else {
            this.waiting = false;
            this.message = "Purchase CANCELLED or FAILED, redirecting..."
            setTimeout(() => {
                this.router.navigateByUrl('/orders')
            }, 3000);
        }
    }
}
