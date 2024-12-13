CREATE OR ALTER FUNCTION cal_total_order (@oid UNIQUEIDENTIFIER)
RETURNS FLOAT
AS
BEGIN
	DECLARE @total_amount FLOAT = 0;
	DECLARE @voucher_amount FLOAT = 0;
	DECLARE @result FLOAT;

	IF NOT EXISTS (
		SELECT 1
		FROM Orders
		WHERE @oid = oid
	)
		RETURN NULL;

	-- get total_amount before applying voucher
	DECLARE @quantity INT;
	DECLARE @price FLOAT;

	DECLARE cur CURSOR FOR
	SELECT price, quantity
	FROM Order_Include
	WHERE oid = @oid;

	OPEN cur;
	FETCH NEXT FROM cur INTO @price, @quantity;

	WHILE @@FETCH_STATUS = 0
	BEGIN
		SET @total_amount += @price * @quantity;
		FETCH NEXT FROM cur INTO @price, @quantity;
	END;

	CLOSE cur;
	DEALLOCATE cur;
	
	-- get voucher
	DECLARE @vid UNIQUEIDENTIFIER;
	DECLARE @max_amount INT;
	DECLARE @min_spent INT;

	SELECT @vid = v.vid,
           @max_amount = v.max_amount, 
           @min_spent = v.min_spent, 
           @voucher_amount = CASE 
               WHEN v.dis_type = 'value' THEN dis_val
               WHEN v.dis_type = 'percentage' THEN @total_amount * dis_percent / 100
               ELSE NULL
           END
    FROM Vouchers AS v
    JOIN Orders AS o ON o.vid = v.vid
    WHERE o.oid = @oid;

	IF @vid IS NULL
		RETURN @total_amount;

	IF @voucher_amount IS NULL
		RETURN NULL;

	IF (@min_spent IS NOT NULL AND @total_amount < @min_spent)
		RETURN @total_amount;

	IF (@max_amount IS NOT NULL AND @voucher_amount > @max_amount)
		SET @voucher_amount = @max_amount;

	SET @result = @total_amount - @voucher_amount;	
	RETURN @result;
END;


--SELECT dbo.cal_total_order ('D5563116-4614-417E-AE3C-6A5BEF5EF042');
--SELECT dbo.cal_total_order ('31267B5C-5C6C-4F4D-ACC3-F01EE7D7D120');
--SELECT dbo.cal_total_order ('4533210F-B8CB-473A-AF4E-0771B2175221');