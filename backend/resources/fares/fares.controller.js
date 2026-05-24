const fareDB = require('./fares.db.js');

const getFares = async (req, res) => {
    try {
        const fares = await fareDB.getAll();

        res.status(200).json(fares);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }   
}


const getFare = async (req, res) => {
    try {
        const fare = await fareDB.getOne(req.params.id);

        if (!fare) {
            res.status(404).json({
                message: 'Fare Not Found'
            });
        }

        res.status(200).json(fare)

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }  
}



const createFare = async (req, res) => {
    try {
        const fare = await fareDB.create(req.body)

        res.status(201).json(fare)

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }   
}



const updateFare = async (req, res) => {
    try {
        const fare = await fareDB.update(req.params.id, req.body);

        res.status(200).json(fare);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }  
}



const deleteFare = async (req, res) => {

    try {

        await fareDB.remove(req.params.id);

        res.status(200).json({
            message: 'Fare deleted successfully'
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
}



module.exports = {
    getFares,
    getFare,
    createFare,
    updateFare,
    deleteFare
}