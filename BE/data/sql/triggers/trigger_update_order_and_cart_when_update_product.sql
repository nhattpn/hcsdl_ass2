CREATE OR ALTER TRIGGER update_cart_product
ON Products
FOR UPDATE
AS
BEGIN
	DECLARE @current_price FLOAT;
	DECLARE @uid UNIQUEIDENTIFIER;

	DECLARE cur CURSOR FOR
	SELECT a.uid, i.current_price
	FROM Add_To_Carts AS a
	JOIN INSERTED AS i ON a.pid = i.pid
	WHERE a.current_price != i.current_price;

	OPEN cur;
	FETCH NEXT FROM cur INTO @uid, @current_price;

	WHILE @@FETCH_STATUS = 0
	BEGIN 
		UPDATE Add_To_Carts 
		SET current_price = @current_price
		WHERE uid = @uid;

		FETCH NEXT FROM cur INTO @uid, @current_price;
	END;

	CLOSE cur;
	DEALLOCATE cur;
END;