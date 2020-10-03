const express = require('express');
var bodyParser = require('body-parser');
const scrapper = require('./scrapper');
const path = require('path');
// const { monitorPrice } = require('./scrapper');

const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = process.env.PORT || 3000;

const cors = require('cors');



let productUrl = '';
var dispObj = {};

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());


app.get('/' , async(req,res) => {
    res.sendFile(__dirname + '/public/html/main.html');
});


app.use(bodyParser.json()); 

app.use(bodyParser.urlencoded({ extended: true })); 
io.on('connection',socket => {
    console.log('connection accuired!');
    socket.on('get-product-details',async() => {
        console.log('product detail request granted!!');
        dispObj = await scrapper.monitorPrice(productUrl);
        console.log(dispObj);
        console.log('process completed');            
        socket.emit('product-details',dispObj);
    });
})

app.post('/productDisplay.html', async function(req, res){
    productUrl = req.body.url;
    console.log(productUrl);
    res.sendFile(__dirname + '/public/html/productDisplay.html');
});


http.listen(port, () => console.log(`Active on ${port} port`));