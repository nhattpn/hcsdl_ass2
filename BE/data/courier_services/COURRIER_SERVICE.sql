create table COURRIER_SERVICE(
	CourrierID	varchar(8) 	    PRIMARY KEY,
	Name        varchar(50) 	NOT NULL,
	Email 	    varchar(60) 	NOT NULL UNIQUE
);

create table COUR_ADDR(
    CourrierID	varchar(8) 	    NOT NULL,
	Address		text			NOT NULL,
	primary key(CourrierID, Address),

	constraint COUR_ADDR_fk	
    foreign key(CourrierID) references COURRIER_SERVICE(CourrierID)
        ON DELETE CASCADE   ON UPDATE CASCADE
);

create table COUR_PHONE(
	CourrierID  varchar(8)	    NOT NULL,
	Phone		varchar(11)		NOT NULL UNIQUE,

	primary key(CourrierID, Phone),
	constraint COUR_PHONE_fk
    foreign key(CourrierID) references COURRIER_SERVICE(CourrierID)
        ON DELETE CASCADE   ON UPDATE CASCADE
);

-- Bảng chính COURRIER_SERVICE
INSERT INTO COURRIER_SERVICE(CourrierID, Name, Email) 
VALUES('807bf52f','Công ty TNHH Vận Tải Nhanh Toàn Cầu', 'contact@vantainhanhtoancau.vn');

INSERT INTO COURRIER_SERVICE(CourrierID, Name, Email) 
VALUES('578ff500','Công ty Cổ Phần Logistics Việt', 'info@logisticsviet.com');

INSERT INTO COURRIER_SERVICE(CourrierID, Name, Email) 
VALUES('3bd71be2','Công ty TNHH Giao Nhận Hoàng Gia', 'support@giaonhanhoanggia.vn');

INSERT INTO COURRIER_SERVICE(CourrierID, Name, Email) 
VALUES('ae68060f','Công ty Cổ Phần Chuyển Phát Tín Đạt', 'sales@tindatlogistics.vn');

INSERT INTO COURRIER_SERVICE(CourrierID, Name, Email) 
VALUES('4f570b98','Công ty TNHH Vận Tải Ánh Dương', 'info@anhduongexpress.com');

INSERT INTO COURRIER_SERVICE(CourrierID, Name, Email) 
VALUES('a6563ad6','Công ty Cổ Phần Dịch Vụ Vận Chuyển Phương Nam', 'contact@phuongnamshipping.vn');

INSERT INTO COURRIER_SERVICE(CourrierID, Name, Email) 
VALUES('aff70851','Công ty TNHH Chuyển Phát Nhanh Đại Thành', 'support@daithanhship.vn');

UPDATE COURRIER_SERVICE
SET Name = 'Bellaire', Email = 'temp@gmail.com'
WHERE CourrierID = 'aff70851';

DELETE FROM COURRIER_SERVICE
WHERE CourrierID = 'aff70851';

INSERT INTO COUR_ADDR (CourrierID, Address)
VALUES 
    ('807bf52f', 'Số 123, Đường Nguyễn Trãi, Phường Bến Thành, Quận 1, TP.HCM'),
    ('578ff500', 'Số 45, Đường Lê Văn Việt, Phường Hiệp Phú, TP. Thủ Đức, TP.HCM'),
    ('3bd71be2', 'Số 78, Đường Trần Phú, Phường 4, TP. Đà Lạt, Tỉnh Lâm Đồng'),
    ('ae68060f', 'Số 56, Đường Hùng Vương, Phường Vĩnh Thanh, TP. Rạch Giá, Tỉnh Kiên Giang'),
    ('4f570b98', 'Số 34, Đường Hoàng Diệu, Phường Nam Dương, Quận Hải Châu, TP. Đà Nẵng'),
    ('a6563ad6', 'Số 90, Đường Nguyễn Văn Cừ, Phường An Hòa, Quận Ninh Kiều, TP. Cần Thơ'),
    ('aff70851', 'Số 28, Đường Lê Lợi, Phường Hồng Hải, TP. Hạ Long, Tỉnh Quảng Ninh'),
    ('aff70851', 'Số 67, Đường Phan Đăng Lưu, Phường 3, Quận Bình Thạnh, TP.HCM')

INSERT INTO COUR_PHONE (CourrierID, Phone)
VALUES 
    ('807bf52f','02838123456'),
    ('578ff500','02439334567'),
    ('3bd71be2','02223885678'),
    ('ae68060f','02363997890'),
    ('ae68060f','02583551122'),
    ('4f570b98','02328564715'),
    ('4f570b98','02923656789'),
    ('a6563ad6','02033774455'),
    ('aff70851','02623445566')
    
-- Case test sai fk
INSERT INTO COUR_PHONE (CourrierID, Phone)
VALUES 
    ('22222222','02836663456')


-- COPY COUR_ADDR (CourrierID, Address)
-- FROM 'C:\Program Files\PostgreSQL\17\data sample\phone.csv'
-- DELIMITER ',' 
-- CSV HEADER;


-- COPY COUR_PHONE (CourrierID, Phone)
-- FROM 'C:\Program Files\PostgreSQL\17\data sample\address.csv'
-- DELIMITER ',' 
-- CSV HEADER;