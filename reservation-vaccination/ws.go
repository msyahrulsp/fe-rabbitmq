package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

type Client struct {
	Conn *websocket.Conn
	Room *Room
}

type Message []byte

func (c *Client) Close() {
	c.Room.Unregister <- c
	c.Conn.Close()
}

func (c *Client) Send(message []byte) {
	if err := c.Conn.WriteMessage(websocket.TextMessage, message); err != nil {
		fmt.Println(err)
		return
	}
}

func (c *Client) StartPollEndConn() {
	for {
		if _, _, err := c.Conn.NextReader(); err != nil {
			break
		}
	}
	c.Close()
}

type Room struct {
	Register   chan *Client
	Unregister chan *Client
	Clients    map[*Client]bool
	Broadcast  chan Message
}

func NewRoom() *Room {
	return &Room{
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Clients:    make(map[*Client]bool),
		Broadcast:  make(chan Message),
	}
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func (room *Room) AddClient(w http.ResponseWriter, r *http.Request) *Client {
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Panicf("%s: %s", "Failed to upgrade connection", err)
	}

	client := &Client{
		Conn: ws,
		Room: room,
	}
	room.Register <- client
	go client.StartPollEndConn()

	return client
}

func (room *Room) Start() {
	for {
		select {
		case client := <-room.Register:
			room.Clients[client] = true
			fmt.Println("New client! Size of connection pool: ", len(room.Clients))
		case client := <-room.Unregister:
			delete(room.Clients, client)
			fmt.Println("Client dropped! Size of connection pool: ", len(room.Clients))
		case message := <-room.Broadcast:
			for client := range room.Clients {
				client.Send(message)
			}
		}
	}
}
