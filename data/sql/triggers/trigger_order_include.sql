CREATE OR ALTER TRIGGER get_price_order
ON Order_Include
FOR INSERT, UPDATE
AS
BEGIN
	UPDATE oi
	SET oi.price = p.current_price
	FROM Order_Include AS oi
	JOIN Products AS p ON p.pid = oi.pid
	JOIN INSERTED AS i ON i.pid = oi.pid AND i.oid = oi.oid
	WHERE p.current_price != oi.price;
END;