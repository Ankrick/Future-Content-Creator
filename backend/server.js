const express = require('express');
require('dotenv').config()

const morgan = require('morgan')
const app = express()
const cors = require('cors');
const cookieParser = require('cookie-parser');


const mongoose = require('mongoose');
const promptRoutes = require('./routes/prompts');
const storeRoutes = require('./routes/stores');
const userRoutes = require('./routes/users');


const mongoURL = "mongodb+srv://tn8070250_db_user:qjYwXcDWFInUxNUj@cluster0.2vx57fm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
mongoose.connect(mongoURL).then(() => {
    console.log('connected')
    const PORT = process.env.PORT || 4000;
    app.listen(PORT,() => {
        console.log('app is running on port:' + PORT);
    })
}).catch((error) => {console.log(error)});




app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
// Allow CORS from the frontend. Set FRONTEND_URL env var in production (Vercel URL),
// fallback to localhost:3000 for local development.
const FRONTEND_URL = 'http://localhost:3000';
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true
})); //security WARNING

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.use('/api/prompts', promptRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/users', userRoutes);

app.use(express.json());
