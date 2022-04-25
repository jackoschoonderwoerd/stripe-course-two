
// 10.06 create server.ts
// 11.01 import express
import * as express from 'express';
// 11.02 import Application
import { Application } from 'express';
// import { createCheckoutSession } from './checkout.route';
import { getUserMiddleware } from './get-user.middleware';
// import { stripeWebhooks } from './stripe-webhooks.route';
import * as cors from "cors";
import { createCheckoutCdSession } from './checkout-cd.route';
import { stripeCdWebhooks } from './stripe-cd-webhooks.route';


// 10.07 initServer()
export function initServer() {

    // 12.07 require body-parser
    const bodyParser = require('body-parser');

    // 11.03 create app, type Application
    const app: Application = express();

    // 51.00 USE CORS
    // 51.00 APP.YAML
    app.use(cors());

    // 11.04 create route and create a response that will be sent back to the client that will be displayed in the browser, so that we can see that the server is active
    app.route('/').get((req, res) => {

        res.status(200).send('<h1>API is up and running! version 12</h1>');
    });

    // 12.04 create checkout route

    app.route("/api/checkout-cd").post(

        // 12.06 call getUserMiddleWare() in get-user.midlleware.ts
        // 12.05 call createCheckoutSession() in checkout.route.ts
        // 12.08 add bodyparser. These are not arguments; this is a chain of functions
        // 27.05 pass the incomming request through getUserMiddleware() before it gets passed on to createCheckoutSession()
        bodyParser.json(), getUserMiddleware, createCheckoutCdSession);


    // 30.01 create route "/stripe-webhooks" This will take care of all the post-requests comming directly from stripe.
    app.route("/stripe-webhooks").post( // 31.00 add bodyparser
        bodyParser.raw({ type: 'application/json' }), stripeCdWebhooks);
    // stripeWebhooks);

    // 11.05 create the name of the port by using .env, if undefined, use 9000
    const PORT = process.env.PORT || 9000;

    // 11.06 start the express server
    app.listen(PORT, () => {
        // 11.07 check the command line. For any changes to be effective, the distfolder needs to be rebuilt.
        // 11.08 in order to create a new version; delete the current dist folder and run npm run build (=> package.json: ""tsc -P ./server.tsconfig.json""); node dist/main.ts
        console.log("VERSION 3 HTTP REST API Server running at port " + PORT);
    })
}


