require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { generateToken } = require('./utils/jwt');
const cors = require('cors');
const app = express();
const PORT = 4000;
const mongoDB = process.env.MONGO_URI;
const User = require('./models/user')

mongoose.set("strictQuery", false);
app.use(bodyParser.json({ limit: '2mb' }));
app.use(cors());

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


//Save User
app.post('/api/users', validateToken, async function(req, res){
    try {
        const { email, password, first_name, last_name } = req.body;
        const user = new User({email: email, password: password, first_name: first_name, last_name: last_name});
        await user.save();

        res.status(200).json({
            success: true,
            message: 'user details saved'
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
});

//Get Users
app.get('/api/users', validateToken, async function(req, res){
    try {
        const users = await User.find();

        res.status(200).json({
            success: true,
            data: users
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
});

//Update User
app.put('/api/users/:Id', validateToken, async function(req, res){
    const userId = req.params.Id;
    const toUpdate = req.body;
    const update = {};

    if (toUpdate.first_name){
        update['first_name'] = toUpdate.first_name;
    }

    if (toUpdate.last_name){
        update['last_name'] = toUpdate.last_name;
    }

    if(!userId) {
        res.status(401).json({
            success: false,
            message: 'Id is missing'
        })
    }

    if(!update) {
        res.status(401).json({
            success: false,
            message: 'Update params is missing'
        })
    }

    try {
        const result = await User.findOneAndUpdate({_id: userId}, update, {new: true});

        res.status(200).json({
            success: true,
            data: result
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
});

//Delete User
app.delete('/api/users/:Id', validateToken, async function(req, res){
    const userId = req.params.Id;

    if(!userId) {
        res.status(401).json({
            success: false,
            message: 'Id is missing'
        })
    }

    try {
        const result = await User.deleteOne({_id: userId});

        res.status(200).json({
            success: true,
            data: result
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
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