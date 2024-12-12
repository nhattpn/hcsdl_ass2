CREATE OR ALTER TRIGGER update_order
ON Order_Include
FOR INSERT, UPDATE, DELETE
AS
BEGIN
	UPDATE Orders
	SET total_value = ISNULL(dbo.cal_total_order (Orders.oid), 0),
		total_quantity = ISNULL((
			SELECT SUM(quantity)
			FROM Order_Include AS oi
			WHERE oi.oid = Orders.oid
			GROUP BY oi.oid
		), 0)
	WHERE Orders.oid IN (
		SELECT oid FROM INSERTED
		UNION
		SELECT oid FROM DELETED
	)
END;
