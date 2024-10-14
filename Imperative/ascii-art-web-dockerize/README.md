# Ascii-art-web-dockerize

## Description

Ascii-art-web-dockerize is a program with [ascii-art-web-export-file](https://01.kood.tech/git/maggieeagle/ascii-art-export-file) functionality, which also can be run in docker container.

## Authors

Orel Margarita @maggieeagle

## Usage

*To follow the next steps you need to have Docker installed*

 - Download the repository
 - Run `./dockerize.sh`. This will create an image of the application with `ascii-art` tag and run the container.
 - Have fun!

Useful functions:
 - To see the list of images run `sudo docker images`
 - To see the list of all containers run `sudo docker ps -a`
 - To start/stop container run `sudo docker start/stop container_name`
 - To remove container run `sudo docker rm container_name`
 - To clean your machine run `sudo docker system prune`

If you feel tired to write `sudo` all the time give your user root permissions:

    sudo groupadd docker
    sudo usermod -aG docker username
    su - username

    


