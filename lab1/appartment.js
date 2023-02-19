module.exports = class Apartment {
    constructor(title, image, location) {
        this._id = Math.random().toString(16).slice(2);
        this.title = title;
        this.image = image;
        this.location = location;
    }
}