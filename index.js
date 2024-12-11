var express = require('express');
var app = express();

app.get('/', (req, res) => {
    res.send('hello world');
});

app.listen(4000, () => {
    console.log("CRUD BACKEND LISTENING @ PORT 4000");
})