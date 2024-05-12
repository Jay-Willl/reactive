FROM python:3.9-slim

WORKDIR /usr/src/app
COPY . /usr/src/app

RUN pip install zmq

CMD ['python', 'server.py']
