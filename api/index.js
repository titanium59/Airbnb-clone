const express = require('express')

const app = express();

app.get('/test', (req, res) => {
    res.send("Hello")
})

app.listen(4000);