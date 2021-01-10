var mosca = require('mosca');
//require('dotenv').config();

var mqtt_port = process.env.port|| 1883
var http_port = process.env.port|| 8883

var settings = {
    port: mqtt_port,
    http:{
        port: http_port,
    }
   };

var server = new mosca.Server(settings); //สร้างตัวแปรมารับค่า server
server.on('ready', setup); //ใช้คำสั่ง ready,setup เพื่อตั้งค่า
function setup() {
    // กำหนดให้ เซอร์ฟเวอร์ มีระบบ Authemtication
    server.authenticate = authenticate; 
    console.log(' * Mosca server listening at:',settings)
    console.log(' * Mosca server is up and running (Authentication)')
}

var authenticate = function (client, username, password, callback) {
   var authorized = (username === "deltalogic" && password.toString() === "deltalogic2020");
    if (authorized) client.user = username;
    callback(null, authorized);
   }

server.on('clientConnected', function (client) {
    console.log('Client Connected:', client.id);
  });

server.on('clientDisconnected', function (client) {
    console.log('Client Disconnected:', client.id);
  });

server.on('published', function (packet, client) {
   console.log(packet);
   console.log('Published', packet.payload.toString());
  });
  
//Server subscribe message===========================>>>>>
server.subscribe("register", (topic, message) =>{
    var packet = {
        topic: "register/rcv",
        payload: "Result:OK",
        qos: 1,
        retain: false,  
    };
    server.publish(packet, function() {
        console.log('MQTT broker message sent');
    });
console.log(message.toString());
});


