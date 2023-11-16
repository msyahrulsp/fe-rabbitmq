package main

import (
	"fmt"

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
