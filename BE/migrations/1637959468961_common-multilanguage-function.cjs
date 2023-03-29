/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
    
    DROP FUNCTION IF EXISTS common__tools._get_translation; -- (text, text, text, text, text, text, integer, integer, OUT geodata);
    CREATE OR REPLACE FUNCTION common__tools._get_translation(
    _schema text,
    _table text,
    _field_id text DEFAULT 'id',
    _select_fields text DEFAULT '',
    _select_where text DEFAULT '',
    _select_order_by text DEFAULT '',
    _select_limit integer DEFAULT NULL,
    _select_offset integer DEFAULT NULL,
    OUT table_translation json
)
    IMMUTABLE
    LANGUAGE plpgsql
AS
$BODY$
DECLARE
\t_select_fields_str text := '';
    _select_limit_str text := '';
    _select_offset_str text := '';
    _sql_str text := '';
BEGIN

    -- RAISE INFO '-- common__tools._get_translation';

    _schema = trim(COALESCE(_schema, ''));
    _table := trim(COALESCE(_table, ''));


    -- IF (_schema IS NULL) THEN
    --     RETURN NULL;
    -- END IF;


    -- IF (_table = '') THEN
    --     RAISE INFO '-- ERROR! - empty _table';
    --     RETURN FALSE;
    -- END IF;


    _select_fields := trim(COALESCE(_select_fields, ''));
    _select_where := trim(COALESCE(_select_where, ''));
    _select_order_by := trim(COALESCE(_select_order_by, ''));
    _select_limit := COALESCE(_select_limit, 0);
    _select_offset := COALESCE(_select_offset, 0);


    IF (_select_fields <> '') THEN

        SELECT
            string_agg(format('%1$L, %1$I', trim(f)), ', ')
        INTO _select_fields_str
        FROM unnest(string_to_array(_select_fields, ',')) t(f)
        WHERE TRUE
            AND trim(COALESCE(f, '')) <> ''
        ;

        -- _select_fields := _select_fields || ',';

    END IF;
    
    
    IF (_select_where <> '') THEN
        _select_where := format(' AND %1$s', _select_where);
    END IF;


    IF (_select_order_by <> '') THEN
        _select_order_by := format(' ORDER BY %1$s', _select_order_by);
    END IF;


    IF (_select_limit > 0) THEN
        _select_limit_str := format(' LIMIT %1$s', _select_limit);
    END IF;


    IF (_select_offset > 0) THEN
        _select_offset_str := format(' OFFSET %1$s', _select_offset);
    END IF;
    
    
    _sql_str := format('
    \tWITH
\t\tt1 AS (
\t\tSELECT
\t\t\tforeign_key,
\t\t\tlocale,
\t\t\tjson_build_object(locale, json_object(array_agg(column_name), array_agg(value))) AS translations
\t\tFROM %1$I.translations
\t\tWHERE TRUE
\t\t\tAND (table_name = %2$L)
\t\tGROUP BY
\t\t\tforeign_key,
\t\t\tlocale
\t\t),
\t\tts AS (
\t\tSELECT
\t\t\tforeign_key,
\t\t\tjson_agg(translations) AS translations
\t\tFROM t1
\t\tGROUP BY
\t\t\tforeign_key
\t\t),
\t\tt AS (
\t\t\tSELECT
\t\t\t\t-- *
\t\t\t\t%3$I, %4$s
\t\t\tFROM  %1$I.%2$I
\t\t\tWHERE TRUE
            \t%6$s
            -- ORDER BY
            \t%7$s
            -- LIMIT
            \t%8$s
            -- OFFSET
            \t%9$s
\t\t)
\t\tSELECT
\t\t\t-- t.id,
\t\t\t-- t.name,
\t\t\t-- t.nicename,
\t\t\t-- ts.translations
\t\t\tjson_agg(json_build_object(%3$L, t.%3$I, %5$s, ''translations'', ts.translations)) AS table_translation
\t\tFROM t LEFT JOIN ts ON (ts.foreign_key = t.%3$I)
        ',
        _schema, _table, _field_id, _select_fields, _select_fields_str, _select_where, _select_order_by, _select_limit_str, _select_offset_str
    );
    
    \t
    EXECUTE _sql_str
    INTO table_translation;
\t\t

\tRETURN;

END;
$BODY$;`)
};


