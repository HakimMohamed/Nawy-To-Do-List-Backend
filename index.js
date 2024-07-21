const express = require('express');
const app = express();

require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`)
})

app.get('/ping', (req, res) => {
    res.status(200).json({ message: "pong", data: "" })
})