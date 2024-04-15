import { fileURLToPath } from 'url';
import { dirname } from 'path';
import crypto from 'crypto';

import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
dotenv.config();

import mainRouter from './src/routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.set('view engine', 'ejs');

const key = crypto.randomBytes(32).toString('hex');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));


app.use(session({
    secret : key,
    resave  :false,
    saveUninitialized : false,
    cookie : {
        maxAge : 3600000,
        httpOnly: true,
        secure : false,
    }
}));

// ROUTRS
app.use(mainRouter);

const port = process.env.PORT;
app.listen(port, (err) => {
    if (err) {
        throw err.message;
    } else {
        console.log(`Server is listening on Port : ${process.env.PORT}`);
    }
});
