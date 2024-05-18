import numpy as np

# 创建数组
a = np.array([1, 2, 3, 4, 5])
b = np.array([10, 20, 30, 40, 50])

print("Array a:", a)
print("Array b:", b)

# 数组的算术运算
c = a + b
d = a * b
e = a ** 2

print("\na + b:", c)
print("a * b:", d)
print("a ** 2:", e)

# 计算数组的统计量
mean_a = np.mean(a)
sum_b = np.sum(b)
max_a = np.max(a)
min_b = np.min(b)

print("\nMean of a:", mean_a)
print("Sum of b:", sum_b)
print("Max of a:", max_a)
print("Min of b:", min_b)

# 矩阵操作
matrix_1 = np.array([[1, 2], [3, 4]])
matrix_2 = np.array([[5, 6], [7, 8]])

# 矩阵乘法
matrix_product = np.dot(matrix_1, matrix_2)
# 矩阵转置
matrix_transpose = np.transpose(matrix_1)

print("\nMatrix 1:\n", matrix_1)
print("Matrix 2:\n", matrix_2)
print("Matrix product:\n", matrix_product)
print("Matrix transpose:\n", matrix_transpose)

# 使用布尔索引进行数组操作
a_filtered = a[a > 2]

print("\nFiltered array a (elements > 2):", a_filtered)
