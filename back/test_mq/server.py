import zmq
import time

def main():
    context = zmq.Context()
    socket = context.socket(zmq.PUSH)
    socket.bind("tcp://*:5555")

    while True:
        # 模拟接收用户请求
        task = "Hello " + time.ctime()
        print(f"Sending task: {task}")
        socket.send_string(task)
        time.sleep(5)

if __name__ == "__main__":
    main()
