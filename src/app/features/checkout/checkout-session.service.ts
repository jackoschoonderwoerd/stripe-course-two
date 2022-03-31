import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { CheckoutSession } from '../../core/interfaces/checkout-session.model';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { CartItem } from 'app/core/interfaces/cart-item';
import { CdIdQuantity } from './../../core/interfaces/idAndQuantity'


declare const Stripe;

@Injectable({
    providedIn: 'root'
})
export class CheckoutSessionService {

    private jwtAuth: string

    constructor(
        private http: HttpClient,
        private afAth: AngularFireAuth,
        private db: AngularFirestore
    ) {
        afAth.idToken.subscribe(jwt => this.jwtAuth = jwt)
    }

    startCdsCheckoutSession(
        cdId: string,
        cartItems: CartItem[],
        shippingCosts: number
    ): Observable<CheckoutSession> {

        const cdIdsAndQuantities: CdIdQuantity[] = [];
        cartItems.forEach((cartItem: CartItem) => {
            // console.log(cartItem)
            // console.log(cartItem.cd.id);
            cdIdsAndQuantities.push({ id: cartItem.cd.id, quantity: cartItem.quantity })
        })
        // console.log('JWTAUTH: ', this.jwtAuth);
        const headers = new HttpHeaders().set("Authorization", this.jwtAuth);

        // console.log(cdId)
        // console.log(cartItems.length)
        // console.log(this.buildCallbackUrl())
        // console.log(environment.api.baseUrl);



        return this.http.post<CheckoutSession>(environment.api.baseUrl + "/api/checkout-cd", {
            // cdId: cdId,
            // cartItems,
            cdIdsAndQuantities,
            callbackUrl: this.buildCallbackUrl(),
            shippingCosts
        }, { headers })
    }


    buildCallbackUrl() {
        const protocol = window.location.protocol;
        const hostname = window.location.hostname;
        const port = window.location.port;
        let callbackUrl = `${protocol}//${hostname}`;

        if (port) {
            callbackUrl += ':' + port
        }
        callbackUrl += "/stripe-checkout";
        // console.log('Cds CALLBACKURL: ', callbackUrl)
        return callbackUrl;
    }

    redirectToCheckout(session: CheckoutSession) {
        // console.log('Cds SESSION: ', session);
        const stripe = Stripe(session.stripePublicKey);
        stripe.redirectToCheckout({
            sessionId: session.stripeCheckoutSessionId
        });
    }

    waitForPurchaseCompleted(ongoingPurchaseSessionId: string): Observable<any> {
        console.log('Cds ONGOINGPURCHASESESSIONID: ', ongoingPurchaseSessionId)
        return this.db.doc<any>(`/${ongoingPurchaseSessionId}`)
            .valueChanges()
            .pipe(
                filter(purchase => purchase.status == 'completed'),
                first()
            )
    }
}
