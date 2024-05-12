import zmq
import time

context = zmq.Context()
socket = context.socket(zmq.PUSH)
address = "tcp://0.0.0.0:5557"
socket.bind(address)
print("Sending to {}...".format(address))
while True:
    message = socket.send_string("Send message")
    print("Sent message")
    time.sleep(1)
