import math

# O(1) - Constant Time
# No matter how large the input 'arr' is, this takes one step.
def constant_example(arr):
    return arr[0] if arr else None

# O(log n) - Logarithmic Time
# Binary Search: Cutting the search area in half each iteration.
def logarithmic_example(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

# O(n) - Linear Time
# A single loop that visits every element once.
def linear_example(arr):
    for item in arr:
        print(item)

# O(n log n) - Linearithmic Time
# Typical for efficient sorts like Merge Sort.
def linearithmic_example(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = linearithmic_example(arr[:mid])
    right = linearithmic_example(arr[mid:])
    return sorted(left + right) # Simplified merge step

# O(n^2) - Quadratic Time
# Nested loops where we compare every element to every other element.
def quadratic_example(arr):
    n = len(arr)
    for i in range(n):
        for j in range(n):
            print(f"Comparing {arr[i]} and {arr[j]}")

# O(sqrt(n)) - Sublinear Time
# Trial division for primality testing.
def sqrt_n_example(n):
    if n < 2: return False
    for i in range(2, int(math.sqrt(n)) + 1):
        if n % i == 0:
            return False
    return True
