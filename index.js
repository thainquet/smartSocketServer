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
app.get('/getInfor', async (req, res) => {
    const client = await mqtt.connect('mqtt://tailor.cloudmqtt.com', options)
    let data = {
        "nhietdo": "",
        "doam": "",
        "trangthai" : ""
    }
    await client.on('connect', () => {
        console.log('connected');
        client.subscribe('nhietdo', function () {
            client.on('message', function (topic, msg, pkt) {
                let json = JSON.parse(msg);
                data.nhietdo = json.toString()
            });
        });
        client.subscribe('doam', function () {
            client.on('message', function (topic, msg, pkt) {
                let json = JSON.parse(msg);
                data.doam = json.toString()
            });
        });
        client.subscribe('status', function () {
            client.on('message', function (topic, msg, pkt) {
                let json = JSON.parse(msg);
                data.trangthai = json.toString()
            });
            console.log(data)
        });
        res.send(data)
    });
})


app.listen(app.get('PORT'), () => console.log('success'))