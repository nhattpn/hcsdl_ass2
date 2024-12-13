CREATE OR ALTER PROCEDURE insert_product
    @pid UNIQUEIDENTIFIER,
    @image VARCHAR(100) = NULL,
    @manufactor_date DATE,
    @current_price FLOAT,
    @name NVARCHAR(100),
    @description NTEXT = NULL,
    @avg_rating DECIMAL(2, 1) = NULL,
    @remain_quantity INT,
    @bid UNIQUEIDENTIFIER,
    @cid UNIQUEIDENTIFIER,
    @sid UNIQUEIDENTIFIER
AS
BEGIN
    BEGIN TRY
        IF @current_price < 0
        BEGIN
            RAISERROR('Error: Gia hien tai @current_price khong the am.', 16, 1);
            RETURN;
        END;

        IF @remain_quantity < 0
        BEGIN
            RAISERROR('Error: So luong con lai @remain_quantity khong the am.', 16, 1);
            RETURN;
        END;

        IF @manufactor_date > GETDATE()
        BEGIN
            RAISERROR('Error: Ngay san xuat @manufactor_date khong the o trong tuong lai duoc :)).', 16, 1);
            RETURN;
        END;

        IF NOT EXISTS (
            SELECT 1
            FROM Brands
            WHERE bid = @bid
        )
        BEGIN
            RAISERROR('Error: Brand @bid khong ton tai', 16, 1);
            RETURN;
        END;

        IF NOT EXISTS (
            SELECT 1
            FROM Categories
            WHERE cid = @cid
        )
        BEGIN
            RAISERROR('Error: Category @cid khong ton tai', 16, 1);
            RETURN;
        END;

        IF NOT EXISTS (
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

		IF @pid IS NULL
		BEGIN 
			RAISERROR ('Thieu @pid', 16, 1);
			RETURN;
		END;

		IF @manufactor_date IS NULL
		BEGIN 
			RAISERROR ('Thieu @manufactor_date', 16, 1);
			RETURN;
		END;

		IF @current_price IS NULL
		BEGIN 
			RAISERROR ('Thieu @current_price', 16, 1);
			RETURN;
		END;

		IF @name IS NULL
		BEGIN 
			RAISERROR ('Thieu @name', 16, 1);
			RETURN;
		END;

		IF @remain_quantity IS NULL
		BEGIN 
			RAISERROR ('Thieu @remain_quantity', 16, 1);
			RETURN;
		END;

		IF @bid IS NULL
		BEGIN 
			RAISERROR ('Thieu @bid', 16, 1);
			RETURN;
		END;

		IF @cid IS NULL
		BEGIN 
			RAISERROR ('Thieu @cid', 16, 1);
			RETURN;
		END;

		IF @sid IS NULL
		BEGIN 
			RAISERROR ('Thieu @sid', 16, 1);
			RETURN;
		END;

        INSERT INTO Products VALUES 
		(@pid, @image, @manufactor_date, @current_price, @name, @description, @avg_rating, @remain_quantity, @bid, @cid, @sid);

        PRINT 'Them san pham thanh cong.';
    END TRY
    BEGIN CATCH
        DECLARE @error_message NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @error_severity INT = ERROR_SEVERITY();
        DECLARE @error_state INT = ERROR_STATE();
        
        RAISERROR (@error_message, @error_severity, @error_state);
    END CATCH
END;
GO

--SELECT sid FROM Shops;
--SELECT bid FROM Brands;
--SELECT cid FROM Categories;
--SELECT NEWID();

--DELETE FROM Products
--WHERE pid = '35450961-7C22-4D8E-A569-5F13BFA46F24';

--SELECT * FROM Products;

--EXEC insert_product 
--	@pid = '35450961-7C22-4D8E-A569-5F13BFA46F24',
--	@image = 'not_an_image.png',
--    @manufactor_date = '2023-12-05',
--    @current_price = 2800000,
--    @name = 'success is temporary',
--    @description = 'death is permanent',
--    @avg_rating = NULL,
--    @remain_quantity = 67,
--    @bid = '885CD347-61ED-4315-8E0C-8F1F48F496E6',
--    @cid = '47A48B3D-1564-4F52-88D0-7EC6A6D7738B',
--    @sid = 'EC2A67AC-C4D1-4EF0-A376-B424194D8848';

--EXEC insert_product 
--	@pid = '35450961-7C22-4D8E-A569-5F13BFA46F24',
--	@image = 'not_an_image.png',
--    @manufactor_date = '2025-12-05',
--    @current_price = 2800000,
--    @name = 'success is temporary',
--    @description = 'death is permanent',
--    @avg_rating = NULL,
--    @remain_quantity = 67,
--    @bid = '885CD347-61ED-4315-8E0C-8F1F48F496E6',
--    @cid = '47A48B3D-1564-4F52-88D0-7EC6A6D7738B',
--    @sid = 'EC2A67AC-C4D1-4EF0-A376-B424194D8848';

--EXEC insert_product 
--	@pid = '35450961-7C22-4D8E-A569-5F13BFA46F24',
--	@image = 'not_an_image.png',
--    @manufactor_date = '2020-12-05',
--    @current_price = 2800000,
--    @name = 'success is temporary',
--    @description = 'death is permanent',
--    @avg_rating = NULL,
--    @remain_quantity = 67,
--    @bid = '885CD347-61ED-4315-8E0C-8F1F48F496E6',
--    @cid = '47A48B3D-1564-4F52-88D0-7EC6A6D77381',
--    @sid = 'EC2A67AC-C4D1-4EF0-A376-B424194D8848';