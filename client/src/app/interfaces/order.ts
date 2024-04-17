export interface Order {
    orderID: string,
    productName: string,
    status: string,
    trackingCode: string,
    estimatedDelivery: string,
    carrier: string,
    source: string,
    dateAdded: string,
    senderLocation: string,
    receiverLocation: string,
}