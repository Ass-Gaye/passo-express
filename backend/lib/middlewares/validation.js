const validateFare = (req, res, next) => {
    const {from, to, vehicleType, price} = req.body;

    // Check required fields
    if (!from || !to || !vehicleType || !price) {
        return res.status(400).json({
            error: "Bad Request",
            message: "Missing required fields: from, to, vehicleType, price"
        });
    
    }

    // Validate price
    if (typeof price !== 'number' || price <= 0) {
        return res.status(400).json({
            error: "Bad Request",
            message: "price must be a positive number."
        });
        
    }

    // Validate from !== to
    if (from.toLowerCase() === to.toLowerCase()) {
        return res.status(400).json({
            error: "Bad Request",
            message: "From and to cannot be the same."
        });
        
    }


    // Valid vehicle types
    const validVehicles = ['taxi', 'bus', 'gelegele', '7-seater'];
    if (!validVehicles.includes(vehicleType.toLowerCase())) {
        return res.status(400).json({
            error: "Bad Request",
            message: "Vehicle type must be one of: Taxi, Bus, Gelegele, or 7-seater"
        });
        
    }

    next();

};

module.exports = { validateFare };