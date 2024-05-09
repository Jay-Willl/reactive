import zmq


def main():
    context = zmq.Context()
    socket = context.socket(zmq.PULL)
    socket.connect("tcp://server:5555")

    while True:
        task = socket.recv_string()
        result = f"Processed task: {task}"
        print(result)


if __name__ == "__main__":
    main()
