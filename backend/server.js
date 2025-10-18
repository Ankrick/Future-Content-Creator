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
    app.listen(process.env.PORT,() => {
        console.log('app is running on localhost:'+process.env.PORT);
        })
}).catch((error) => {console.log(error)});



app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors(
    {
        origin : "https://future-content-creator-u576.vercel.app",
        credentials : true
    }
)); //security WARNING

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.use('/api/prompts', promptRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/users', userRoutes);

app.use(express.json());
