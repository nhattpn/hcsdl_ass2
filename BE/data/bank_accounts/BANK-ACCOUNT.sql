create table BANK_ACCOUNT(
	BankID	        varchar(12) 	NOT NULL,
    UID             varchar(36)     NOT NULL,
	BankName        text 	        NOT NULL,
	Account_Number  varchar(20) 	NOT NULL,
    primary key(BankID, UID),
    constraint BANK_ACCOUNT_fk
    foreign key(UID) references USER(UID)
        ON DELETE CASCADE   ON UPDATE CASCADE
);

INSERT INTO BANK_ACCOUNT(BankID, UID, BankName, Account_Number) 
VALUES
    ('339085a516de','66c4929e-b2f1-4efe-8fab-9c034bf870d1','Techcombank', '1023456789'),
    ('880aec408924','c314ca90-2e06-4a9d-9fb9-1055ae1c47cc','BIDV','2034567891'),
    ('93352455ff75','08327d1f-190e-478f-9a55-7c32233685c9','ACB','3045678912'),
    ('1845099405a8','08327d1f-190e-478f-9a55-7c32233685c9','Sacombank','5067891234'),
    ('e7a97111b21a','dcfc2b80-da37-4802-a2f7-894ee475332d','Vietcombank','4056789123'),
    ('e7a97111b21a','7b845599-c8ca-4bfa-a459-574bbe8f340e','Vietcombank','6078912345');

UPDATE BANK_ACCOUNT
SET BankName = 'Sacombank', Account_Number = "12121211213321"
WHERE BankID = 'e7a97111b21a' AND UID = '7b845599-c8ca-4bfa-a459-574bbe8f340e';

DELETE FROM BANK_ACCOUNT
WHERE BankID = 'e7a97111b21a' AND UID = '7b845599-c8ca-4bfa-a459-574bbe8f340e';

SELECT * FROM BANK_ACCOUNT