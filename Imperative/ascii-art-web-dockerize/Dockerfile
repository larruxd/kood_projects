FROM golang:1.17-alpine3.15 

LABEL maintainer="Orel Margarita @maggieeagle <oryol.margo@gmail.com>"
WORKDIR /app                          
COPY . .                             
RUN go build -o application main.go   
CMD [ "/app/application" ]      