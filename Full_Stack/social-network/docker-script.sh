#!/bin/bash

echo "Hold tight, it's gonna take a while..."

# Build Docker image for Golang backend
echo "Building Docker image for Golang backend..."
docker build -t backend-image ./backend

# Build Docker image for ReactJS frontend
echo "Building Docker image for ReactJS frontend..."
docker build -t frontend-image ./frontend

# Run Golang backend container
echo "Running Golang backend container..."
docker run -d -p 8080:8080 --name backend-container backend-image

# Run ReactJS frontend container
echo "Running ReactJS frontend container..."
docker run -d -p 3000:3000 --name frontend-container frontend-image

# Display container status
echo "Containers are running:"
docker ps

echo ""
echo "Info:"
echo ""
echo "*** Navigate to http://localhost:3000 to view the application. ***"
echo "To stop the application, run 'docker stop backend-container frontend-container'."
echo "To remove the application, run 'docker rm backend-container frontend-container'."
echo "To remove the images, run 'docker rmi backend-image frontend-image'."
