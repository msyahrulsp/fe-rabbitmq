"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const amqplib_1 = __importDefault(require("amqplib"));
const body_parser_1 = __importDefault(require("body-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT');
    res.header("Access-Control-Allow-Headers", "Authorization, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
});
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
const router = express_1.default.Router();
const port = process.env.PORT;
app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
});
router.get('/', (req, res) => {
    res.send('API is working 🎉');
});
router.get('/hello', (req, res) => {
    res.send('Hello world!');
});
router.post('/book', (req, res) => {
    try {
        const booking = req.body;
        if (booking.bookingType == undefined) {
            res.status(400).send({
                message: 'Booking type is required'
            });
            return;
        }
        // Separate queue based on doctor booking type
        const queue = booking.bookingType === 'vaccination' ? 'vaccination' : 'general';
        // Publish to RabbitMQ
        amqplib_1.default.connect(process.env.RABBITMQ_URL).then((conn) => {
            console.log('Connected to RabbitMQ');
            return conn.createChannel().then((ch) => {
                ch.assertQueue(queue, {
                    durable: true
                });
                ch.sendToQueue(queue, Buffer.from(JSON.stringify(booking)), {
                    persistent: true
                });
            });
        });
        res.send({
            message: 'Booking successful'
        });
    }
    catch (err) {
        res.status(500).send({
            message: 'Internal server error'
        });
    }
});
app.use("/api/v1", router);
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
// const queue = 'hello';
// amqp.connect(process.env.RABBITMQ_URL!).then((conn) => {
//   console.log('Connected to RabbitMQ')
//   return conn.createChannel().then((ch) => {
//     ch.assertQueue(queue, {
//       durable: true
//     });
//     ch.consume(queue, function(msg) {
//       console.log("[x] Received %s", msg?.content.toString());
//     }, {  
//       noAck: true
//     });
//   })
// })
