import express, { Express, Request, Response, Router } from 'express';
import dotenv from 'dotenv';
import amqp from 'amqplib';
import cors from 'cors';
import bodyParser from 'body-parser';
dotenv.config();

const app: Express = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT');
  res.header("Access-Control-Allow-Headers", "Authorization, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router: Router = express.Router();

const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript!');
});

router.get('/', (req: Request, res: Response) => {
  res.send('API is working 🎉');
});

router.get('/hello', (req: Request, res: Response) => {
  res.send('Hello world!');
});


type Booking = {
  name: string;
  email: string;
  phone: string;
  datetime: string;
  bookingType: BookingType;
  description?: string;
}

type BookingType = 'vaccination' | string;

router.post('/book', (req: Request, res: Response) => {
  try {
    const booking = req.body as Booking;

    if (booking.bookingType == undefined){
      res.status(400).send({
        message: 'Booking type is required'
      })
      return
    }

    // Separate queue based on doctor booking type
    const queue = booking.bookingType === 'vaccination' ? 'vaccination' : 'general';

    // Publish to RabbitMQ
    amqp.connect(process.env.RABBITMQ_URL!).then((conn) => {
      console.log('Connected to RabbitMQ what')
      
      return conn.createChannel().then((ch) => {
        ch.assertQueue(queue, {
          durable: true
        });
  
        ch.sendToQueue(queue, Buffer.from(JSON.stringify(booking)), {
          persistent: true
        });
      })
    })
  
    res.send({
      message: 'Booking successful'
    })
  }
  catch (err) {
    res.status(500).send({
      message: 'Internal server error'
    })
  }
})


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


