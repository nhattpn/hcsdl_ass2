CREATE OR ALTER FUNCTION top_n_customers (@n INT, @sd DATE, @ed DATE)
RETURNS NVARCHAR(MAX)
AS
BEGIN
	IF @n <= 0
		RETURN 'Error: @n phai lon hon 0.';

	IF @sd > @ed
		RETURN 'Error: Ngay bat dau (@sd) phai som hon ngay ket thuc (@ed).';

	IF NOT EXISTS (
		SELECT 1
		FROM Orders
		WHERE status = 'Completed'
			AND complete_date BETWEEN @sd AND @ed
	)
		RETURN 'Khong co don hang nao duoc hoan thanh trong khoang thoi gian nay.';

	DECLARE @uid UNIQUEIDENTIFIER;
	DECLARE @total_spent FLOAT;
	DECLARE @result NVARCHAR(MAX) = '';

	DECLARE cur CURSOR FOR
	SELECT TOP (@n) cus.uid, SUM(ISNULL(o.total_value, 0))
	FROM Customers AS cus
	JOIN Orders AS o ON cus.uid = o.uid
	WHERE o.status = 'Completed'
		AND o.complete_date BETWEEN @sd AND @ed
	GROUP BY cus.uid
	ORDER BY SUM(o.total_value) DESC;

	OPEN cur;
	FETCH NEXT FROM cur INTO @uid, @total_spent;

	WHILE @@FETCH_STATUS = 0
	BEGIN
		SET @result = CONCAT(@result, 'Customer id: ', @uid, ', Total spent: ', @total_spent, CHAR(13), CHAR(10));

		FETCH NEXT FROM cur INTO @uid, @total_spent;
	END;

	CLOSE cur;
	DEALLOCATE cur;

	RETURN @result;
END; 

--SELECT cus.uid, SUM(ISNULL(o.total_value, 0))
--	FROM Customers AS cus
--	JOIN Orders AS o ON cus.uid = o.uid
--	WHERE o.status = 'Completed'
--		AND o.complete_date BETWEEN '2024-12-13' AND '2024-12-20'
--	GROUP BY cus.uid
--	ORDER BY SUM(o.total_value) DESC;

--SELECT dbo.top_n_customers (3, '2024-12-13', '2024-12-20');
--SELECT dbo.top_n_customers (2, '2024-12-15', '2024-12-20');