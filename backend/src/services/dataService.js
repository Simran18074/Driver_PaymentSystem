const supabase = require('../config/supabaseClient');

module.exports = {
    // Drivers
    getDrivers: async () => {
        const { data, error } = await supabase.from('drivers').select('*');
        if (error) throw error;
        return data;
    },
    saveDriver: async (driver) => {
        const { data, error } = await supabase.from('drivers').insert(driver).select().single();
        if (error) throw error;
        return data;
    },
    updateDriver: async (driver) => {
        const { data, error } = await supabase
            .from('drivers')
            .update(driver)
            .eq('id', driver.id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },
    deleteDriver: async (id) => {
        const { error } = await supabase.from('drivers').delete().eq('id', id);
        if (error) return false;
        return true;
    },

    // Trips
    getTrips: async () => {
        const { data, error } = await supabase.from('trips').select('*');
        if (error) throw error;
        return data;
    },
    saveTrip: async (trip) => {
        const { data, error } = await supabase.from('trips').insert(trip).select().single();
        if (error) throw error;
        return data;
    },

    // Settlements
    getSettlements: async () => {
        const { data, error } = await supabase.from('settlements').select('*');
        if (error) throw error;
        return data;
    },
    saveSettlement: async (settlement) => {
        const { data, error } = await supabase.from('settlements').insert(settlement).select().single();
        if (error) throw error;
        return data;
    },
    updateSettlement: async (settlement) => {
        const { data, error } = await supabase
            .from('settlements')
            .update(settlement)
            .eq('id', settlement.id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    // Helper to reset data (for testing, though less useful with real DB)
    resetData: async () => {
        // Warning: This deletes everything!
        await supabase.from('settlements').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('trips').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('drivers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    }
};
