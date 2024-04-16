export interface Order {
    uuid: string,
    orderID: string,
    productName: string,
    status: string,
    trackingCode: string,
    estimatedDelivery: string,
    carrier: string,
    source: string,
    dateAdded: string
}