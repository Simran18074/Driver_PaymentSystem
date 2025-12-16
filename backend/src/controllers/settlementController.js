const dataService = require('../services/dataService');

const getSettlements = async (req, res) => {
    try {
        const { type, status } = req.query;
        console.log(`Fetching settlements with type=${type}, status=${status}`);
        let settlements = await dataService.getSettlements();

        if (type) {
            settlements = settlements.filter(s => s.type === type);
        }
        if (status) {
            settlements = settlements.filter(s => s.status === status);
        }
        console.log(`Found ${settlements.length} settlements`);

        // Map snake_case to camelCase
        const mappedSettlements = settlements.map(s => ({
            ...s,
            tripId: s.trip_id,
            driverId: s.driver_id,
            driverName: s.driver_name,
            paidAt: s.paid_at
        }));

        res.json(mappedSettlements);
    } catch (error) {
        console.error("Error fetching settlements:", error);
        res.status(500).json({ message: error.message });
    }
};

const processSettlement = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Processing settlement for ID: ${id}`);
        const settlements = await dataService.getSettlements();
        const settlement = settlements.find(s => s.id === id);

        if (!settlement) {
            console.log(`Settlement not found for ID: ${id}`);
            return res.status(404).json({ message: "Settlement not found" });
        }

        // Update status and timestamp
        const updated = await dataService.updateSettlement({
            id,
            status: 'PAID',
            paid_at: new Date().toISOString()
        });

        console.log(`Settlement updated:`, updated);

        const responseSettlement = {
            ...updated,
            tripId: updated.trip_id,
            driverId: updated.driver_id,
            driverName: updated.driver_name,
            paidAt: updated.paid_at
        };

        res.json(responseSettlement);
    } catch (error) {
        console.error("Error processing settlement:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSettlements,
    processSettlement
};
