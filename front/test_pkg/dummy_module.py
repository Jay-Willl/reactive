# Define the size of the chessboard
N = 6

# Initialize the chessboard
board = [[0] * N for _ in range(N)]

# Function to print the solution
def print_solution(board):
    for row in board:
        print(' '.join('Q' if x else '.' for x in row))

# Function to check if a queen can be placed on board[row][col]
def is_safe(board, row, col):
    # Check the column on the left
    for i in range(col):
        if board[row][i] == 1:
            return False

    # Check upper diagonal on the left
    for i, j in zip(range(row, -1, -1), range(col, -1, -1)):
        if board[i][j] == 1:
            return False

    # Check lower diagonal on the left
    for i, j in zip(range(row, N, 1), range(col, -1, -1)):
        if board[i][j] == 1:
            return False

    # The position is safe for placing a queen
    return True

# Recursive utility function to solve N Queen problem
def solve_nq_util(board, col):
    # Base case: If all queens are placed, return true
    if col >= N:
        return True

    # Consider this column and try placing this queen in all rows one by one
    for i in range(N):
        # Check if the queen can be placed on board[i][col]
        if is_safe(board, i, col):
            # Place this queen in board[i][col]
            board[i][col] = 1

            # Recur to place the rest of the queens
            if solve_nq_util(board, col + 1) == True:
                return True

            # If placing queen in board[i][col] doesn't lead to a solution, then backtrack
            board[i][col] = 0

    # If the queen cannot be placed in any row in this column, return false
    return False

# Function to solve the N Queen problem using the backtracking approach
def solve_nq():
    if not solve_nq_util(board, 0):
        print("Solution does not exist")
        return False

    print_solution(board)
    return True

# Execute the algorithm
solve_nq()
