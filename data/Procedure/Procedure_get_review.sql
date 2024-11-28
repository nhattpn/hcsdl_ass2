-- Procedure trả về thông tin review của sản phẩm | input: product_id  | output: review_id;	customer_id; customer_name; rating; comment; image_url; review_date
CREATE PROCEDURE GET_REVIEW
    @product_id INT
AS
BEGIN
    SELECT 
        r.review_id,
        r.customer_id,
        CONCAT(u.fullname, ' (', u.username, ')') AS customer_name, -- Họ và tên khách hàng + username
        r.rating,
        r.comment,
        r.image_url,
        r.review_date
    FROM 
        REVIEW r
    INNER JOIN 
        CUSTOMER c ON r.customer_id = c.customer_id
    INNER JOIN 
        APP_USER u ON c.uid = u.uid
    WHERE 
        r.product_id = @product_id;

END;