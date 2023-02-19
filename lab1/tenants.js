module.exports = class Tenants {

    constructor() {
        this.list = [];
    }

    getAll() {
        return this.list;
    }

    add(tenant) {
        this.list.push(tenant);
    }

    get(id) {
        const found = this.list.filter(tenant => tenant._id === id);
        if (found.length >= 1) {
            return found[0];
        } else {
            return null;
        }
    }
}