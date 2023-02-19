module.exports = class Reviews {

    constructor() {
        this.list = [];
    }

    getAll() {
        return this.list;
    }

    add(review) {
        this.list.push(review);
    }

    getByReviewId(id) {
        const found = this.list.filter(review => review.id === id);
        if (found.length >= 1) {
            return found[0];
        } else {
            return null;
        }
    }

    getByApartmentId(id) {
        const found = this.list.filter(review => review.apartmentId === id);
        if (found.length >= 1) {
            return found;
        } else {
            return null;
        }
    }

    getByTenantId(id) {
        const found = this.list.filter(review => review.tenantId === id);
        if (found.length >= 1) {
            return found;
        } else {
            return null;
        }
    }
}