FROM python:3.12.2-alpine3.19

# Install system dependencies
RUN apk add --no-cache \
    gcc \
    go \
    git \
    musl-dev \
    libxml2-dev \
    libxslt-dev \
    mariadb-dev \
    mysql-dev

# Set environment variables for mysqlclient
ENV MYSQLCLIENT_CFLAGS="-I/usr/include/mysql"
ENV MYSQLCLIENT_LDFLAGS="-L/usr/lib/mysql"

# Set the working directory
WORKDIR /robo/backend-flask

# Copy the application files into the container
COPY . .

# Clone gobuster
RUN git clone https://github.com/OJ/gobuster.git

# Build gobuster and move it to /usr/local/bin
WORKDIR /robo/backend-flask/gobuster
RUN go build
RUN mv gobuster /usr/local/bin

# Move back to the project directory and install Python dependencies
WORKDIR /robo/backend-flask
RUN pip install Flask[async]
RUN pip install Flask-Cors
RUN pip install requests
RUN pip install beautifulsoup4
RUN pip install mysql-connector-python
# RUN pip install mysqlclient --global-option=build_ext --global-option="-I/usr/include/mariadb" --global-option="-L/usr/lib"
RUN pip install Flask-MySQLdb
RUN pip install pyjwt
RUN pip install lxml

# Expose port 5000
EXPOSE 5000

# Define the command to run the server
CMD ["python", "servercommandv2.py"]
