FROM golang:1.21.3-alpine
WORKDIR /app

RUN go install github.com/cosmtrek/air@latest

COPY go.mod go.sum ./

RUN go mod download
COPY *.go ./

CMD ["air"]