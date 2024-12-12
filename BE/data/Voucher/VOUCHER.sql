--tạo bảng voucher
CREATE TABLE VOUCHER (
    voucher_id			UNIQUEIDENTIFIER			PRIMARY KEY DEFAULT NEWID(),   
    ShopID				varchar(8)					NOT NULL,                        
    discount_percentage DECIMAL(5, 2),										
    discount_value		DECIMAL(10, 2),										
    min_spent			DECIMAL(10, 2),										 -- Giá trị tối thiểu cần mua để áp dụng voucher
    max_amount			DECIMAL(10, 2),										 -- Giá trị giảm tối đa 
    start_date			DATE,                            
    end_date			DATE,                              
    remaining_quantity	INT,                     
    discount_type		VARCHAR(10)					CHECK (discount_type IN ('percentage', 'fixed')),    -- Loại giảm giá: 'percentage' hoặc 'fixed'
    FOREIGN KEY (ShopID) REFERENCES SHOP(ShopID) ON DELETE CASCADE
);
--Thêm voucher mới cho cửa hàng:

INSERT INTO VOUCHER (voucher_id, ShopID, discount_percentage, discount_value, min_spent, max_amount, start_date, end_date, remaining_quantity, discount_type) 
VALUES 
    ('D701C111-3105-4F0B-BF81-180878AAB0D8', '52edc245', 15.00, NULL, 5000000, 100000, '2024-12-01', '2024-12-31', 100, 'percentage'); --tự nhập voucher_id

INSERT INTO VOUCHER (ShopID, discount_percentage, discount_value, min_spent, max_amount, start_date, end_date, remaining_quantity, discount_type)
VALUES 
    ('52edc245', 10.00, NULL, 500000, 100000, '2024-12-01', '2024-12-31', 100, 'percentage'),
    ('b7094204', NULL, 50000, 200000, NULL, '2024-12-05', '2024-12-25', 50, 'fixed'),
    ('aae59d1d', 15.00, NULL, 300000, 75000, '2024-11-28', '2024-12-15', 200, 'percentage'),
    ('c510562e', 20.00, NULL, 1000000, 200000, '2024-12-01', '2025-01-01', 150, 'percentage'),
    ('e04e2fb1', 30.00, NULL, 3000000, 1000000, '2024-11-25', '2024-12-25', 5, 'percentage');

--Cập nhật thông tin voucher
UPDATE VOUCHER
SET 
    discount_percentage = 20.00, 
    discount_value = NULL, 
    min_spent = 700000, 
    max_amount = 150000, 
    end_date = '2024-12-31', 
    remaining_quantity = 50, 
    discount_type = 'percentage'
WHERE voucher_id = 'D701C111-3105-4F0B-BF81-180878AAB0D8';
--Xóa voucher
DELETE FROM VOUCHER
WHERE voucher_id = 'D701C111-3105-4F0B-BF81-180878AAB0D8';

