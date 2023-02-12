module.exports = class Review {
    constructor(tenantId, apartmentId, text, stars) {
        this.id = Math.random().toString(16).slice(2);
        this.tenantId = tenantId;
        this.apartmentId = apartmentId;
        this.text = text;
        this.stars = stars;
    }
}