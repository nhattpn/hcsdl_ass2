CREATE OR ALTER PROCEDURE update_product
    @pid UNIQUEIDENTIFIER = NULL,
    @image VARCHAR(100) = NULL,
    @manufactor_date DATE = NULL,
    @current_price FLOAT = NULL,
    @name NVARCHAR(100) = NULL,
    @description NTEXT = NULL,
    @avg_rating DECIMAL(2, 1) = NULL,
    @remain_quantity INT = NULL,
    @bid UNIQUEIDENTIFIER = NULL,
    @cid UNIQUEIDENTIFIER = NULL,
    @sid UNIQUEIDENTIFIER = NULL
AS
BEGIN 
	IF @current_price IS NOT NULL AND @current_price < 0
    BEGIN
        RAISERROR('Error: Gia hien tai @current_price khong the am.', 16, 1);
        RETURN;
    END;

    IF @remain_quantity IS NOT NULL AND @remain_quantity < 0
    BEGIN
        RAISERROR('Error: So luong con lai @remain_quantity khong the am.', 16, 1);
        RETURN;
    END;

    IF @manufactor_date IS NOT NULL AND @manufactor_date > GETDATE()
    BEGIN
        RAISERROR('Error: Ngay san xuat @manufactor_date khong the o trong tuong lai duoc :)).', 16, 1);
        RETURN;
    END;

	IF @pid IS NOT NULL AND NOT EXISTS (
        SELECT 1
        FROM Products
        WHERE pid = @pid
    ) 
    BEGIN
        RAISERROR('Error: Product @pid khong ton tai', 16, 1);
        RETURN;
    END;

    IF @bid IS NOT NULL AND NOT EXISTS (
        SELECT 1
        FROM Brands
        WHERE bid = @bid
    )
    BEGIN
        RAISERROR('Error: Brand @bid khong ton tai', 16, 1);
        RETURN;
    END;

    IF @cid IS NOT NULL AND NOT EXISTS (
        SELECT 1
        FROM Categories
        WHERE cid = @cid
    )
    BEGIN
        RAISERROR('Error: Category @cid khong ton tai', 16, 1);
        RETURN;
    END;

    IF @sid IS NOT NULL AND NOT EXISTS (
        SELECT 1
        FROM Shops
        WHERE sid = @sid AND active = 1
    ) 
    BEGIN
        RAISERROR('Error: Shop @sid khong ton tai hoac shop khong con hoat dong', 16, 1);
        RETURN;
    END;
   
    IF @avg_rating IS NOT NULL AND (@avg_rating < 0 OR @avg_rating > 5)
    BEGIN
        RAISERROR('Error: @avg_rating phai trong khoang 0 den 5.', 16, 1);
        RETURN;
    END;

	UPDATE Products
    SET 
        image = COALESCE(@image, image),
        manufactor_date = COALESCE(@manufactor_date, manufactor_date),
        current_price = COALESCE(@current_price, current_price),
        name = COALESCE(@name, name),
        description = COALESCE(@description, Description),
        avg_rating = COALESCE(@avg_rating, Avg_Rating),
        remain_quantity = COALESCE(@remain_quantity, remain_quantity),
        bid = COALESCE(@bid, bid),
        cid = COALESCE(@cid, cid),
        sid = COALESCE(@sid, sid)
    WHERE pid = @pid;

	IF @@ROWCOUNT = 0
	BEGIN 
        RAISERROR('Khong the chinh sua san pham', 16, 1);
		RETURN;
	END;

	PRINT ('Sua san pham thanh cong');
END;
GO

EXEC update_product 
	@pid = '35450961-7C22-4D8E-A569-5F13BFA46F24',
    @current_price = 300000;
