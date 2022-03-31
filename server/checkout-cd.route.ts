import { Request, Response } from 'express';
import { db, getDocData } from './database';
import { Timestamp } from '@google-cloud/firestore'
import { addDataToIdAndQuantity } from './addDataToIdAndQuantity';







const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export interface Cd {
    title: string;
    price: number;
    id?: string;
}

export interface CdDataQuantity {
    cd: Cd;
    quantity: number
}
export interface CartItem {
    cd: Cd,
    quantity: number
}

interface RequestInfo {
    cdIdsAndQuantities;
    shippingCosts: number;
    // cartItems: CartItem[]
    // cdId: string
    callbackUrl: string;
    userId: string;
}



export async function createCheckoutCdSession(req: Request, res: Response) {

    console.log('[COCdR 26]: createCheckoutCdSession invoked', req.body.shippingCosts);

    try {

        const info: RequestInfo = {
            cdIdsAndQuantities: req.body.cdIdsAndQuantities,
            shippingCosts: req.body.shippingCosts,
            // cartItems: req.body.cartItems,
            // cdId: req.body.cdId,
            callbackUrl: req.body.callbackUrl,
            userId: req["uid"]
        };
        if (!info.userId) {
            const message = 'User must be authenticated.';
            console.log(message);
            res.status(403).json({ message });
            return;
        }

        

        const purchaseSession = await db.collection('purchaseSessions').doc();
        const checkoutSessionData: any = {
            status: 'ongoing',
            created: Timestamp.now(),
            userId: info.userId
        }

        // if (info.cdIdsAndQuantities) {
        //     checkoutSessionData.cds = info.cdIdsAndQuantities;
        // }

        if (info.cdIdsAndQuantities) {
            checkoutSessionData.cdIdsAndQuantities = info.cdIdsAndQuantities
        }
        // console.log('[COCdR 54] CHECKOUTSESSIONDATA: ', checkoutSessionData);

        await purchaseSession.set(checkoutSessionData);

        const user = await getDocData(`users/${info.userId}`)

        let sessionConfig,
            stripeCustomerId = user ? user.stripeCustomerId : undefined;

        if (info.cdIdsAndQuantities) {
            // console.log('[COR 90]: ', info.cdIdsAndQuantities);
            // const cd = await getDocData(`cds/${info.cdId}`);

            const lineItems = await addDataToIdAndQuantity(req.body.cdIdsAndQuantities)
                .then((cdsWithQuantity: any) => {
                    console.log('cd: 57 cdsWithQuantity ', cdsWithQuantity)
                    return createLineItems(cdsWithQuantity.cds, req.body.shippingCosts)
                })
                .catch(err => console.log('[COR 94]', err));


            sessionConfig = setupPurchaseCdSession(
                info,
                // cd,
                lineItems,
                purchaseSession.id,
                stripeCustomerId,
                
            )
        }

        const session = await stripe.checkout.sessions.create(sessionConfig);

        res.status(200).json({
            stripeCheckoutSessionId: session.id,
            stripePublicKey: process.env.STRIPE_PUBLIC_KEY
        })
    }
    catch (error) {
        console.log('[COR 118]', error);
    }
    // res.status(500).json({
    //     error: req["uid"],
    // });
}

function setupPurchaseCdSession(info: RequestInfo, lineItems, sessionId: string, stripeCustomerId: string) {


    const config: any = {
        payment_method_types: ["card", "ideal"],
        success_url: `${info.callbackUrl}/?purchaseResult=success&ongoingPurchaseSessionId=${sessionId}`,
        cancel_url: `${info.callbackUrl}/?purchaseResult=failed`,
        client_reference_id: sessionId,
        line_items: lineItems,
        metadata: {
            grandTotal: 45
        }
    }
    console.log('[COR 143]', config.success_url);

    if (stripeCustomerId) {
        config.customer = stripeCustomerId
    }
    return config
}

function createLineItems(cdsWithQuantity, shippingCosts) {

    console.log('[CO 146]shippingCosts', shippingCosts);

    let lineItems = []
    cdsWithQuantity.forEach((cdWithQuantity: any) => {
        // console.log('CO 144', cdWithQuantity)
        lineItems.push({
            name: cdWithQuantity.title,
            description: 'new cd',
            amount: (cdWithQuantity.price * 100).toFixed(),
            currency: "eur",
            quantity: cdWithQuantity.quantity
        })
    })
    lineItems.push({
        name: 'Shipping Costs',
        description: 'Shipping Costs',
        amount: shippingCosts * 100,
        currency: "eur",
        quantity: 1
    })
    console.log('[165]: ', lineItems);
    return lineItems;
}

