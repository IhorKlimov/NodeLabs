module.exports = class Tenant {
    constructor(name) {
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
    }
}