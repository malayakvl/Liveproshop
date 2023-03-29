/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
CREATE OR REPLACE FUNCTION data.find_user_by_hash(_user_hash text, _is_deleted boolean DEFAULT false, _period_plus text DEFAULT '3 hours'::text)
 RETURNS TABLE(id integer, role_id integer, email character varying(100))
 LANGUAGE plpgsql
AS $function$
BEGIN

    RETURN QUERY
        SELECT
            users.id,
            users.role_id,
            users.email
        FROM
            data.users
        WHERE TRUE
            AND (users.hash = _user_hash)
            AND (users.expired_at >= NOW())
        ORDER BY users.id DESC
    ;

END;
$function$
;
`);
};


exports.down = pgm => {
    pgm.sql(`DROP FUNCTION IF EXISTS data.find_user_by_hash`);
};

