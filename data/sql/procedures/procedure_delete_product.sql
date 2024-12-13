CREATE OR ALTER PROCEDURE delete_product
	@pid UNIQUEIDENTIFIER = NULL
AS
BEGIN
	IF @pid IS NULL
	BEGIN 
		RAISERROR ('@pid NULL', 16, 1);
		RETURN;
	END;

	IF NOT EXISTS (
		SELECT 1
		FROM Products
		WHERE pid = @pid
	)
	BEGIN
		RAISERROR ('Khong ton tai @pid', 16, 1);
		RETURN;
	END;

	DELETE FROM Products
    WHERE pid = @pid;

    IF @@ROWCOUNT = 0
    BEGIN
        RAISERROR ('Error: Khong the xoa san pham.', 16, 1);
        RETURN;
    END;

    PRINT 'Xoa san pham thanh cong.';
END;


--EXEC delete_product @pid = '35450961-7C22-4D8E-A569-5F13BFA46F24';