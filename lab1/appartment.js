module.exports = class Apartment {
    constructor(title) {
        this.id = Math.random().toString(16).slice(2);
        this.title = title;
        // this.location = location;
    }
}