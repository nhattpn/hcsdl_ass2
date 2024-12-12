
USE TMDT_HCSDL;
GO

--Hạng CUSTOMER được xác định dựa trên loyalty_point:

CREATE OR ALTER TRIGGER update_rank_cus
ON Customers
AFTER INSERT, UPDATE
AS
BEGIN

	DECLARE @uid UNIQUEIDENTIFIER;
	DECLARE @new_rank VARCHAR(100);
	DECLARE @new_loyalty_point INT;
	
	DECLARE Customer_cursor CURSOR FOR
		SELECT uid, loyalty_point
		FROM INSERTED;

	OPEN Customer_cursor;
	FETCH NEXT FROM Customer_cursor INTO @uid, @new_loyalty_point;

	WHILE @@FETCH_STATUS = 0
	BEGIN
		IF (@new_loyalty_point < 1000)
			SET @new_rank = 'default';
		ELSE IF (@new_loyalty_point < 10000)
			SET @new_rank = 'bronze';
		ELSE IF (@new_loyalty_point < 50000)
			SET @new_rank = 'silver';
		ELSE 
			SET @new_rank = 'gold';
		
		-- Ngăn vòng lập vô tận
		IF EXISTS (
			SELECT 1
			FROM Customers
			WHERE uid = @uid AND rank != @new_rank
		)
		BEGIN 
			UPDATE Customers
			SET rank = @new_rank
			WHERE uid = @uid;
		END;

		FETCH NEXT FROM Customer_cursor INTO @uid, @new_loyalty_point;
	END;

	CLOSE Customer_cursor;
	DEALLOCATE Customer_cursor;
END;



--INSERT INTO Customers 
--VALUES ('4C222B01-F1C5-4307-92A7-208E1FF2A80B', 'default', 500000);

--SELECT * FROM Customers;

--UPDATE Customers
--SET loyalty_point = loyalty_point / 1000
--WHERE uid = '4C222B01-F1C5-4307-92A7-208E1FF2A80B';

--DELETE FROM Customers;