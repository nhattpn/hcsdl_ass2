CREATE OR ALTER TRIGGER update_loyalty_points
ON Orders
AFTER INSERT, UPDATE
AS
BEGIN
    DECLARE @uid            UNIQUEIDENTIFIER;
    DECLARE @total_value    FLOAT;
    DECLARE @loyalty_points INT;

    -- Lấy giá trị từ bảng INSERTED
    DECLARE order_cursor CURSOR FOR
        SELECT uid, total_value
        FROM INSERTED;

    OPEN order_cursor;
    FETCH NEXT FROM order_cursor INTO @uid, @total_value;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        -- Tính toán loyalty_points: 1 điểm cho mỗi 1000₫
        SET @loyalty_points = FLOOR(@total_value / 1000);

        -- Cập nhật điểm khách hàng trong bảng Customers
        UPDATE C
        SET C.loyalty_point = C.loyalty_point + @loyalty_points
        FROM Customers C
        WHERE C.uid = @uid;

        FETCH NEXT FROM order_cursor INTO @uid, @total_value;
    END;

    CLOSE order_cursor;
    DEALLOCATE order_cursor;
END;