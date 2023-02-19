const express = require('express')
let ejs = require('ejs');
const rest = require("./network");

const app = express()
app.set('view engine', 'ejs');
const port = 3001
const authKey = "#n2n23tMGFm41VnwegmM#923mFMwefG<WwerWmwef"

app.get('/', (req, res) => {
    const options = {
        host: 'localhost',
        port: 3000,
        path: '/apartments',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            authKey
        }
    };

    rest.getJSON(options, (statusCode, apartments) => {
        res.statusCode = statusCode;
        res.render('apartments', {apartments});
    });
})

app.get('/tenants', (req, res) => {
    const options = {
        host: 'localhost',
        port: 3000,
        path: '/tenants',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            authKey
        }
    };

    rest.getJSON(options, (statusCode, tenants) => {
        res.statusCode = statusCode;
        res.render('tenants', {tenants});
    });
})

app.get('/apartment/:apartmentId', async (req, res) => {
    const apartmentOptions = {
        host: 'localhost',
        port: 3000,
        path: '/apartments?apartmentId=' + req.params.apartmentId,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            authKey
        }
    };

    await rest.getJSON(apartmentOptions, (statusCode, apartment) => {
        const bookingsOptions = {
            host: 'localhost',
            port: 3000,
            path: '/bookings?apartmentId=' + req.params.apartmentId,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                authKey
            }
        };

        rest.getJSON(bookingsOptions, (statusCode, bookings) => {
            const reviewsOptions = {
                host: 'localhost',
                port: 3000,
                path: '/reviews?apartmentId=' + req.params.apartmentId,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    authKey
                }
            };

            rest.getJSON(reviewsOptions, (statusCode, reviews) => {
                res.statusCode = statusCode;
                res.render('apartment', {apartment, bookings, reviews});
            });
        });
    });
})

app.get('/tenant/:tenantId', (req, res) => {
    const tenantOptions = {
        host: 'localhost',
        port: 3000,
        path: '/tenants?tenantId=' + req.params.tenantId,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            authKey
        }
    };

    rest.getJSON(tenantOptions, (statusCode, tenant) => {
        const bookingsOptions = {
            host: 'localhost',
            port: 3000,
            path: '/bookings?tenantId=' + req.params.tenantId,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                authKey
            }
        };

        rest.getJSON(bookingsOptions, (statusCode, bookings) => {
            const reviewsOptions = {
                host: 'localhost',
                port: 3000,
                path: '/reviews?tenantId=' + req.params.tenantId,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    authKey
                }
            };

            rest.getJSON(reviewsOptions, (statusCode, reviews) => {
                res.statusCode = statusCode;
                res.render('tenant', {tenant, bookings, reviews});
            });
        });
    });
})

app.get('/review/:reviewId', (req, res) => {
    const reviewOptions = {
        host: 'localhost',
        port: 3000,
        path: '/reviews?reviewId=' + req.params.reviewId,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            authKey
        }
    };

    rest.getJSON(reviewOptions, (statusCode, review) => {
        const tenantOptions = {
            host: 'localhost',
            port: 3000,
            path: '/tenants?tenantId=' + review.tenantId,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                authKey
            }
        };

        rest.getJSON(tenantOptions, (statusCode, tenant) => {
            const apartmentOptions = {
                host: 'localhost',
                port: 3000,
                path: '/apartments?apartmentId=' + review.apartmentId,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    authKey
                }
            };

            rest.getJSON(apartmentOptions, (statusCode, apartment) => {
                res.statusCode = statusCode;
                res.render('review', {tenant, review, apartment});
            });
        });
    });
})

app.get('/reviews', (req, res) => {
    const options = {
        host: 'localhost',
        port: 3000,
        path: '/reviews',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            authKey
        }
    };

    rest.getJSON(options, (statusCode, reviews) => {
        res.statusCode = statusCode;
        res.render('reviews', {reviews});
    });
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
