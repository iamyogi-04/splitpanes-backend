const mongoose = require('mongoose')
const express = require('express')
const app = express()
const Port = process.env.PORT || 5000;
const cors = require('cors');
const path = require('path')
const bodyParser = require('body-parser');


//database 

mongoose.connect('mongodb+srv://yogesh:yogesh@cluster0.3sc3ayd.mongodb.net/test',()=>{
    console.log('mongoose connected')
})

//middleware
app.use(express.static(path.join(__dirname, "public")));
app.use('public', express.static('public'))
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



//Routes
app.get('/', (req, res) => {
    res.send("homepage")
})

app.use('/api/v1', require('./Routes/PostRoute'))


app.listen(Port, ()=>{
    console.log("App started on port " + Port)
})

