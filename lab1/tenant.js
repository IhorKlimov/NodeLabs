module.exports = class Tenant {
    constructor(name, image, location) {
        this._id = Math.random().toString(16).slice(2);
        this.name = name;
        this.image = image;
        this.location = location;
    }
}