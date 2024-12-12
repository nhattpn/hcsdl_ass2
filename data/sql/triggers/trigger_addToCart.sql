CREATE OR ALTER TRIGGER get_currentPrice
ON Add_To_Carts
FOR INSERT, UPDATE
AS
BEGIN
	UPDATE a
	SET a.current_price = p.current_price
	FROM Add_To_Carts AS a
	JOIN Products AS p ON p.pid = a.pid
	JOIN INSERTED AS i ON i.pid = a.pid AND i.uid = a.uid
	WHERE p.current_price != i.current_price;
END;