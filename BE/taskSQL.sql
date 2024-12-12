-- PHẢI TẠO THỦ TỤC NÀY TRƯỚC KHI TẠO TRIGGER VÌ NẾU KHÔNG NÓ SẼ CHẠY VÒNG LẶP VÔ HẠN--

/*
PROCEDURE
Mô tả thủ tục: Procedure lấy danh sách tất cả các đơn hàng (ORDER) kèm theo thông (tin chi tiết của khách hàng (CUSTOMER) liên quan. 
Kết quả được sắp xếp theo tổng giá trị đơn hàng (order price) giảm dần.
Procedure có thể được sử dụng để truy xuất thông tin khách hàng khi xử lý khiếu nại hoặc tạo báo cáo về doanh thu, nhận diện khách hàng tiềm năng....
Các thao tác chính:
1.  Sử dụng INNER JOIN để lấy dữ liệu từ các bảng Orders, Customers, Users, Shops thông qua các khoá uid, sid.
2.  Từ bảng ORDER:  Lấy OID đơn hàng, giá trị đơn hàng total_value (ORDER_PRICE), ngày đặt hàng start_date (ORDER_DATE) và trạng thái đơn(ORDER_STATUS). 
    Từ bảng CUSTOMER:   Lấy UID khách hàng và điểm khách hàng thân thiết (LOYALTY_POINT).
    Từ bảng Users:  Lấy sur_name, last_name để tạo thành tên đầy đủ của khách hàng (FULL_NAME) và email
    Từ bảng Shops:  Lấy name để tạo thành SHOP_NAME
3. Dữ liệu được sắp xếp giảm dần dựa trên ORDER_PRICE, giúp hiển thị các đơn hàng giá trị cao nhất trước.
Input:  Customer_ID, Status //có thể là 1 trong 2 nếu để trống thì xuất toàn bộ
Output: OID, ORDER_PRICE, ORDER_DATE, CUSTOMER_ID, FULL_NAME, EMAIL, LOYALTY_POINT, SHOP_NAME.
*/

--DROP PROCEDURE IF EXISTS OrdersWithCustomerDetails;
CREATE PROCEDURE OrdersWithCustomerDetails
    @Customer_ID    UNIQUEIDENTIFIER    = NULL,
    @Status         VARCHAR(50)         = NULL
AS
BEGIN
    SELECT 
        O.oid           AS OID,
        C.uid           AS CUSTOMER_ID,
        O.total_value   AS ORDER_PRICE,
        O.start_date    AS ORDER_DATE,
        S.name          AS SHOP_NAME,
        O.status        AS ORDER_STATUS,
        U.sur_name + ' ' + U.last_name AS FULL_NAME,
        U.email         AS EMAIL,
        C.loyalty_point AS LOYALTY_POINT
    FROM 
        Orders O
    INNER JOIN 
        Customers C ON O.uid = C.uid
    INNER JOIN 
        Users U     ON C.uid = U.uid
    INNER JOIN 
        Shops S     ON O.sid = S.sid
    WHERE 
        (@Customer_ID   IS NULL OR C.uid    = @Customer_ID)
        AND (@Status    IS NULL OR O.status = @Status)
    ORDER BY 
        O.total_value DESC;
END;

EXEC OrdersWithCustomerDetails;

--TRIGGER loyalty_point
/*
Mô tả trigger: Trigger tự động cập nhật điểm khách hàng thân thiết (loyalty_point) của mỗi khách hàng trong bảng CUSTOMER khí có thao tác INSERT hoặc UPDATE vào Bảng ORDER. Cứ 1000₫ trong giá trị đơn hàng được tỉnh 1 điểm.
Các thao tác chỉnh: khi ĐH thành công
    1. Lấy giá trị đơn hàng (total_value) và ID của khách hàng (uid) từ bảng INSERTED, chứa bản ghi mới được thêm hoặc cập nhật trong bảng ORDER.
    2. Mỗi 1,000₫ trong giá trị đơn hàng sẽ được tỉnh thành 1 điểm khách hàng thân thiết. Sử dụng hàm FLOOR để làm tròn xuống.
    3. Tìm kiếm khách hàng tương ứng theo uid và cộng thêm số điểm vừa tỉnh được vào trường loyalty_point.
*/
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
