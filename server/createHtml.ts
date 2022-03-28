import { CdDataQuantity } from "./checkout-cd.route";
import { auth } from "./auth"
import { db } from "./database";
import { CustomerData } from "./interfaces";

const row = html => `<tr>\n${html}</tr>\n`,
    heading = object => row(Object.keys(object).reduce((html, heading) => (html + `<th>${heading}</th>`), '')),
    datarow = object => row(Object.values(object).reduce((html, value) => (html + `<td class="alignRight">${value}</td>`), ''));

export function createEmail(cdsWithQuantity: any, customerData) {
    console.log('[CH 11]: ', cdsWithQuantity, customerData)
    return `
            <p>Thank you for your order</p>
            ${createTable(cdsWithQuantity.cds)}
            ${calculateTotalPrice(cdsWithQuantity.cds)}
            
            <p>Will be shiped to: </p>
            ${createCustomer(customerData)}
          `
}

function createTable(cdsWithQuantity) {
    return ` <table>
            ${heading(cdsWithQuantity[0])}
            ${cdsWithQuantity.reduce((html, object) => (html + datarow(object)), '')}
          </table>`
}

function calculateTotalPrice(cdsWithQuantity) {
    let totalPrice: number = 0
    cdsWithQuantity.forEach((cd: any) => {
        totalPrice = totalPrice + cd.quantity * cd.price
    })
    return `<h2>Total: &euro; ${totalPrice}</h2>`
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







