package main

import (
	"encoding/json"
	"log"
	"os"

	amqp "github.com/rabbitmq/amqp091-go"

	"net/http"
)

var notifyMq = make(chan int)

func failOnError(err error, msg string) {
	if err != nil {
		log.Panicf("%s: %s", msg, err)
	}
}

type Booking struct {
	Id          *int    `json:"id"`
	Name        string  `json:"name"`
	Email       string  `json:"email"`
	Phone       string  `json:"phone"`
	Datetime    string  `json:"datetime"`
	Description *string `json:"description"`
}

var bookings []Booking = []Booking{}
var currentId = 0

func storeBooking(bookMsgs <-chan amqp.Delivery) {
	for d := range bookMsgs {
		var book Booking
		for err := json.Unmarshal(d.Body, &book); err != nil; {
			log.Printf("Error decoding JSON: %s", err)
		}
		log.Printf("Received a message: %v", book)

		id := currentId
		book.Id = &id
		bookings = append(bookings, book)

		currentId++
		notifyMq <- 1
	}
}

func handleRabbitMQ() {
	conn, err := amqp.Dial(os.Getenv("RABBITMQ_URL"))
	failOnError(err, "Failed to connect to RabbitMQ")
	defer conn.Close()

	ch, err := conn.Channel()
	failOnError(err, "Failed to open a channel")
	defer ch.Close()

	queueName := "general"

	q, err := ch.QueueDeclare(
		queueName, // name
		true,      // durable
		false,     // delete when unused
		false,     // exclusive
		false,     // no-wait
		nil,       // arguments
	)
	failOnError(err, "Failed to declare a queue")

	bookMsgs, err := ch.Consume(
		q.Name, // queue
		"",     // consumer
		true,   // auto-ack
		false,  // exclusive
		false,  // no-local
		false,  // no-wait
		nil,    // args
	)

	failOnError(err, "Failed to register a consumer")

	go storeBooking(bookMsgs)

	var forever chan struct{}

	log.Printf(" [*] Waiting for messages. To exit press CTRL+C")
	<-forever
}

type Response struct {
	Bookings []Booking `json:"bookings"`
}

func getBooking() []byte {
	message, err := json.Marshal(
		Response{
			Bookings: bookings,
		},
	)
	failOnError(err, "Failed to marshal JSON")
	return message
}

func broadcastBookingUpdate(room *Room) {
	for {
		log.Println("Waiting for update")
		<-notifyMq
		message := getBooking()
		log.Printf("Broadcasting message to all ws: %s", message)
		room.Broadcast <- message
	}
}

func main() {
	room := NewRoom()
	go room.Start()
	go handleRabbitMQ()
	go broadcastBookingUpdate(room)

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello World!"))
	})

	http.HandleFunc("/api/v1/bookings", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(
			Response{
				Bookings: bookings,
			},
		)
	})

	http.HandleFunc("/api/v1/bookings/ws", func(w http.ResponseWriter, r *http.Request) {
		c := room.AddClient(w, r)
		msg := getBooking()
		log.Printf("Sending message to ws: %s", msg)
		c.Send(msg)
	})

	err := http.ListenAndServe(":8081", nil)
	if err != nil {
		panic(err)
	}
}
