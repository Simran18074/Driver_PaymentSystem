const dataService = require('../services/dataService');

const getHistory = async (req, res) => {
    try {
        console.log('Fetching payment history...');
        const settlements = await dataService.getSettlements();
        
        // Filter for PAID settlements
        const history = settlements
            .filter(s => s.status === 'PAID')
            .sort((a, b) => new Date(b.paid_at) - new Date(a.paid_at))
            .map(s => ({
                ...s,
                tripId: s.trip_id,
                driverId: s.driver_id,
                driverName: s.driver_name,
                paidAt: s.paid_at
            }));

        console.log(`Found ${history.length} history records`);
        res.json(history);
    } catch (error) {
        console.error("Error fetching history:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getHistory
};
