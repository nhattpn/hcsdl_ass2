CREATE OR ALTER TRIGGER update_avg_rating_shop
ON Products
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    --SET NOCOUNT ON;

    DECLARE @AffectedShop TABLE (sid UNIQUEIDENTIFIER);

    INSERT INTO @AffectedShop (sid)
    SELECT DISTINCT sid FROM INSERTED
    UNION
    SELECT DISTINCT sid FROM DELETED;

    UPDATE Shops
    SET avg_rating = (
        SELECT AVG(CAST(avg_rating AS FLOAT))
        FROM Products
        WHERE Products.sid = Shops.sid
    )
    WHERE Shops.sid IN (SELECT sid FROM @AffectedShop);
END;