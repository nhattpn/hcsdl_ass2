CREATE TRIGGER UpdateLoyaltyPoint
ON "ORDER"
AFTER INSERT, UPDATE
AS
BEGIN
    -- Cập nhật loyalty_point cho CUSTOMER sau khi INSERT hoặc UPDATE vào bảng ORDER
    DECLARE @customer_id INT;
    DECLARE @order_amount DECIMAL(10, 2);
    -- Lấy thông tin từ bản ghi vừa được INSERT hoặc UPDATE
    SELECT @customer_id = customer_id, @price = order_amount
    FROM INSERTED;

    -- Cập nhật loyalty_point cho CUSTOMER
    UPDATE CUSTOMER
    SET loyalty_point = loyalty_point + FLOOR(@price / 1000)  -- Cộng 1 điểm cho mỗi 100 đơn vị tiền
    WHERE id = @customer_id;
END;
