# from icecream import ic

def dummy_fib(n):
    if n < 2:
        return n
    return dummy_fib(n - 1) + dummy_fib(n - 2)

dummy_fib(5)
# ic(dummy_fib(5))
