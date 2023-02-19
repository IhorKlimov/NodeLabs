module.exports = class Authorization {
    constructor() {
        this.secretKey = "#n2n23tMGFm41VnwegmM#923mFMwefG<WwerWmwef"
    }

    checkAuthorization(token) {
        return !(!token || token !== this.secretKey);
    }
}