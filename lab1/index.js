const express = require('express')
const Apartments = require('./appartments.js');
const Apartment = require('./appartment.js');
const Tenants = require('./tenants');
const Tenant = require('./tenant.js');
const Booking = require('./booking.js');
const Bookings = require('./bookings.js');
const Review = require('./review.js');
const Reviews = require('./reviews.js');
const Authorization = require('./authorization');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express()
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors())
const port = 3000

const apartments = new Apartments();
const bookings = new Bookings();
const tenants = new Tenants();
const reviews = new Reviews();
const authorization = new Authorization();

app.get('/', (req, res) => {
    if (!authorization.checkAuthorization(req.header("authKey"))) {
        res.status(401).send("Unauthorized");
        return;
    }

    res.send('Hello World!');
})

app.get('/apartments', (req, res) => {
    if (!authorization.checkAuthorization(req.header("authKey"))) {
        res.status(401).send("Unauthorized");
        return;
    }
    
    const apartmentId = req.query.apartmentId;
    if (apartmentId) {
        res.send(apartments.get(apartmentId) ?? "Not found");
    } else {
        res.send(apartments.getAll());
    }
})

app.post('/apartments', (req, res) => {
    if (!authorization.checkAuthorization(req.header("authKey"))) {
        res.status(401).send("Unauthorized");
        return;
    }
    
    const title = req.body.title;
    const image = req.body.image;
    const location = req.body.location;
    apartments.add(new Apartment(title, image, location));
    res.send("Success");
})

app.get('/bookings', (req, res) => {
    if (!authorization.checkAuthorization(req.header("authKey"))) {
        res.status(401).send("Unauthorized");
        return;
    }
    
    const apartmentId = req.query.apartmentId;
    const tenantId = req.query.tenantId;

    let result;
    if (apartmentId) {
        const apartment = apartments.get(apartmentId);
        if (apartment) {
            result = res.send(bookings.getByApartmentId(apartmentId));
        } else {
            result = "Apartment not found with given id";
        }
    } else if (tenantId) {
        const tenant = tenants.get(tenantId);
        if (tenant) {
            result = res.send(bookings.getByTenantId(tenantId));
        } else {
            result = "Tenant not found with given id";
        }
    }
    res.send(result);
})

app.post('/bookings', (req, res) => {
    if (!authorization.checkAuthorization(req.header("authKey"))) {
        res.status(401).send("Unauthorized");
        return;
    }
    
    const apartmentId = req.body.apartmentId;
    const tenantId = req.body.tenantId;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;

    const apartment = apartments.get(apartmentId);
    const tenant = tenants.get(tenantId);
    if (!apartment) {
        res.send("Apartment not found with given id");
        return
    } else if (!tenant) {
        res.send("Tenant not found with given id");
        return
    }

    const result = bookings.add(new Booking(apartmentId, tenantId, new Date(startDate), new Date(endDate)));
    res.send(result);
})

app.get('/tenants', (req, res) => {
    if (!authorization.checkAuthorization(req.header("authKey"))) {
        res.status(401).send("Unauthorized");
        return;
    }
    
    const tenantId = req.query.tenantId;
    if (tenantId) {
        res.send(tenants.get(tenantId) ?? "Not found");
    } else {
        res.send(tenants.getAll());
    }
})

app.post('/tenants', (req, res) => {
    if (!authorization.checkAuthorization(req.header("authKey"))) {
        res.status(401).send("Unauthorized");
        return;
    }
    
    const name = req.body.name;
    const image = req.body.image;
    const location = req.body.location;
    tenants.add(new Tenant(name, image, location));
    res.send("Success");
})

app.get('/reviews', (req, res) => {
    if (!authorization.checkAuthorization(req.header("authKey"))) {
        res.status(401).send("Unauthorized");
        return;
    }
    
    const reviewId = req.query.reviewId;
    const tenantId = req.query.tenantId;
    const apartmentId = req.query.apartmentId;

    if (tenantId) {
        res.send(reviews.getByTenantId(tenantId) ?? []);
    } else if (reviewId) {
        res.send(reviews.getByReviewId(reviewId) ?? []);
    } else if (apartmentId) {
        res.send(reviews.getByApartmentId(apartmentId) ?? []);
    } else {
        res.send(reviews.getAll());
    }
})

app.post('/reviews', (req, res) => {
    if (!authorization.checkAuthorization(req.header("authKey"))) {
        res.status(401).send("Unauthorized");
        return;
    }
    
    const tenantId = req.body.tenantId;
    const apartmentId = req.body.apartmentId;
    const text = req.body.text;
    const stars = req.body.stars;

    const apartment = apartments.get(apartmentId);
    const tenant = tenants.get(tenantId);
    if (!apartment) {
        res.send("Apartment not found with given id");
        return
    } else if (!tenant) {
        res.send("Tenant not found with given id");
        return
    }

    reviews.add(new Review(tenantId, apartmentId, text, stars));
    res.send("Success");
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

/*
* Entities:
* - Apartments
* - Bookings
* - Tenant
* - Review
*
* */