const express = require('express')
const mongoose = require('mongoose');
const redis = require('redis');
const Authorization = require('./authorization');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express()

mongoose.connect('mongodb://127.0.0.1:27017/test');
const Apartment = mongoose.model('Apartment', {title: String, image: String, location: String});
const Booking = mongoose.model('Booking', {apartmentId: String, tenantId: String, startDate: Date, endDate: Date});
const Tenant = mongoose.model('Tenant', {name: String, image: String, location: String});
const Review = mongoose.model('Review', {tenantId: String, apartmentId: String, text: String, stars: Number});

app.use(bodyParser.urlencoded({extended: false}));
app.use(cors())
const port = 3000

const authorization = new Authorization();
const client = redis.createClient();
client.connect();
client.on('error', err => console.log('Redis Client Error', err));
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = async function () {
    const key = JSON.stringify({
        ...this.getQuery()
    });

    console.log(this.model.modelName, key);
    const cacheValue = await client.hGet(this.model.modelName, key);

    if (cacheValue) {
        const doc = JSON.parse(cacheValue);

        console.log("Response from Redis");
        return Array.isArray(doc)
            ? doc.map(d => new this.model(d))
            : new this.model(doc);
    }

    const result = await exec.apply(this, arguments);
    client.hSet(this.model.modelName, key, JSON.stringify(result));
    client.expire(this.model.modelName, 60);

    console.log("Response from MongoDB");
    return result;
};

app.get('/', async (req, res) => {
    if (!authorization.checkAuthorization(req.header("authKey"))) {
        res.status(401).send("Unauthorized");
        return;
    }

    res.send('Hello World!');
})

app.get('/apartments', async (req, res) => {
    if (!authorization.checkAuthorization(req.header("authKey"))) {
        res.status(401).send("Unauthorized");
        return;
    }

    const apartmentId = req.query.apartmentId;
    if (apartmentId) {
        res.send(await Apartment.findById(apartmentId).exec() ?? "Not found");
    } else {
        res.send(await Apartment.find().exec());
    }
})

app.post('/apartments', async (req, res) => {
    if (!authorization.checkAuthorization(req.header("authKey"))) {
        res.status(401).send("Unauthorized");
        return;
    }

    const title = req.body.title;
    const image = req.body.image;
    const location = req.body.location;

    const apartment = new Apartment({title, image, location});
    await apartment.save();
    client.del("Apartment");
    res.send("Success");
})

app.get('/bookings', async (req, res) => {
    if (!authorization.checkAuthorization(req.header("authKey"))) {
        res.status(401).send("Unauthorized");
        return;
    }

    const apartmentId = req.query.apartmentId;
    const tenantId = req.query.tenantId;

    let result;
    if (apartmentId) {
        const apartment = await Apartment.findById(apartmentId).exec();
        if (apartment) {
            result = res.send(await Booking.find({apartmentId: apartmentId}).exec());
        } else {
            result = "Apartment not found with given id";
        }
    } else if (tenantId) {
        const tenant = await Tenant.findById(tenantId).exec();
        if (tenant) {
            result = res.send(await Booking.find({tenantId}).exec());
        } else {
            result = "Tenant not found with given id";
        }
    }
    res.send(result);
})

app.post('/bookings', async (req, res) => {
    if (!authorization.checkAuthorization(req.header("authKey"))) {
        res.status(401).send("Unauthorized");
        return;
    }

    const apartmentId = req.body.apartmentId;
    const tenantId = req.body.tenantId;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;

    const apartment = await Apartment.findById(apartmentId).exec();
    const tenant = await Tenant.findById(tenantId).exec();
    if (!apartment) {
        res.send("Apartment not found with given id");
        return
    } else if (!tenant) {
        res.send("Tenant not found with given id");
        return
    }

    const isAvailableForGivenDates = await isAvailableOnGivenDates({
        apartmentId,
        tenantId,
        startDate: new Date(startDate),
        endDate: new Date(endDate)
    });
    if (isAvailableForGivenDates) {
        await new Booking({apartmentId, tenantId, startDate: new Date(startDate), endDate: new Date(endDate)}).save();
        client.del("Booking");
        res.send("Success");
    } else {
        res.send("Not available for given dates");
    }
})

app.get('/tenants', async (req, res) => {
    if (!authorization.checkAuthorization(req.header("authKey"))) {
        res.status(401).send("Unauthorized");
        return;
    }

    const tenantId = req.query.tenantId;
    if (tenantId) {
        res.send(await Tenant.findById(tenantId).exec() ?? "Not found");
    } else {
        res.send(await Tenant.find());
    }
})

app.post('/tenants', async (req, res) => {
    if (!authorization.checkAuthorization(req.header("authKey"))) {
        res.status(401).send("Unauthorized");
        return;
    }

    const name = req.body.name;
    const image = req.body.image;
    const location = req.body.location;
    await new Tenant({name, image, location}).save();
    client.del("Tenant");
    res.send("Success");
})

app.get('/reviews', async (req, res) => {
    if (!authorization.checkAuthorization(req.header("authKey"))) {
        res.status(401).send("Unauthorized");
        return;
    }

    const reviewId = req.query.reviewId;
    const tenantId = req.query.tenantId;
    const apartmentId = req.query.apartmentId;

    if (tenantId) {
        res.send(await Review.find({tenantId}).exec() ?? []);
    } else if (reviewId) {
        res.send(await Review.findById(reviewId).exec() ?? []);
    } else if (apartmentId) {
        res.send(await Review.find({apartmentId}).exec() ?? []);
    } else {
        res.send(await Review.find());
    }
})

app.post('/reviews', async (req, res) => {
    if (!authorization.checkAuthorization(req.header("authKey"))) {
        res.status(401).send("Unauthorized");
        return;
    }

    const tenantId = req.body.tenantId;
    const apartmentId = req.body.apartmentId;
    const text = req.body.text;
    const stars = req.body.stars;

    const apartment = await Apartment.findById(apartmentId).exec();
    const tenant = await Tenant.findById(tenantId).exec();
    if (!apartment) {
        res.send("Apartment not found with given id");
        return
    } else if (!tenant) {
        res.send("Tenant not found with given id");
        return
    }

    await new Review({tenantId, apartmentId, text, stars}).save();
    client.del("Review");
    res.send("Success");
})


async function isAvailableOnGivenDates(booking) {
    let isAvailableOnThisPeriod = true;

    let apartmentBookings = await Booking.find({apartmentId: booking.apartmentId}).exec();

    console.log(apartmentBookings)
    apartmentBookings.forEach((b, index) => {
        console.log(b);
        if (dateRangeOverlaps(booking.startDate, booking.endDate, b.startDate, b.endDate)) {
            console.log("True")
            isAvailableOnThisPeriod = false;
        }
    });
    return isAvailableOnThisPeriod;
}

function dateRangeOverlaps(a_start, a_end, b_start, b_end) {
    if (a_start <= b_start && b_start <= a_end) return true; // b starts in a
    if (a_start <= b_end && b_end <= a_end) return true; // b ends in a
    if (b_start < a_start && a_end < b_end) return true; // a in b
    return false;
}

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
*
* brew services start mongodb-community@6.0
* brew services stop mongodb-community@6.0
*
* docker run -p 6379:6379 -it redis/redis-stack-server:latest
* */