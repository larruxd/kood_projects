sudo docker build -f Dockerfile -t ascii-art . # create ascii-art image based on Dockerfile
echo -e ""
sudo docker run -p 8080:8080 ascii-art # create and run the container from ascii-art image