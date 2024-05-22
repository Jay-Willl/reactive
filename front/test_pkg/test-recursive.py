N = 6
board = [[0] * N for _ in range(N)]


def print_solution(board):
    for row in board:
        print(' '.join('Q' if x else '.' for x in row))


def is_safe(board, row, col):
    for i in range(col):
        if board[row][i] == 1:
            return False
    for i, j in zip(range(row, -1, -1), range(col, -1, -1)):
        if board[i][j] == 1:
            return False
    for i, j in zip(range(row, N, 1), range(col, -1, -1)):
        if board[i][j] == 1:
            return False
    return True


def solve_nq_util(board, col):
    if col >= N:
        return True
    for i in range(N):
        if is_safe(board, i, col):
            board[i][col] = 1
            if solve_nq_util(board, col + 1) == True:
                return True
            board[i][col] = 0
    return False


def solve_nq():
    if not solve_nq_util(board, 0):
        print("Solution does not exist")
        return False
    print_solution(board)
    return True


solve_nq()

call_count = {}


def count_calls(func):
    def wrapper(*args, **kwargs):
        key = func.__name__
        call_count[key] = call_count.get(key, 0) + 1
        return func(*args, **kwargs)

    return wrapper


@count_calls
def factorial(n):
    if n == 0:
        return 1
    else:
        return n * factorial(n - 1)


@count_calls
def fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n - 1) + fibonacci(n - 2)


@count_calls
def sum_recursive(n):
    if n == 0:
        return 0
    else:
        return n + sum_recursive(n - 1)


@count_calls
def sum_iterative(n):
    total = 0
    for i in range(n + 1):
        total += i
        sum_recursive(0)
    return total


@count_calls
def direct_call(n):
    return n


factorial(5)
factorial(5)
fibonacci(6)
sum_recursive(10)
sum_iterative(5)
direct_call(10)

print("Function call statistics:")
for func, count in call_count.items():
    print(f"{func}: Total Calls = {count}")
