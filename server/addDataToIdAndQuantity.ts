
import { getDocData } from "./database";



export interface CdIdQuantity {
    id: string;
    quantity: number
}

export interface CdDataQuantity {
    id?: string,
    title: string,
    price: number,
    bandName: string
    quantity: number
}


export function addDataToIdAndQuantity(cdIdsQuantities: CdIdQuantity[]) {
    // console.log('[AD 25]: ', cdIdsQuantities);
    let cdsIdDataQuantity: CdDataQuantity[] = [];
    let grandTotal: number = 0
    const cdIdsQuantitiesLength = cdIdsQuantities.length
    return new Promise((resolve, reject) => {
        cdIdsQuantities.forEach((cdIdQuantity: CdIdQuantity) => {
            // console.log('[AD 30]: ', cdIdQuantity);
            getDocData(`cds/${cdIdQuantity.id}`)
            .then(cd => {
                grandTotal = grandTotal + cd.cdInfo.price * cdIdQuantity.quantity;
                console.log('[AD 33]GRANDTOTAL: ', grandTotal);
                cdsIdDataQuantity.push(
                    {
                        id: cdIdQuantity.id,
                        title: cd.cdInfo.title,
                        price: cd.cdInfo.price,
                        bandName: cd.cdInfo.bandName,
                        quantity: cdIdQuantity.quantity    
                    }
                );
                if(cdsIdDataQuantity.length == cdIdsQuantitiesLength) {
                    // resolve(cdsIdDataQuantity);
                    resolve({cds: cdsIdDataQuantity, grandTotal: grandTotal});
                } 
            })
        })
    })
}