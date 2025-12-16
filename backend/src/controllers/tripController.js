const dataService = require('../services/dataService');
const { v4: uuidv4 } = require('uuid');

const getTrips = async (req, res) => {
    try {
        const trips = await dataService.getTrips();
        // Map snake_case to camelCase if needed, or frontend adapts.
        // Let's map for compatibility.
        const mappedTrips = trips.map(t => ({
            ...t,
            driverId: t.driver_id,
            driverName: t.driver_name,
            pickupPoint: t.pickup_point,
            battaAmount: t.batta_amount,
            salaryAmount: t.salary_amount,
            totalAmount: t.total_amount
        }));
        res.json(mappedTrips);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createTrip = async (req, res) => {
    try {
        const { driverId, pickupPoint, destination, battaAmount, salaryAmount, totalAmount } = req.body;
        
        if (!driverId || !pickupPoint || !destination) {
            return res.status(400).json({ message: "Driver, Pickup Point, and Destination are required" });
        }

        const route = `${pickupPoint} -> ${destination}`;

        // Fetch driver to get name and preference
        // In Supabase we can fetch single driver directly
        // But dataService.getDrivers returns all. Let's use that or add getDriver(id) to service?
        // For now, getDrivers() is fine for small scale, but inefficient.
        // Better to add getDriverById to service, but let's stick to existing pattern for now to minimize changes,
        // or just filter from getDrivers result.
        // Actually, let's just fetch all and find.
        const drivers = await dataService.getDrivers();
        const driver = drivers.find(d => d.id === driverId);

        if (!driver) {
            return res.status(404).json({ message: "Driver not found" });
        }

        // Calculate splits based on preference
        let finalBatta = 0;
        let finalSalary = 0;
        const total = Number(totalAmount) || (Number(battaAmount) + Number(salaryAmount));

        // Note: driver from DB has snake_case keys
        const paymentPreference = driver.payment_preference || driver.paymentPreference;

        if (paymentPreference === 'BATTA') {
            finalBatta = total;
            finalSalary = 0;
        } else if (paymentPreference === 'SALARY') {
            finalBatta = 0;
            finalSalary = total;
        } else if (paymentPreference === 'BOTH') {
            finalBatta = Number(battaAmount) || 0;
            finalSalary = Number(salaryAmount) || 0;
        }

        const newTrip = {
            id: uuidv4(),
            driver_id: driverId,
            driver_name: driver.name,
            pickup_point: pickupPoint,
            destination: destination,
            route,
            batta_amount: finalBatta,
            salary_amount: finalSalary,
            total_amount: finalBatta + finalSalary,
            // date handled by DB default or pass it
            date: new Date().toISOString()
        };

        const savedTrip = await dataService.saveTrip(newTrip);

        // Create pending settlements immediately
        if (finalBatta > 0) {
            await dataService.saveSettlement({
                id: uuidv4(),
                trip_id: newTrip.id,
                driver_id: driver.id,
                driver_name: driver.name,
                amount: finalBatta,
                type: 'BATTA', // Weekly
                status: 'PENDING',
                date: newTrip.date
            });
        }

        if (finalSalary > 0) {
            await dataService.saveSettlement({
                id: uuidv4(),
                trip_id: newTrip.id,
                driver_id: driver.id,
                driver_name: driver.name,
                amount: finalSalary,
                type: 'SALARY', // Monthly
                status: 'PENDING',
                date: newTrip.date
            });
        }

        // Map response
        const responseTrip = {
            ...savedTrip,
            driverId: savedTrip.driver_id,
            driverName: savedTrip.driver_name,
            pickupPoint: savedTrip.pickup_point,
            battaAmount: savedTrip.batta_amount,
            salaryAmount: savedTrip.salary_amount,
            totalAmount: savedTrip.total_amount
        };

        res.status(201).json(responseTrip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTrips,
    createTrip
};
