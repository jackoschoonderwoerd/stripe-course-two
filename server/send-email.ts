import  { firestore, User } from 'firebase';
import { db, getDocData } from './database';
import * as sgMail from '@sendgrid/mail';
import { addDataToIdAndQuantity, CdDataQuantity, CdIdQuantity } from './addDataToIdAndQuantity';
import { createEmail } from './createHtml';

const fs = require("fs");

// const pathToAttachment = `${__dirname}/attachment.pdf`;
// const attachment = fs.readFileSync(pathToAttachment).toString("base64")

const admin = require('firebase-admin');

export async function sendEmail(userId: string, cds, shippingCosts) {

    // console.log('[SE 13]CDS: ', cds)

    const cdsWithQuantity = await addDataToIdAndQuantity(cds, shippingCosts)

    const customerData = await getDocData(`customers/${userId}`)

    // console.log('SE 17: ', userData);shipping-costs

    

    return admin.auth().getUser(userId)
        
        .then((user: User) => {
            console.log('[SE 11] USER.EMAIL: ', user.email);
            // sgMail.setApiKey(process.env.SENDGRID_API)
            const numbers = [1,2,3]
            sgMail.setApiKey(process.env.SENDGRID_API)
            const msg = {
                to: user.email,
                from: 'jackoboes@gmail.com', // this has to be the 'single sender verification' (sendgrid => settings => sender authentication)
                subject: 'muSubject',
                text: 'myText',
                // templateId: process.env.SENDGRID_TEMPLATE_ID,
                html: createHtml(cdsWithQuantity, customerData, shippingCosts),
                // attachments: [{
                //     content: attachment,
                //     filename: "attachment.pdf",
                //     type: "application/pdf",
                //     disposition: "attachment"
                // }]

            };
            return sgMail.send(msg)
                // .then(res => console.log('[SE 23] RES: mail sent',))
                .catch(err => console.log('[SE 24] ERR: ', err.response.body));
        })
}



function createHtml(cdsWithQuantity, userData, shippingCosts) {
    return createEmail(cdsWithQuantity, userData, shippingCosts)
}


