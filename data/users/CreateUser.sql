INSERT INTO [Users] (NAME, EMAIL)
VALUES (@NAME, @EMAIL);

SELECT SCOPE_IDENTITY() AS ID;