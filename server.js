const express = require('express');
const fareRoutes = require('./routes/fares');


const app = express();
const PORT = 3000;

//middleware
app.use(express.json());

//logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);;
    
    next();
});

//Root endpoint
app.get('/', (req, res) => {
    res.json({
        name: "Passo fare API",
        version: "1.0.0",
        description: "Public Transportation Fare System in The Gambia",

        endpoints: {
            'GET /api/fares': 'get all fares (supports ?from=X&to=Y&vehicleType=Z)',
            'GET /api/fares/:id' : 'Get specific fare',
            'POST /api/fares' : 'Create new fare',
            'PUT /api/fares/:id' : 'Update fare',
            'DELETE /api/fares/:id' : 'Delete fare'
        }
    });

});

//Mount Fare routes
app.use('/api/fares', fareRoutes);
//http://localhost:3000/api/fares

//404 handler
app.use((req, res) => {
    res.status(404).json({
        Error: "Not Found",
        message: `Route ${req.url} does not exist`
    });

});

//Error handler
app.use((err, req, res, next) => {
    console.log('Error: ', err.message);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
    
});

// Start server
app.listen(PORT, () => {
console.log('╔════════════════════════════════════════════════╗');
console.log('║ PASSO Fare API (Express Version)               ║');
console.log('╚════════════════════════════════════════════════╝');
console.log(`🚀 Server running at http://localhost:${PORT}`);
console.log('📝 API Documentation: http://localhost:${PORT}/');
});