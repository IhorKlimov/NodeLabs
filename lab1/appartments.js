module.exports = class Apartments {

    constructor() {
        this.list = [];
    }

    getAll() {
        return this.list;
    }

    add(apartment) {
        this.list.unshift(apartment);
    }

    get(apartmentId) {
        const found = this.list.filter(apartment => apartment.id === apartmentId);
        if (found.length >= 1) {
            return found[0];
        } else {
            return null;
        }
    }
}