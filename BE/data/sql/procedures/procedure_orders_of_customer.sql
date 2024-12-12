CREATE OR ALTER PROCEDURE OrdersWithCustomerDetails
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