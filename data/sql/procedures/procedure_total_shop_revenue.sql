CREATE OR ALTER PROCEDURE total_shop_revenue (@sd DATE, @ed DATE)
AS
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM Orders
		WHERE status = 'Completed'
			AND complete_date BETWEEN @sd AND @ed
	)
	BEGIN
		RAISERROR (N'Không có đơn hàng nào hoàn thành trong khoảng thời gian được nhập', 16, 1);
		RETURN;
	END;

	SELECT s.sid, SUM(o.total_value) AS total_revenue
	FROM Shops AS s
	JOIN Orders AS o ON o.sid = s.sid
	WHERE o.status = 'Completed' AND o.complete_date BETWEEN @sd AND @ed
	GROUP BY s.sid
	ORDER BY SUM(o.total_value) DESC;
END;


--EXEC total_shop_revenue @sd = '2024-12-20', @ed = '2024-12-29';
--EXEC total_shop_revenue @sd = '2024-12-18', @ed = '2024-12-29';
--EXEC total_shop_revenue @sd = '2024-12-17', @ed = '2024-12-29';
--EXEC total_shop_revenue @sd = '2024-12-16', @ed = '2024-12-29';
--EXEC total_shop_revenue @sd = '2024-12-15', @ed = '2024-12-29';
