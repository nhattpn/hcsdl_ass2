CREATE OR ALTER TRIGGER total_cart
ON Add_To_Carts
FOR INSERT, UPDATE, DELETE
AS
BEGIN
	UPDATE Carts
	SET total_amount = ISNULL((
		SELECT SUM(current_price * quantity) AS total_amount
		FROM Add_To_Carts AS a
		WHERE a.uid = Carts.uid
	), 0), 
		total_quantity = ISNULL((
		SELECT SUM(quantity) AS total_quantity
		FROM Add_To_Carts AS a
		WHERE a.uid = Carts.uid
	), 0)
	WHERE Carts.uid IN (
		SELECT DISTINCT uid 
		FROM (
			SELECT uid FROM INSERTED
			UNION
			SELECT uid FROM DELETED
		) AS affected
	);
END;

