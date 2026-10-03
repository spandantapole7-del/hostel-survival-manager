const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


// ===============================
// HOME / SERVER TEST
// ===============================

app.get("/", (req, res) => {
    res.json({
        message: "Hostel Survival Manager Backend is Running!"
    });
});


// ===============================
// CURRENCY API
// ===============================

app.get("/api/currency/:from/:to", async (req, res) => {

    try {

        const { from, to } = req.params;

        const baseCurrency = from.toUpperCase();
        const targetCurrency = to.toUpperCase();

        const apiURL =
            `https://api.frankfurter.dev/v2/rate/${baseCurrency}/${targetCurrency}`;

        const response = await fetch(apiURL);

        if (!response.ok) {
            return res.status(response.status).json({
                error: "Unable to get currency rate"
            });
        }

        const data = await response.json();

        res.json({
            base: data.base,
            quote: data.quote,
            rate: data.rate,
            date: data.date
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Currency API request failed"
        });
    }

});


// ===============================
// START SERVER
// ===============================

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});