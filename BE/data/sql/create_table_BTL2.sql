CREATE DATABASE TMDT_HCSDL
GO


USE TMDT_HCSDL
GO

-- Tao bang Users --

CREATE TABLE Users (
	uid			UNIQUEIDENTIFIER	NOT NULL PRIMARY KEY,
	sur_name	NVARCHAR(100),
	last_name	NVARCHAR(100)		NOT NULL,
	username	VARCHAR(100)		NOT NULL UNIQUE,
	password	VARCHAR(100)		NOT NULL,
	gender		CHAR,
	birthdate	DATE,
	email		VARCHAR(100)
);
GO

CREATE TABLE U_Addresses (
	uid			UNIQUEIDENTIFIER	NOT NULL,
	address		NTEXT				NOT NULL,
	FOREIGN KEY (uid) REFERENCES Users(uid) ON DELETE CASCADE
);
GO

CREATE TABLE U_Phones (
	uid			UNIQUEIDENTIFIER	NOT NULL,
	phone		CHAR(11)			NOT NULL,
	FOREIGN KEY (uid) REFERENCES Users(uid) ON DELETE CASCADE
);
GO

-------------------------- Bank_accounts -------------------------------

CREATE TABLE Bank_Accounts (
	bank_id			UNIQUEIDENTIFIER	NOT NULL,
	uid				UNIQUEIDENTIFIER	NOT NULL,
	account_number	VARCHAR(100)		NOT NULL UNIQUE,
	bank_name		VARCHAR(100)		NOT NULL,
	PRIMARY KEY (bank_id, uid),
	FOREIGN KEY (uid) REFERENCES Users(uid) ON DELETE CASCADE
);
GO
-------------------------- Customers -------------------------------

CREATE TABLE Customers (
	uid				UNIQUEIDENTIFIER	NOT NULL PRIMARY KEY,
	rank			VARCHAR(100)		NOT NULL,
	loyalty_point	INT					NOT NULL,
	CONSTRAINT chk_rank CHECK (rank IN ('default', 'bronze', 'silver', 'gold')),
	FOREIGN KEY (uid) REFERENCES Users(uid) ON DELETE NO ACTION
);
GO
-------------------------- Sellers -------------------------------


CREATE TABLE Sellers (
	uid				UNIQUEIDENTIFIER	NOT NULL PRIMARY KEY,
	status			VARCHAR(100)		NOT NULL,
	last_login		DATETIME			NOT NULL DEFAULT GETDATE(),
	regis_date		DATE				NOT NULL,
	FOREIGN KEY (uid) REFERENCES Users(uid) ON DELETE NO ACTION
);
GO
-------------------------- Shops -------------------------------

CREATE TABLE Shops (
	sid				UNIQUEIDENTIFIER	NOT NULL PRIMARY KEY,
	uid				UNIQUEIDENTIFIER	NOT NULL,
	name			NVARCHAR(100)		NOT NULL,
	address			NTEXT				NOT NULL,
	logo			VARCHAR(100)		NOT NULL,
	avg_rating		FLOAT,
	active			BIT					DEFAULT 1
	FOREIGN KEY (uid) REFERENCES Sellers(uid) ON DELETE NO ACTION
);
GO

-------------------------- Vouchers -------------------------------

CREATE TABLE Vouchers (
	vid				UNIQUEIDENTIFIER	NOT NULL PRIMARY KEY,
	dis_percent		float,
	dis_val			INT,
	start_date		DATETIME			NOT NULL DEFAULT GETDATE(),
	end_date		DATETIME			NOT NULL DEFAULT DATEADD(DAY, 30, GETDATE()),
	dis_type		VARCHAR(100)		NOT NULL,
	max_amount		INT,
	min_spent		INT,
	remain_quantity	INT					NOT NULL,
	sid				UNIQUEIDENTIFIER	NOT NULL,
	CONSTRAINT chk_dis_type CHECK (dis_type IN ('percentage', 'value')),
	FOREIGN KEY (sid) REFERENCES Shops(sid) ON DELETE NO ACTION
);
GO
-------------------------- Voucher_Own -------------------------------

CREATE TABLE Voucher_Own (
	vid		UNIQUEIDENTIFIER,
	uid		UNIQUEIDENTIFIER,
	PRIMARY KEY (vid, uid),
	FOREIGN KEY (vid) REFERENCES Vouchers(vid) ON DELETE NO ACTION,
	FOREIGN KEY (uid) REFERENCES Customers(uid) ON DELETE NO ACTION
);
GO
-------------------------- Courier_Services -------------------------------

CREATE TABLE Courier_Services (
	csid				UNIQUEIDENTIFIER	NOT NULL PRIMARY KEY,
	name				NVARCHAR(100)		NOT NULL,
	email				VARCHAR(100)		NOT NULL
);
GO


CREATE TABLE CS_Addresses (
	csid		UNIQUEIDENTIFIER	NOT NULL,
	address		NTEXT				NOT NULL,
	FOREIGN KEY (csid) REFERENCES Courier_Services(csid) ON DELETE CASCADE
);
GO

CREATE TABLE CS_Phones (
	csid	UNIQUEIDENTIFIER	NOT NULL,
	phone	CHAR(11)			NOT NULL,
	FOREIGN KEY (csid) REFERENCES Courier_Services(csid) ON DELETE CASCADE
);
GO

-------------------------- Categories -------------------------------

CREATE TABLE Categories (
	cid		UNIQUEIDENTIFIER	NOT NULL PRIMARY KEY,
	name	NVARCHAR(100)		NOT NULL,
	cpid	UNIQUEIDENTIFIER,
	FOREIGN KEY (cpid) REFERENCES Categories(cid) ON DELETE NO ACTION
);
GO
-------------------------- Brands -------------------------------

