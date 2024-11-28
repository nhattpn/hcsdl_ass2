CREATE TABLE USERS (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(50) UNIQUE,
    password NVARCHAR(255)
);

CREATE TABLE CUSTOMER (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT,  -- Khóa ngoại liên kết với bảng USERS
    sur_name NVARCHAR(50),
    last_name NVARCHAR(50),
    gender NVARCHAR(10),
    uid NVARCHAR(50) UNIQUE,
    birthdate DATE,
    email NVARCHAR(100),
    loyalty_point INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES USERS(id)  -- Liên kết với bảng USERS
);
CREATE TABLE SELLER (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT,  -- Khóa ngoại liên kết với bảng USERS
    name NVARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES USERS(id)  -- Liên kết với bảng USERS
);

-- Thêm nhiều bản ghi vào bảng USERS
INSERT INTO USERS (username, password)
VALUES 
('nguyen.anhh', 'password123'),
('le.quang', 'password456'),
('pham.tuan', 'password789'),
('hoang.minh', 'password101'),
('trinh.lan', 'password112');
-- Thêm nhiều bản ghi vào bảng CUSTOMER
INSERT INTO CUSTOMER (user_id, sur_name, last_name, gender, uid, birthdate, email)
VALUES
(1, 'Nguyen', 'Anh', 'Male', 'UID12345', '1990-01-01', 'nguyen.anh@example.com'),
(2, 'Le', 'Quang', 'Male', 'UID12346', '1988-02-15', 'le.quang@example.com'),
(3, 'Pham', 'Tuan', 'Male', 'UID12347', '1995-05-25', 'pham.tuan@example.com'),
(4, 'Hoang', 'Minh', 'Male', 'UID12348', '1992-08-10', 'hoang.minh@example.com'),
(5, 'Trinh', 'Lan', 'Female', 'UID12349', '1993-07-20', 'trinh.lan@example.com');
-- Thêm nhiều bản ghi vào bảng SELLER
INSERT INTO SELLER (user_id, name)
VALUES
(1, 'Seller ABC'),
(2, 'Seller XYZ'),
(3, 'Seller LMN'),
(4, 'Seller PQR'),
(5, 'Seller DEF');
-- kiểm tra bảng
SELECT U.username, 
       C.sur_name, 
       C.last_name, 
       C.email, 
       S.name AS seller_name
FROM USERS U
LEFT JOIN CUSTOMER C ON U.id = C.user_id
LEFT JOIN SELLER S ON U.id = S.user_id;

