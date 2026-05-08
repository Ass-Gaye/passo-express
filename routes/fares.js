const express = require('express');
const router = express.Router();

const {
     getAllFares,
    getFareById,
    searchFares,
    createFare,
    updateFare,
    deleteFare
} = require('../data/fares');

const { validateFare } = require('../middleware/validation');

//get all
router.get('/', (req, res) => {
    try {

        const results =  searchFares(req.query);

        if (!results) {
            return res.status(400).json({
                message: "Bad Request"
            });
            
        }

        res.status(200).json({
            count: results.length,
            data: results
        });
        

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error", error
        });
        
    }
});


// GET /api/fares/:id - Get specific fare
router.get('/:id', (req, res) => {
    try {
        const id   = parseInt(req.params.id);


        console.log(id);
        
        const fare = getFareById(id);
        console.log(fare);
        

        if (!fare) {
            return res.status(400).json({
                Error: "Not Found",
                message: `Fare with ID ${id} not found`
            });
            
        }

        res.status(200).json(fare);

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error", error
        });
        
    }

});

// POST /api/fares - Create new fare
router.post('/',  validateFare, (req, res) => {
    try {
        const newFare = createFare(req.body);
    
        res.status(201).json({
            message: "Fare created successfully.",
            newFare
        });

        
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error", error
        });
        
    }

});

// PUT /api/fares/:id - Update fare
router.put('/:id', (req, res) => {
    try { 
        const id = parseInt(req.params.id);
        const fareUpdate = updateFare(id, req.body);

        if (!fareUpdate) {
            return res.status(400).json({
                Error: "Not Found",
                message: `Fare with ID ${id} not found`
            });
        }

        res.status(200).json({
            message: "Fare Updated Successfully",
            fareUpdate
        })


    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        });
        
    }


});

router.delete('/:id', (req, res) => {
    try {
        const id  = parseInt(req.params.id)
        deletedFare = deleteFare(id);

        if (!deletedFare) {
            return res.status(400).json({
                Error: "Not Found",
                message: `Fare with ID ${id} not found`
            });
        }

        res.status(200).json({
            message: "Fare Deleted Successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error", error
        });
        
    }

});

module.exports = router;


