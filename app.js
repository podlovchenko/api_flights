const fs = require('fs');
const express = require('express');

const cities = [
    'Moscow',
    'Helsinki',
    'Ottawa',
    'Santiago',
    'Bogota',
    'Tbilisi',
    'Berlin',
    'Reykjavik',
    'Jakarta',
    'Ulan Bator',
];

const status = [
    'arrival',
    'departure',
    'delay',
];

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const randomInteger = (min, max) => {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    rand = Math.round(rand);

    return rand;
};

const generateFlights = (n) => {
    const flights = [];

    for (let i = 0; i < n; i++) {
        flights.push({
            id: Math.random().toString(36).substr(2, 5),
            to: cities[randomInteger(0, 9)],
            date: randomDate(new Date(), new Date(2018, 10, 1)),
            status: status[randomInteger(0, 2)],
        },);
    }

    return flights;
};

const flights = generateFlights(50);

fs.writeFile('flights', JSON.stringify(flights), function(err) {
    if (err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});

const app = express();

app.use(express.json());

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use('/departure', (req, res) => {
    res.status(200).json(flights.filter(flight => flight.status === 'departure'));
});

app.use('/arrival', (req, res) => {
    res.status(200).json(flights.filter(flight => flight.status === 'arrival'));
});

app.use('/delay', (req, res) => {
    res.status(200).json(flights.filter(flight => flight.status === 'delay'));
});

app.use('/search/:id', (req, res) => {
    const flight = flights.find(flight => flight.id === req.params.id);

    if (flight) {
        res.status(200).json([flight]);
    } else {
        res.status(404).json({
            "message": "Error!\n"
        });
    }
});

app.listen(process.env.PORT || '8001', () => {
    console.log('Server listening port');
});
