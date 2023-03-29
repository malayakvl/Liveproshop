/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`CREATE OR REPLACE FUNCTION common__tools._select_from_table_by_where(_schema text, _table text, _fields text, _where text DEFAULT ''::text)
 RETURNS TABLE(fields_json json)
 LANGUAGE plpgsql
AS $function$
DECLARE
    -- _schema text := NULL;
    _sql_str text := '';
    _row_count integer := NULL;
BEGIN

    _schema = trim(_schema);
    _table = trim(_table);
    _fields = trim(COALESCE(_fields, ''));
    _where = trim(COALESCE(_where, ''));


    -- _schema = common.check_schema(_msa);

    -- IF (_schema IS NOT NULL) THEN
    --     EXECUTE format('SET search_path TO %I, public', _schema);
    -- END IF;


    IF ((_fields IS NOT NULL) AND (_fields <> '')) THEN

        SELECT
            string_agg(format('%1$L, %1$I', trim(f)), ', ')
        INTO _fields
        FROM unnest(string_to_array(_fields, ',')) t(f)
        WHERE TRUE
            AND trim(COALESCE(f, '')) <> ''
        ;

        -- SELECT string_agg(format('%I', f), ', ')
        -- INTO _fields
        -- FROM unnest(string_to_array(_fields, ',')) t(f);

    -- ELSE
    --     _fields := ' * ';
    END IF;


    IF ((_where IS NOT NULL) AND (_where <> '')) THEN
        _where := 'AND ' || _where;
    END IF;


    _sql_str := format('
    SELECT
        json_build_object(
            %3$s
        ) AS fields_json
    FROM %1$I.%2$I
    WHERE TRUE %4$s',
    _schema, _table, _fields, _where
    );
    -- RAISE INFO '-- %', _sql_str;
    RETURN QUERY
    EXECUTE _sql_str;


    RETURN;

END;
$function$
;`)
};

