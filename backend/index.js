// const express = require('express');
// const cors = require('cors');
// const morgan = require('morgan');

// const routes = require('./routes');

// const app = express();

// app.use(cors());

// app.use(express.json());

// app.use(morgan('dev'));

// app.use('/api', routes);


// app.get('/', (req, res) => {
//     res.json({
//         message: 'PASSO API RUNNING'
//     });
// });

// module.exports = app;





const express = require('express');

const cors = require('cors');

const morgan = require('morgan');

const routes = require('./routes');

const app = express();


// MIDDLEWARE
app.use(cors());

app.use(express.json());

app.use(morgan('dev'));


// API ROUTES
app.use('/api', routes);


// TEST ROUTE
app.get('/', (req, res) => {
    res.json({
        message: 'PASSO Express API Running'
    });
});


module.exports = app;


