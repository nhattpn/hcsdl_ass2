USE TMDT_HCSDL;
GO

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