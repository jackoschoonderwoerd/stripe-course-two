import { CdDataQuantity } from "./checkout-cd.route";
import { auth } from "./auth"
import { db } from "./database";
import { CustomerData } from "./interfaces";

export interface cdsWithoutId {
    title: string;
    bandName: string;
    price: number;
    quantity: number;
}

const row = html => `<tr>\n${html}</tr>\n`,
    heading = object => row(Object.keys(object).reduce((html, heading) => (html + `<th>${heading}</th>`), '')),
    datarow = object => row(Object.values(object).reduce((html, value) => (html + `<td class="alignRight">${value}</td>`), ''));

export function createEmail(cdsWithQuantity: any, customerData, shippingCosts) {
    // console.log('[CH 11]: ', cdsWithQuantity, customerData)
    return `
            <p>Thank you for your order</p>
            ${createTable(cdsWithQuantity.cds)}
            <p>Shipping costs: ${shippingCosts.toFixed(2)}</p>
            ${calculateTotalPrice(cdsWithQuantity.cds, shippingCosts)}
            
            <p>Orderd by: </p>
            ${createCustomer(customerData)}
          `
}

function createTable(cdsWithQuantity) {
    

    return ` <table>
            ${heading(cdsWithQuantity[0])}
            ${cdsWithQuantity.reduce((html, object) => (html + datarow(object)), '')}
          </table>`
}

function calculateTotalPrice(cdsWithQuantity, shippingCosts) {
    let totalPrice: number = 0
    cdsWithQuantity.forEach((cd: any) => {
        totalPrice = totalPrice + cd.quantity * cd.price
    })
    totalPrice = totalPrice + shippingCosts;
    return `<h2>Total: &euro; ${totalPrice.toFixed(2)}</h2>`
}

function createCustomer(customerData: CustomerData) {

    return `
        <div>${customerData.firstName}</div>
        <div>${customerData.lastName}</div>
        <div>${customerData.email}</div>
        <div>${customerData.street} ${customerData.houseNumber} ${customerData.addition} </div>
        <div>${customerData.city}</div>
        <div>${customerData.country}</div>`
}







