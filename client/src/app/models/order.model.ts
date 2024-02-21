export class Order {
    private productName: string;
    private orderID: string;
    private carrier: string;
    private dateAdded: string;
    private estimatedDelivery: string;
    private source: string;
    private status: number;
    private trackingCode: string;
    private user: string;

    constructor(productName: string, orderID: string, carrier: string, dateAdded: string, estimatedDelivery: string, source: string, status: number, trackingCode: string, user: string) {
        this.productName = productName;
        this.orderID = orderID;
        this.carrier = carrier;
        this.dateAdded = dateAdded;
        this.estimatedDelivery = estimatedDelivery;
        this.source = source;
        this.status = status;
        this.trackingCode = trackingCode;
        this.user = user;
    }

    public getProductName() {
        return this.productName;
    }

    public setProductName(productName: string) {
        this.productName = productName;
    }

    public getOrderID() {
        return this.orderID;
    }

    public setOrderID(orderID: string) {
        this.orderID = orderID;
    }

    public getCarrier() {
        return this.carrier;
    }

    public setCarrier(carrier: string) {
        this.carrier = carrier;
    }

    public getDateAdded() {
        return this.dateAdded;
    }

    public setDateAdded(dateAdded: string) {
        this.dateAdded = dateAdded;
    }

    public getEstimatedDelivery() {
        return this.estimatedDelivery;
    }

    public setEstimatedDelivery(estimatedDelivery: string) {
        this.estimatedDelivery = estimatedDelivery;
    }

    public getSource() {
        return this.source;
    }

    public setSource(source: string) {
        this.source = source;
    }

    public getStatus() {
        return this.status;
    }

    public setStatus(status: number) {
        this.status = status;
    }

    public getTrackingCode() {
        return this.trackingCode;
    }

    public setTrackingCode(trackingCode: string) {
        this.trackingCode = trackingCode;
    }

    public getUser() {
        return this.user;
    }

    public setUser(user: string) {
        this.user = user;
    }

    
}
