module.exports = class Booking{
    constructor(apartmentId, tenantId, startDate, endDate) {
        this.apartmentId = apartmentId;
        this.tenantId = tenantId;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}