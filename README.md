This project have 3 main following branches
- main: for run locally via VSCODE + XAMPP for MYSQL+PHPMYADMIN by
  1) git clone this bracnch
  2) cd pjfinal -> npm install -> npm start
  3) cd server -> npm install -> npm start
  4) cd server-flask -> py server1.py
- testdocker: for run in your docker which IP still localhost
  1) git clone this branch
  2) docker run -d --build docker-compose.yml at root directory of project
- https://github.com/KittiyaD/projectfinal : This branch have changes the IP address to web server's IP to use in internal network
  1) git clone this branch
  2) docker run -d --build docker-compose.yml at root directory of project
