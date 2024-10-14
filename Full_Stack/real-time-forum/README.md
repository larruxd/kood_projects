# Real-Time Forum

Welcome to the **Real-Time Forum**, an upgraded and feature-rich forum project built using HTML, JavaScript, Golang, and SQLite. This single-page application (SPA) provides users with the ability to register, login, create posts, comment on posts, and send private messages, all in real-time.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [Dependencies](#dependencies)
6. [Technologies](#technologies)
7. [Authors](#authors)


## Overview

The **Real-Time Forum** is a comprehensive project that incorporates both backend and frontend technologies. The key objectives include:

- **User Registration and Login**
- **Creation of Posts and Comments**
- **Real-Time Private Messaging**
- **Single-Page Application (SPA)**

## Features

### Registration and Login

- Users can register by providing their details, including **nickname**, **age**, **gender**, **first name**, **last name**, **email**, and **password**.
- Login can be done using either the **nickname** or **email** combined with the **password**.
- Users can log out from any page on the forum.

### Posts and Comments

- Users can create posts, categorized as in the first forum.
- Comments can be created on posts.
- Posts are displayed in a **feed** format.
- Comments are visible upon clicking on a post.

### Private Messages

- Users can send private messages to each other.
- The chat interface includes sections for **online/offline users**, organized by the last message sent.
- Users can send private messages to online users.
- Chat sections are always visible.
- When a user is selected to send a message, past messages are reloaded.
- Chat messages include **date** and **user identification**.
- Real-time messaging is achieved using **WebSockets**.

## Project Structure

The project consists of the following components:

- **SQLite**: Used to store data.
- **Golang**: Handles data and Websockets on the backend.
- **JavaScript**: Manages frontend events and client Websockets.
- **HTML**: Organizes page elements.
- **CSS**: Styles page elements.

## Getting Started

To get started with the **Real-Time Forum**, follow these steps:

1. **Clone the repository**.
2. **Run "go run ." in the terminal**.
3. **Go to [http://localhost:8080](http://localhost:8080)**.
4. **Register** or **log in** to start using the forum.
5. **User for testing is username: admin passsword: admin**.
6. **Audit questions are here [https://github.com/01-edu/public/tree/master/subjects/real-time-forum/audit](https://github.com/01-edu/public/tree/master/subjects/real-time-forum/audit)**

## Dependencies

- Go **standard packages**
- **Gorilla Websocket**
- **sqlite3**
- **bcrypt**
- **UUID**
- No frontend libraries or frameworks (e.g., React, Angular, Vue)

## Technologies

This project will help you learn and work with:

- **HTML, HTTP, sessions, and cookies**
- **CSS** for styling
- Backend and Frontend development
- **DOM manipulation**
- **Go routines and channels**
- **WebSockets** in both **Golang** and **JavaScript**
- **SQL language** and **database manipulation**


## Authors

[MarkusKa](https://01.kood.tech/git/MarkusKa)

[laurilaretei](https://01.kood.tech/git/laurilaretei)

[LizAshwood](https://01.kood.tech/git/LizAshwood)
