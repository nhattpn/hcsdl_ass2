CREATE OR ALTER PROCEDURE total_shop_revenue (@sd DATE, @ed DATE)
AS
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM Orders
		WHERE status = 'Complete'
			AND complete_date BETWEEN @sd AND @ed
	)
	BEGIN
		RAISERROR (N'Không có đơn hàng nào hoàn thành trong khoảng thời gian được nhập', 16, 1);
		RETURN;
	END;

	SELECT s.sid, SUM(o.total_value) AS total_revenue
	FROM Shops AS s
	JOIN Orders AS o ON o.sid = s.sid
	WHERE o.status = 'Complete'
	GROUP BY s.sid
	HAVING o.complete_date BETWEEN @sd AND @ed
	ORDER BY SUM(o.total_value) DESC;
END;