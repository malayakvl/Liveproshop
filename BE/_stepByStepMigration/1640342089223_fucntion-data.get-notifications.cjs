exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`CREATE OR REPLACE FUNCTION data.get_notifications(_limit integer DEFAULT 10, _offset integer DEFAULT 0, _where text DEFAULT ''::text, _order_by text DEFAULT ''::text)
 RETURNS TABLE(id integer, type character varying, subject character varying, message text, is_read boolean, created_at timestamp with time zone, first_name character varying, last_name character varying, sender_first_name character varying, sender_last_name character varying, sender_photo text)
 LANGUAGE plpgsql
AS $function$
DECLARE
    _sql_str text := '';
    _where_str text := '';
    _order_by_str text := '';
    _row_count integer := NULL;
BEGIN

    IF NOT (_limit > 0)  THEN
        _limit := 10;
    END IF;


    IF NOT (_offset >= 0)  THEN
        _offset := 0;
    END IF;


    IF (trim(COALESCE(_where, '')) <> '') THEN
        _where_str := ' AND ' || trim(COALESCE(_where, ''));
    END IF;


    IF (trim(COALESCE(_order_by, '')) <> '') THEN
        _order_by_str := ' ORDER BY ' || trim(COALESCE(_order_by, ''));
    END IF;


    _sql_str := format('
        SELECT
            notifications.id,
            notifications.type,
            notifications.subject,
            notifications.message,
            notifications.is_read,
            notifications.created_at,
            users.first_name,
            users.last_name,
            senderUsers.first_name as sender_first_name,
            senderUsers.last_name as sender_last_name,
            senderUsers.photo as sender_photo
        FROM
            data.notifications
                LEFT JOIN data.users ON (users.id = notifications.user_id)
                LEFT JOIN data.users AS senderUsers ON (senderUsers.id = notifications.sender_id)
        WHERE TRUE
            %1$s
        -- ORDER BY
        %2$s
        LIMIT %3$s OFFSET %4$s
    ',
    _where_str, _order_by_str, _limit, _offset
    );
    -- RAISE INFO '-- %', _sql_str;
    RETURN QUERY
    EXECUTE _sql_str;


    RETURN;

END;
$function$
;`);
};

