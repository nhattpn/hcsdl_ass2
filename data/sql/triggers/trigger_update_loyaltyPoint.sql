CREATE OR ALTER TRIGGER update_loyalty_points
ON Orders
AFTER INSERT, UPDATE
AS
BEGIN
    DECLARE @uid            UNIQUEIDENTIFIER;
    DECLARE @total_value    FLOAT;
    DECLARE @loyalty_points INT;

    DECLARE order_cursor CURSOR FOR
        SELECT uid, total_value
        FROM INSERTED;

    OPEN order_cursor;
    FETCH NEXT FROM order_cursor INTO @uid, @total_value;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        SET @loyalty_points = FLOOR(@total_value / 1000);

        UPDATE C
        SET C.loyalty_point = C.loyalty_point + @loyalty_points
        FROM Customers C
        WHERE C.uid = @uid;

        FETCH NEXT FROM order_cursor INTO @uid, @total_value;
    END;

    CLOSE order_cursor;
    DEALLOCATE order_cursor;
END;

SELECT cus.uid, o.oid, cus.loyalty_point, o.total_value
FROM Customers AS cus
JOIN Orders AS o ON o.uid = cus.uid
WHERE cus.uid = '7BE96FB6-3D73-4CB0-8CA9-DB34828E98A6';

SELECT s.sid, p.pid, p.current_price
FROM Shops AS s 
JOIN Products AS p ON p.sid = s.sid
WHERE s.sid = 'EC2A67AC-C4D1-4EF0-A376-B424194D8848';

SELECT NEWID();

INSERT INTO Orders VALUES
('FBC69EEC-5C76-4345-802A-0C0ED379BAD0', 'Free', '2024-12-20', 0, '5523 Walnut St', 'Gift order', '2024-12-19', '2024-12-19', '2024-12-05', 'Completed', '0032628B-5F2C-48BF-9927-E7CBD1B97844', 
	'Prepaid', 0, 0, '7BE96FB6-3D73-4CB0-8CA9-DB34828E98A6', 'EC2A67AC-C4D1-4EF0-A376-B424194D8848', '47EBC16D-9859-4431-877B-7697CE05884E', '15E8D088-676F-401C-A692-5303D5666651', '23D0FBED-3B16-4C28-926C-FF9E70B66732');

GO

INSERT INTO Order_Include VALUES
('FBC69EEC-5C76-4345-802A-0C0ED379BAD0', '1AB8CD31-925E-42FC-BFEB-0F76B3E8E2A4', 2, 0);