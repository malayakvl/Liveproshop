/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
    CREATE OR REPLACE FUNCTION common__tools._select_total_from_table_by_where(_schema text, _table text, _field_id text DEFAULT 'id'::text, _where text DEFAULT ''::text, OUT total bigint)
 RETURNS bigint
 LANGUAGE plpgsql
AS $function$
DECLARE
    -- _schema text := NULL;
    _sql_str text := '';
    _row_count integer := NULL;
BEGIN

    _schema = trim(_schema);
    _table = trim(_table);
    _field_id = trim(COALESCE(_field_id, ''));
    _where = trim(COALESCE(_where, ''));


    -- _schema = common.check_schema(_msa);

    -- IF (_schema IS NOT NULL) THEN
    --     EXECUTE format('SET search_path TO %I, public', _schema);
    -- END IF;


    IF ((_where IS NOT NULL) AND (_where <> '')) THEN
        _where := 'AND ' || _where;
    END IF;


    _sql_str := format('
    SELECT
        COUNT(%3$I) AS total
    FROM %1$I.%2$I
    WHERE TRUE %4$s',
    _schema, _table, _field_id, _where
    );
    -- RAISE INFO '-- %', _sql_str;
    EXECUTE _sql_str
    INTO total;


    RETURN;

END;
$function$
;
    `);
};

