CREATE OR ALTER PROCEDURE OrdersWithCustomerDetails
    @Customer_ID    UNIQUEIDENTIFIER    = NULL,
    @Status         VARCHAR(50)         = NULL
AS
BEGIN
	IF @Customer_ID IS NULL AND @Status IS NULL
	BEGIN
		RAISERROR(N'@Customer_ID NULL, @Status NULL, phai cung cap id cua Customer va status cua don hang', 16, 1);
		RETURN;
	END;
	ELSE IF @Customer_ID IS NULL
	BEGIN
		RAISERROR(N'@Customer_ID NULL, phai cung cap id cua Customer', 16, 1);
		RETURN;
	END;
	ELSE IF @Status IS NULL
	BEGIN
		RAISERROR(N'@Status NULL, phai cung cap status cua don hang', 16, 1);
		RETURN;
	END;

	IF NOT EXISTS (
		SELECT 1
		FROM Customers
		WHERE uid = @Customer_ID
	)
	BEGIN
		RAISERROR ('Khong ton tai khach hang co id la @Customer_ID', 16, 1);
		RETURN;
	END;
	ELSE IF NOT EXISTS (
		SELECT 1
		FROM Customers AS cus
		JOIN Orders AS o ON cus.uid = o.uid
		WHERE cus.uid = @Customer_ID
			AND o.status = @Status
	)
	BEGIN
		RAISERROR ('Khach hang khong co don hang nao co trang thai la @Status', 16, 1);
		RETURN;
	END;

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
    WHERE C.uid = @Customer_ID
        AND O.status = @Status
    ORDER BY 
        O.total_value DESC;
END;

--SELECT * FROM Customers;
--SELECT * FROM Orders;

--EXEC OrdersWithCustomerDetails @Customer_ID = 'B74E67B5-3FAA-4E14-8CC5-0741B34AC1F7', @Status = 'Completed';

--EXEC OrdersWithCustomerDetails @Customer_ID = '4E9C06F4-9CC0-4466-90BA-D24DDE3D9951', @Status = 'Processing';

--EXEC OrdersWithCustomerDetails @Customer_ID = '6A1902EC-83B5-4EF9-BEEC-D9EDA8780AD3', @Status = 'Shipped';

--EXEC OrdersWithCustomerDetails;