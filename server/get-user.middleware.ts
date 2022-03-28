// 27.00 create get-user.middleware.ts. This will
// 27.01 A check the validity of the jwt (auth) (// 28.00)
// 27.02 B pick up the jwt from the authorization header 
// 27.03 C extract jwtPayload.uid from the jwt and attaches it to the request-body under 'uid'
// 27.04 D attach this id to the request-body under 'uid'

import { Request, Response, NextFunction } from 'express'
import { auth } from './auth';

export function getUserMiddleware(req: Request, res: Response, next: NextFunction) {

    const jwt = req.headers.authorization;

    if (jwt) {
        auth.verifyIdToken(jwt) // 27.01
            .then(jwtPayload => { // 27.02
                req["uid"] = jwtPayload.uid; // 27.03 // 27.04 
                next();
            })
            .catch(error => {
                const message = 'Error verifying Firebase Id token';
                console.log(message, error);
                res.status(403).json({ message });
            });
    } else {
        next();
    }
}


function getUserData() {
    
}

