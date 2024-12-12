CREATE OR ALTER TRIGGER update_avg_rating_product
ON Reviews
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    --SET NOCOUNT ON;

    DECLARE @AffectedProducts TABLE (pid UNIQUEIDENTIFIER);

    INSERT INTO @AffectedProducts (pid)
    SELECT DISTINCT pid FROM INSERTED
    UNION
    SELECT DISTINCT pid FROM DELETED;

    UPDATE Products
    SET avg_rating = ROUND((
        SELECT AVG(rating)
        FROM Reviews
        WHERE Reviews.pid = Products.pid
    ), 1)
    WHERE Products.pid IN (SELECT pid FROM @AffectedProducts);
END;