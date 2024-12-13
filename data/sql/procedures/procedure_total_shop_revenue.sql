CREATE OR ALTER PROCEDURE total_shop_revenue 
    @sd DATE, 
    @ed DATE,
    @shop_name      NVARCHAR(100)   = NULL, 
    @Min_Revenue    FLOAT           = NULL, 
    @Sort_Column    NVARCHAR(50)    = 'total_revenue', 
    @Sort_Order     NVARCHAR(4)     = 'DESC'
AS
BEGIN
    -- kiem tra du lieu dau vao
	IF @sd IS NULL AND @ed IS NULL
	BEGIN
		RAISERROR(N'@sd NULL, @ed NULL, phai cung cap ngay bat dau va ngay ket thuc', 16, 1);
		RETURN;
	END;
	ELSE IF @sd IS NULL
	BEGIN
		RAISERROR(N'@sd NULL, phai cung cap ngay bat dau', 16, 1);
		RETURN;
	END;
	ELSE IF @ed IS NULL
	BEGIN
		RAISERROR(N'@ed NULL, phai cung cap ngay ket thuc', 16, 1);
		RETURN;
	END;

	IF @sd > @ed
	BEGIN
		RAISERROR  ('Error: Ngay bat dau (@sd) phai som hon ngay ket thuc (@ed).', 16, 1);
		RETURN;
	END;

    IF NOT EXISTS (
        SELECT 1
        FROM Orders
        WHERE status = 'Completed'
            AND complete_date BETWEEN @sd AND @ed
    )
    BEGIN
        RAISERROR (N'Khong co don hang nao trong khoang thoi gian duoc nhap', 16, 1);
        RETURN;
    END;

	IF @shop_name IS NOT NULL
	BEGIN 
		IF NOT EXISTS (
			SELECT 1
			FROM Shops
			WHERE name = @shop_name
		)
		BEGIN
			RAISERROR ('Khong ton tai cua hang nao co ten @shop_name', 16, 1);
			RETURN;
		END;
	END;

	IF @Sort_Column NOT IN ('sid', 'total_revenue', 'shop_name')
	BEGIN
		RAISERROR ('Sap xep ORDER BY khong hop le @Sort_Column, chi cho phep sid, total_revenue, shop_name', 16, 1);
		RETURN;
	END;

	IF @Sort_Order NOT IN ('ASC', 'DESC')
	BEGIN 
		RAISERROR ('Thu tu sap xep khong hop le @Sort_Order, chi cho phep ASC, DESC', 16, 1);
		RETURN;
	END;

	-- Kiem tra tinh hop le cua sap xep
    IF @Sort_Column IS NULL
    BEGIN
        SET @Sort_Column = 'total_revenue'; -- Mac dinh sap xep theo doanh thu
    END;
	
	IF @Sort_Order IS NULL
    BEGIN
        SET @Sort_Order = 'DESC'; -- Mac dinh sap xep tang dan
    END;

    -- Tao truy van dong
    DECLARE @sql NVARCHAR(MAX);
    SET @sql = '
    SELECT 
        s.sid, s.name AS shop_name, SUM(o.total_value) AS total_revenue
    FROM Shops AS s
    JOIN Orders AS o ON o.sid = s.sid
    WHERE s.active = 1
        AND o.status = ''Completed''
        AND o.complete_date BETWEEN @sd AND @ed
        AND (@shop_name IS NULL OR s.name LIKE ''%'' + @shop_name + ''%'')
    GROUP BY s.sid, s.name
    HAVING (@Min_Revenue IS NULL OR SUM(o.total_value) >= @Min_Revenue)
    ORDER BY ' + QUOTENAME(@Sort_Column) + ' ' + @Sort_Order + ';';

    -- Thuc thi truy van dong
    EXEC sp_executesql 
        @sql,
        N'@sd DATE, @ed DATE, @shop_name NVARCHAR(100), @Min_Revenue FLOAT',
        @sd, @ed, @shop_name, @Min_Revenue;
END;

--EXEC total_shop_revenue 
    --@sd = '2024-12-16',			-- start date
    --@ed = '2024-12-31',			-- end date
    --@Shop_Name = N'Lụa Vàng',		-- Tim cua hang co ten 'Lua Vang'
    --@Min_Revenue = 18000001,		-- Loc doanh thu toi thieu
    --@Sort_Column = 'Shop_Name',	-- Sap xep theo ten cua hang
    --@Sort_Order = 'ASC';			-- Thu tu sap xep

EXEC total_shop_revenue 
    @sd = '2024-12-16',		
    @ed = '2024-12-31';

EXEC total_shop_revenue 
    @sd = '2024-12-16',         
    @ed = '2024-12-31',        
    @Shop_Name = N'Balo Xinh'; 

EXEC total_shop_revenue 
    @sd = '2024-12-16',			
    @ed = '2024-12-31',				
    @Sort_Column = 'shop_name',	
    @Sort_Order = 'ASC';
	
EXEC total_shop_revenue 
    @sd = '2024-12-16',			
    @ed = '2024-12-31',			
    @Min_Revenue = 18000001,	
    @Sort_Column = 'shop_name',	
    @Sort_Order = 'ASC';