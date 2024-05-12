import zmq

context = zmq.Context()
socket = context.socket(zmq.PULL)
address = "tcp://server_test:5557"
socket.connect(address)
print("Listening to {}...".format(address))
while True:
    message = socket.recv_string()
    print("Client got message! {}".format(message))
