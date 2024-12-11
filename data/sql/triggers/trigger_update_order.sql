CREATE OR ALTER TRIGGER update_order
ON Order_Include
FOR INSERT, UPDATE, DELETE
AS
BEGIN
	UPDATE Orders
	SET total_value = ISNULL((
		SELECT SUM(price * quantity) AS total_amount
		FROM Order_Include AS oi1
		WHERE oi1.oid = Orders.oid
	), 0), 
		total_quantity = ISNULL((
		SELECT SUM(quantity) AS total_quantity
		FROM Order_Include AS oi2
		WHERE oi2.oid = Orders.oid
	), 0)
	WHERE Orders.oid IN (
		SELECT DISTINCT uid 
		FROM (
			SELECT oid FROM INSERTED
			UNION
			SELECT oid FROM DELETED
		) AS affected
	);
END;