#build
FROM golang:latest AS builder   
COPY . /work 
WORKDIR /work  
# for test 
RUN go mod download 
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o server-bin ./main.go 

# entry point
FROM busybox:latest AS release 
WORKDIR /bin 
COPY --from=builder /work/server-bin /bin/server  
ENTRYPOINT /bin/server
