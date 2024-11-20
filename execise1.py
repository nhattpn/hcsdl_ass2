def print_triangle(h):
    # Duyệt qua từng tầng của tam giác
    for i in range(1, h + 1):
        # Khởi tạo mảng cho mỗi tầng
        row = []
        # Tầng thứ i có i phần tử
        for j in range(1, i + 1):
            if j == 1 or j == i:
                row.append(1)  # Phần tử ở đầu và cuối là 1
            else:
                row.append(row[j - 2] + row[j - 1])  # Cộng 2 số ở phía trước
        # In ra tầng i
        print(' '.join(map(str, row)))

# Ví dụ sử dụng với h = 3
h = int(input("Nhập chiều cao h: "))
print_triangle(h)
