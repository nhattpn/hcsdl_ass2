CREATE OR ALTER TRIGGER update_total_order
ON Orders
FOR INSERT, UPDATE
AS
BEGIN
	DECLARE @total_amount FLOAT;
	DECLARE @total_quantity INT;
	DEClARE @oid UNIQUEIDENTIFIER;

	DECLARE cur CURSOR FOR
	SELECT oid 
	FROM INSERTED;

	OPEN cur;
	FETCH NEXT FROM cur INTO @oid;

	WHILE @@FETCH_STATUS = 0
	BEGIN
		SET @total_amount = dbo.cal_total_order(@oid);
		SET @total_quantity = (
			SELECT SUM(quantity)
			FROM Order_Include
			WHERE oid = @oid
		);

		IF EXISTS (
			SELECT 1
			FROM Orders
			WHERE oid = @oid
				AND (total_value != @total_amount OR total_quantity != @total_amount)
		)
		BEGIN
			UPDATE Orders
			SET total_quantity = @total_quantity, 
				total_value = @total_amount
			WHERE oid = @oid;
		END;
		
		FETCH  NEXT FROM cur INTO @oid;
	END;
	
	CLOSE cur;
	DEALLOCATE cur;
END;