/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(
        `
        DROP FUNCTION IF EXISTS common__tools._update_table_by_where;
CREATE OR REPLACE FUNCTION common__tools._update_table_by_where(_schema text, _table text, _data json, _where text DEFAULT ''::text)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    _data_str text := NULL;
    -- _schema text := NULL;
    _sql_str text := '';
    _row_count integer := NULL;
BEGIN

    _schema = trim(_schema);
    _table = trim(_table);


    -- _schema = common.check_schema(_msa);

    -- IF (_schema IS NOT NULL) THEN
    --     EXECUTE format('SET search_path TO %I, public', _schema);
    -- END IF;


    IF ((_where IS NOT NULL) AND (_where <> '')) THEN
        _where := 'AND ' || _where;
    END IF;


    SELECT string_agg(format('%I', key) || ' = ' || regexp_replace(value::text, '"', '''', 'g'), ', ')
    INTO _data_str
    FROM json_each(_data);


    _row_count := NULL;


    _sql_str := format('
    UPDATE %1$I.%2$I SET
        %3$s
    WHERE TRUE %4$s',
    _schema, _table, _data_str, _where
    );
    -- RAISE INFO '-- %', _sql_str;
    EXECUTE _sql_str;
    GET DIAGNOSTICS _row_count = ROW_COUNT;


    RETURN _row_count;

END;
$function$
;
        `
    );
};