CREATE TABLE Brands (
	bid		UNIQUEIDENTIFIER	NOT NULL PRIMARY KEY,
	name	NVARCHAR(100)		NOT NULL,
);
GO
-------------------------- Products -------------------------------

CREATE TABLE Products (
	pid					UNIQUEIDENTIFIER	NOT NULL PRIMARY KEY,
	image				VARCHAR(100)		NOT NULL,
	manufactor_date		DATE				NOT NULL DEFAULT CONVERT(DATE, GETDATE()),
	current_price		FLOAT				NOT NULL,
	name				NVARCHAR(100)		NOT NULL,
	description			NTEXT,
	avg_rating			DECIMAL(2, 1),
	remain_quantity		INT					NOT NULL,
	bid					UNIQUEIDENTIFIER    NOT NULL,
	cid					UNIQUEIDENTIFIER	NOT NULL,
	sid					UNIQUEIDENTIFIER	NOT NULL,
	FOREIGN KEY (bid) REFERENCES Brands(bid) ON DELETE NO ACTION,
	FOREIGN KEY (cid) REFERENCES Categories(cid) ON DELETE NO ACTION,
	FOREIGN KEY (sid) REFERENCES Shops(sid) ON DELETE NO ACTION
);
GO
-------------------------- Carts -------------------------------

CREATE TABLE Carts(
	uid				UNIQUEIDENTIFIER	NOT NULL PRIMARY KEY,
	last_update		DATE				NOT NULL DEFAULT CONVERT(DATE, GETDATE()),
	total_quantity	INT,
	total_amount	FLOAT,
	FOREIGN KEY (uid) REFERENCES Customers(uid) ON DELETE CASCADE
);
GO


CREATE TABLE Add_To_Carts (
	uid				UNIQUEIDENTIFIER	NOT NULL,
	current_price	FLOAT				NOT NULL,
	quantity		INT					NOT NULL,
	pid				UNIQUEIDENTIFIER	NOT NULL,
	PRIMARY KEY(pid, uid),
	FOREIGN KEY (uid) REFERENCES Carts(uid) ON DELETE NO ACTION,
	FOREIGN KEY (pid) REFERENCES Products(pid) ON DELETE NO ACTION,
);
GO
-------------------------- Orders -------------------------------


CREATE TABLE Orders (
	oid						UNIQUEIDENTIFIER	NOT NULL PRIMARY KEY,
	ship_method				NVARCHAR(100)		NOT NULL,	
	complete_date			DATE,
	fee						FLOAT				NOT NULL,
	address					NTEXT				NOT NULL,
	note					NTEXT,
	actual_delivery_date	DATE,
	estimate_delivery_date	DATE				NOT NULL DEFAULT CAST(DATEADD(DAY, 15, GETDATE()) AS DATE),
	start_date				DATE				NOT NULL DEFAULT CONVERT(DATE, GETDATE()),
	status					VARCHAR(50)			NOT NULL,
	payment_id				UNIQUEIDENTIFIER	NOT NULL,
	payment_type			VARCHAR(50)			NOT NULL,
	total_value				FLOAT				NOT NULL,
	total_quantity			INT					NOT NULL,
	uid						UNIQUEIDENTIFIER	NOT NULL,
	sid						UNIQUEIDENTIFIER	NOT NULL,
	csid					UNIQUEIDENTIFIER	NOT NULL,
	vid						UNIQUEIDENTIFIER,
	tracking_number			UNIQUEIDENTIFIER	NOT NULL,
	CONSTRAINT ck_payment_type CHECK (payment_type IN ('Prepaid', 'Pay on delivery')),
	CONSTRAINT ck_ship_method CHECK (ship_method IN ('Standard', 'Express', 'Free')),
	CONSTRAINT ck_status CHECK (status IN ('Processing', 'Shipped', 'Completed')),
	FOREIGN KEY (uid) REFERENCES Customers(uid) ON DELETE NO ACTION,
	FOREIGN KEY (sid) REFERENCES Shops(sid) ON DELETE NO ACTION,
	FOREIGN KEY (csid) REFERENCES Courier_Services(csid) ON DELETE NO ACTION,
	FOREIGN KEY (vid) REFERENCES Vouchers(vid) ON DELETE NO ACTION
);
GO

CREATE TABLE Order_Include (
	pid			UNIQUEIDENTIFIER	NOT NULL,
	oid			UNIQUEIDENTIFIER	NOT NULL,
	price		FLOAT				NOT NULL,
	quantity	INT					NOT NULL,
	PRIMARY KEY(pid, oid),
	FOREIGN KEY (pid) REFERENCES Products(pid) ON DELETE NO ACTION,
	FOREIGN KEY (oid) REFERENCES Orders(oid) ON DELETE NO ACTION
);
GO
-------------------------- Reviews -------------------------------

CREATE TABLE Reviews (
	rid				UNIQUEIDENTIFIER	NOT NULL PRIMARY KEY,
	create_date		DATETIME			NOT NULL DEFAULT GETDATE(),
	image			VARCHAR(100),
	comment			NTEXT,
	rating			DECIMAL(2,1)					NOT NULL,
	uid				UNIQUEIDENTIFIER	NOT NULL,
	pid				UNIQUEIDENTIFIER	NOT NULL, 
	CONSTRAINT chk_rating CHECK (rating IN (1, 2, 3, 4, 5)),
	FOREIGN KEY (uid) REFERENCES Customers(uid) ON DELETE NO ACTION,
	FOREIGN KEY (pid) REFERENCES Products(pid) ON DELETE NO ACTION
);