const localityDB = require('./localities.db.js');

const getLocalities = async (req, res) => {
    try {
        const localities = await localityDB.getAll();

        res.json(localities)
        
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
        
    } 
}

const getLocality = async (req, res) => {
    try {
        const locality = await localityDB.getOne(req.params.id);

        if (!locality) {
            return res.status(404).json({
                message: 'Locality Not Found'
            });
        }

        res.json(locality)

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }   
}


const createLocality = async (req, res) => {
    try {
        const locality = await localityDB.create(req.body)

        res.status(200).json(locality);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

const updateLocality = async (req, res) => {
    try {
        const locality = await localityDB.update(req.params.id, req.bod);

        res.json(locality);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }   
}

const deleteLocality = async (req, res) => {
    try {
        const locality = await localityDB.remove(req.params.id);

        res.satus(200).json({
            message: 'Locality deleted Successfullty'
        })

    } catch (error) {
        
    }  
}

module.exports = {
    getLocalities,
    getLocality,
    createLocality,
    updateLocality,
    deleteLocality
}

