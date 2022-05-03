#build
FROM golang:latest AS builder   
COPY ./backend /work 
WORKDIR /work  
# for test 
RUN go mod download 
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /work/server ./main.go 
#CMD [ "/work/chuuni-battle-game-server" ]

# entry point
FROM busybox:latest AS release 
WORKDIR /bin 
COPY --from=builder /work/server /bin/server  
CMD ["/bin/server"]
