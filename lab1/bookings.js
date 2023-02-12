module.exports = class Bookings {

    constructor() {
        this.bookings = [];
    }

    getByApartmentId(id) {
        return this.bookings.filter(booking => booking.apartmentId === id);
    }

    getByTenantId(id) {
        return this.bookings.filter(booking => booking.tenantId === id);
    }

    add(booking) {
        let isAvailableOnThisPeriod = true;

        let apartmentBookings = this.bookings.filter(b => b.apartmentId === booking.apartmentId);

        console.log(apartmentBookings)
        apartmentBookings.forEach((b, index) => {
            console.log("here")
            console.log(b);
            if (this.dateRangeOverlaps(booking.startDate, booking.endDate, b.startDate, b.endDate)) {
                console.log("True")
                isAvailableOnThisPeriod = false;
            }
        });
        if (isAvailableOnThisPeriod) {
            this.bookings.push(booking);
            return "Success";
        } else {
            return "Not available for these dates";
        }
    }

    dateRangeOverlaps(a_start, a_end, b_start, b_end) {
        if (a_start <= b_start && b_start <= a_end) return true; // b starts in a
        if (a_start <= b_end && b_end <= a_end) return true; // b ends in a
        if (b_start < a_start && a_end < b_end) return true; // a in b
        return false;
    }
}