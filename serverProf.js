<<<<<<< HEAD
"user stricct"; 
const express = require("express"); 
const app = express();
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Server is running",
        status: "success"
    })
})

app.get("/next-metro", (req, res) => {
    const station = req.query.userId;
    if (!station) {
        return res.status(400).json({
            message: "station is required",
            status: "station is required"
        });
    
    }
    const result = { 
    station: station,
    ligne: 'M7', 
    prochainPassage: '00;10'
    }

    return res.status(200).json(result);
})

app.use((req, res, next) => {
    const t0 = Date.now();
    res.on('finish', () => {
        const t1 = Date.now();
        const duration = t1 - t0;
        console.log(`${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
});
    next();

});

app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    return res.status(404).json({
        error: "URL not found",
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
=======
"user stricct"; 
const express = require("express"); 
const app = express();
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Server is running",
        status: "success"
    })
})

app.get("/next-metro", (req, res) => {
    const station = req.query.userId;
    if (!station) {
        return res.status(400).json({
            message: "station is required",
            status: "station is required"
        });
    
    }
    const result = { 
    station: station,
    ligne: 'M7', 
    prochainPassage: '00;10'
    }

    return res.status(200).json(result);
})

app.use((req, res, next) => {
    const t0 = Date.now();
    res.on('finish', () => {
        const t1 = Date.now();
        const duration = t1 - t0;
        console.log(`${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
});
    next();

});

app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    return res.status(404).json({
        error: "URL not found",
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
>>>>>>> 1dcf19b80fd042b48251d4416155c633c87f7aa8
});