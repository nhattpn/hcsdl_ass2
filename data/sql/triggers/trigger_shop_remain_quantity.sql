CREATE OR ALTER TRIGGER update_remain_quantity
ON Order_Include
FOR INSERT
AS
BEGIN
	DECLARE @pid UNIQUEIDENTIFIER;
	DECLARE @quantity INT;

	DECLARE cur_remain CURSOR FOR
	SELECT pid, quantity
	FROM INSERTED;

	OPEN cur_remain;
	FETCH NEXT FROM cur_remain INTO @pid, @quantity;

	WHILE @@FETCH_STATUS = 0
	BEGIN
		UPDATE Products
		SET remain_quantity -= @quantity
		WHERE pid = @pid;

		FETCH NEXT FROM cur_remain INTO @pid, @quantity;
	END;

	CLOSE cur_remain;
	DEALLOCATE cur_remain;
END;
