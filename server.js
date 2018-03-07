var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

var dbUrl = 'mongodb://user:user@ds257848.mlab.com:57848/node-demo'

var Message = mongoose.model('Message', {
    name:String,
    message:String
})

// var messages = [
//     {name:'mei', message:'ji'},
//     {name:'yin', message:'jin'},
// ]

app.get('/messages',(req,res)=>{
    Message.find({},(err,messages)=>{
        res.send(messages)
    })
})

app.post('/messages',(req,res)=>{
    var message = new Message(req.body)

    message.save((err)=>{
        if(err)
            sendStatus(500)

        // messages.push(req.body)
        io.emit('message',req.body)
        // console.log(req.body)
        res.sendStatus(200)
    })

})
io.on('connection',(socket)=>{
    console.log('a user connected')
})

mongoose.connect(dbUrl,(err)=>{
    console.log('mongodb connection',err)
})

var server = http.listen(3000,()=>{
    console.log('server is listening on port', server.address().port)
})