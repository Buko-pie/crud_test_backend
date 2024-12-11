require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { generateToken } = require('./utils/jwt');
const app = express();
const PORT = 4000;
const mongoDB = process.env.MONGO_URI;
const User = require('./models/user')

mongoose.set("strictQuery", false);
app.use(bodyParser.json({ limit: '2mb' }));

main().catch((err) => console.log(err));
async function main() {
    const mongo = await mongoose.connect(mongoDB);
}

const jwt = require('jsonwebtoken');
const validateToken = function (req, res, next){
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1]; //Bearer <token>

        jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, payload){
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: 'Authentication error'
                });
            } else {
                req.user = payload;
                next();
            }
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Authentication missing'
        })
    }
}

app.get('/protected', validateToken, function (req, res) {
    res.send('hello world');
});

app.get('/api/users', validateToken, async function(req, res){
    if (req.method === 'POST'){
        try {
            const { email, password, first_name, last_name } = req.body;
            const user = new User({email: email, password: password, first_name: first_name, last_name: last_name});
            await user.save();
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err
            })
        }
    } else if (req.method === 'GET'){

    }
});

app.get('/api/getToken', function(req, res){
    res.json({
        your_token: generateToken("test")
    })
});

app.listen(PORT, function () {
    console.log("CRUD BACKEND LISTENING @ PORT 4000");
})