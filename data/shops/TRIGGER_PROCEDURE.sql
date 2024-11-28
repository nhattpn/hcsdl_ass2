-- Trigger cập nhật đánh giá trung bình sản phẩm
CREATE TRIGGER shop_AvgRating
ON PRODUCT
AFTER INSERT, UPDATE
AS
BEGIN
    -- Cập nhật lại Avg_Rating cho từng shop ứng với từng sản phẩm
    DECLARE @ShopID varchar(8);

    -- Lấy ShopID của sản phẩm đã được thêm vào hoặc cập nhật
    SELECT @ShopID = ShopID FROM inserted;

    -- Cập nhật Avg_Rating cho ShopID
    UPDATE SHOP
    SET Avg_Rating = (
        SELECT AVG(Avg_Rating)
        FROM PRODUCT
        WHERE ShopID = @ShopID
    )
    WHERE ShopID = @ShopID;
    
    -- Đảm bảo rằng trigger hoạt động với tất cả các sản phẩm
END;

-- Procedure
CREATE PROCEDURE GetTotalRevenueByShop
AS
BEGIN
    SELECT 
        S.ShopID, 
        S.Name, 
        SUM(O.Total_value) AS total_revenue
    FROM 
        SHOP S
    JOIN 
        ORDER O 
    ON 
        S.ShopID = O.ShopID
    GROUP BY 
        S.ShopID, S.Name
    HAVING 
        SUM(O.Total_value) > 0;  -- Lọc các shop có doanh thu > 0
END;
EXEC GetTotalRevenueByShop

INSERT INTO [ORDER] (OID, ShopID, Total_value)
VALUES ('1', '25b61ea0', 150000),
       ('2', '25b61ea0', 250000),
       ('3', '25b61ea0', 320000);
