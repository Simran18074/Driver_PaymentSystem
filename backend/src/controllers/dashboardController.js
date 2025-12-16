const dataService = require('../services/dataService');

const getDashboardStats = async (req, res) => {
    try {
        const drivers = await dataService.getDrivers();
        const trips = await dataService.getTrips();
        const settlements = await dataService.getSettlements();

        const totalDrivers = drivers.length;
        const totalTrips = trips.length;

        // Calculate pending and paid amounts
        const totalPendingAmount = settlements
            .filter(s => s.status === 'PENDING')
            .reduce((sum, s) => sum + Number(s.amount), 0);

        const totalPaidAmount = settlements
            .filter(s => s.status === 'PAID')
            .reduce((sum, s) => sum + Number(s.amount), 0);

        // Get recent trips (last 5)
        const recentTrips = trips
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5)
            .map(t => ({
                ...t,
                driverId: t.driver_id,
                driverName: t.driver_name,
                pickupPoint: t.pickup_point,
                battaAmount: t.batta_amount,
                salaryAmount: t.salary_amount,
                totalAmount: t.total_amount
            }));

        res.json({
            totalDrivers,
            totalTrips,
            totalPendingAmount,
            totalPaidAmount,
            recentTrips
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboardStats
};
