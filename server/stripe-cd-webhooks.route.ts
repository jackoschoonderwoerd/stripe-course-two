import { FieldValue } from '@google-cloud/firestore';
import { Request, Response } from 'express';
import { addDataToIdAndQuantity } from './addDataToIdAndQuantity';
import { db, getDocData } from './database';
import { sendEmail } from './send-email';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function stripeCdWebhooks(req: Request, res: Response) {
    console.log('[WR 13]');
    try {
        const signature = req.headers["stripe-signature"];
        // console.log('[WH 13]', req.body)
        const event = stripe.webhooks.constructEvent( 
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
        // console.log('[WR 19]', event.req.body);
        if (event.type == "checkout.session.completed") {
            const session = event.data.object;
            console.log('[SWR 19]: ', session)
            await onCheckoutSessionCompleted(session)
        } 
        res.json({ received: true });
    }
    catch (err) {
        console.log('[WR 30 ]Error processing webhook event, reason: ', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`)
    }
}

async function onCheckoutSessionCompleted(session) {
    const purchaseSessionId = session.client_reference_id;
    // console.log('[WR 32] purchaseSessionId: ', purchaseSessionId);

    // const { userId, cdIdsAndQuantities, shippingCosts} = await getDocData(`purchaseSessions/${purchaseSessionId}`);

    const { userId, cdIdsAndQuantities} = await getDocData(`purchaseSessions/${purchaseSessionId}`);

    let { shippingCosts} = await getDocData(`purchaseSessions/${purchaseSessionId}`)

    if(shippingCosts) {
        console.log('[WR 40]', shippingCosts);
    } else {
        shippingCosts = 0;
    }
    console.log('[WR 43] userId, cdId, cds: ', userId, cdIdsAndQuantities);


    if (cdIdsAndQuantities) {
        await fulfillCoursePurchase(userId, cdIdsAndQuantities,  purchaseSessionId, shippingCosts, session.customer);
        // console.log('[SWR 39]cds: ', cdIdsAndQuantities);
    }
}

async function fulfillCoursePurchase(userId: string, cdIdsAndQuantities, purchaseSessionId: string, shippingCosts, stripeCustomerId: string) {

    // console.log('[WR 40]: ', cdIdsAndQuantities);

    const completeCds: any = await addDataToIdAndQuantity(cdIdsAndQuantities, shippingCosts);





    const customer = await getDocData(`customers/${userId}`);
   
    // const purchaseSession = await getDocData(`purchaseSessions/${purchaseSessionId}`)


    const dateOrdered = Date.now().toString();

    // console.log('[WH]68: ', completeCds);
   

    customer.orders.push(
        {
            dateOrdered: dateOrdered, 
            cds:completeCds.cds,
            shippingCosts: shippingCosts,
            grandTotal: completeCds.grandTotal, 
            purchaseSessionId: purchaseSessionId 
        }
    )
  


    await sendEmail(userId, cdIdsAndQuantities, shippingCosts).then(res => console.log('[WR 42] : EMAIL SENT'));

    const batch = db.batch();

    const customerRef = db.doc(`customers/${userId}`)
    batch.update(customerRef, {orders: customer.orders})

    const purchaseSessionRef = db.doc(`purchaseSessions/${purchaseSessionId}`);

    // console.log('[WR 80]: ', purchaseSessionRef);

    batch.update(purchaseSessionRef, { status: "completed" });

    
    


    const date = Date.now();

    // const ordersRef = db.doc(`customers/${userId}/orders/${date}/orderedCds/${cdId}`)
    // batch.create(ordersRef, {})

    

    const userRef = db.doc(`users/${userId}`);
    batch.set(userRef, { stripeCustomerId }, { merge: true })

    return batch.commit()

    
}



