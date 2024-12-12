-- Để test thôi nha 
CREATE TABLE [ORDER] (
    OID            VARCHAR(12) PRIMARY KEY,
    ShopID         VARCHAR(8) NOT NULL,
    Total_value    INT NOT NULL,
    CONSTRAINT ORDER_fk FOREIGN KEY(ShopID) 
        REFERENCES SHOP(ShopID) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

create table SHOP(
	ShopID	 	varchar(8) 	    PRIMARY KEY,
	UID	        varchar(50) 	NOT NULL,
	Name 	    varchar(50) 	NOT NULL,
	Address     text 	        NOT NULL,
	Logo		text	        NOT NULL,
	Avg_Rating  decimal(3,1)    DEFAULT 0.0 CHECK (Avg_Rating >= 1.0 AND Avg_Rating <= 5.0),
    constraint SHOP_UID_fk
    foreign key(UID) references USER(UID)
        ON DELETE CASCADE   ON UPDATE CASCADE
);
