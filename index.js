const express = require('express')
const bodyParser = require('body-parser');

const mqtt = require('mqtt')
const options = {
    port: 13979,
    host: 'mqtt://tailor.cloudmqtt.com',
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: 'rqqffbzy',
    password: '4mOEPlditjHD',
    keepalive: 60,
    reconnectPeriod: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clean: true,
    encoding: 'utf8'
};

var app = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('PORT', process.env.PORT || 7778);

let data = {
    "nhietdo": "",
    "doam": "",
    "trangthai": ""
}

const client = mqtt.connect('mqtt://tailor.cloudmqtt.com', options)
client.on('connect', () => {
    console.log('connected');
    client.subscribe('nhietdo');
    client.subscribe('doam');
    client.subscribe('stt');
});
client.on('message', (topic, message) => {
    message = JSON.parse(message)
    if (topic == 'nhietdo') {
        data.nhietdo = message
    }
    if (topic == 'doam') {
        data.doam = message
    }
    if (topic == 'stt') {
        data.trangthai = message
    }
    console.log(data)
})

app.get('/getInfor', (req, res) => {
    res.send(data)    
})

app.get('/turnON', (req,res) => {
    client.publish("cmd", "1");
    res.end("success")
})

app.get('/turnOFF', (req,res) => {
    client.publish("cmd", "0");    
    res.end("success")
})


app.listen(app.get('PORT'), () => console.log('success'))