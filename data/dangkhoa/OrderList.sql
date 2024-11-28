CREATE PROCEDURE GetAllOrdersWithCustomerInfo
AS
BEGIN
    -- Lấy danh sách tất cả ORDER với thông tin CUSTOMER liên quan
    -- Sắp xếp theo tổng giá trị (order_amount) giảm dần
    SELECT 
        O.id AS OrID, 
        O.order_price, 
        O.order_date, 
        C.id AS customer_id, 
        C.sur_name, 
        C.last_name, 
        C.email, 
        C.loyalty_point
    FROM 
        [ORDER] O
    INNER JOIN 
        CUSTOMER C ON O.customer_id = C.id
    ORDER BY 
        O.order_price DESC;  -- Sắp xếp theo order_price giảm dần
END;
