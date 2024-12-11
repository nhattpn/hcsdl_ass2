--DROP PROCEDURE total_shop_revenue
CREATE OR ALTER PROCEDURE total_shop_revenue 
    @sd DATE, 
    @ed DATE,
    @shop_name      NVARCHAR(100)   = NULL, -- Tìm kiếm theo tên cửa hàng
    @Min_Revenue    FLOAT           = NULL, -- Bộ lọc doanh thu tối thiểu
    @Sort_Column    NVARCHAR(50)    = 'total_revenue', -- Cột sắp xếp
    @Sort_Order     NVARCHAR(4)     = 'DESC' -- Thứ tự sắp xếp (ASC/DESC)
AS
BEGIN
    -- Kiểm tra dữ liệu đầu vào
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

    -- Kiểm tra tính hợp lệ của cột sắp xếp
    IF @Sort_Column NOT IN ('sid', 'total_revenue', 'shop_name') OR @Sort_Column IS NULL
    BEGIN
        SET @Sort_Column = 'total_revenue'; -- Mặc định sắp xếp theo doanh thu
    END;
	
	IF @Sort_Order IS NULL
    BEGIN
        SET @Sort_Order = 'DESC'; -- Mặc định sắp xếp theo doanh thu
    END;

    -- Tạo truy vấn động
    DECLARE @sql NVARCHAR(MAX);
    SET @sql = '
    SELECT 
        s.sid, s.name AS shop_name, SUM(o.total_value) AS total_revenue
    FROM Shops AS s
    JOIN Orders AS o ON o.sid = s.sid
    WHERE o.status = ''Completed''
        AND o.complete_date BETWEEN @sd AND @ed
        AND (@shop_name IS NULL OR s.name LIKE ''%'' + @shop_name + ''%'')
    GROUP BY s.sid, s.name
    HAVING (@Min_Revenue IS NULL OR SUM(o.total_value) >= @Min_Revenue)
    ORDER BY ' + QUOTENAME(@Sort_Column) + ' ' + @Sort_Order + ';';

    -- Thực thi truy vấn động
    EXEC sp_executesql 
        @sql,
        N'@sd DATE, @ed DATE, @shop_name NVARCHAR(100), @Min_Revenue FLOAT',
        @sd, @ed, @shop_name, @Min_Revenue;
END;

EXEC total_shop_revenue 
    @sd = '2024-12-16',         -- Ngày bắt đầu
    @ed = '2024-12-31',        -- Ngày kết thúc
    --@Shop_Name = N'Lụa Vàng',   -- Tìm kiếm cửa hàng có tên chứa "Style Lab"
    --@Min_Revenue = 18000001,       -- Lọc doanh thu tối thiểu là 10,000
    --@Sort_Column = 'Shop_Name'; -- Sắp xếp theo tên cửa hàng
    @Sort_Order = 'ASC';        -- Thứ tự sắp xếp tăng dần
