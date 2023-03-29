exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`DROP FUNCTION IF EXISTS data.get_hashtags_json_arr(text);

                    CREATE OR REPLACE FUNCTION data.get_hashtags_json_arr(_name text DEFAULT '')
                        RETURNS json
                        LANGUAGE plpgsql
                    AS
                    $BODY$
                    BEGIN
                    
                        RETURN (
                            SELECT
                                json_agg(row_to_json(hashtags.*))
                            FROM
                                data.hashtags
                            WHERE TRUE
                                AND (lower(hashtags.name) LIKE '%' || lower(trim(_name)) || '%')
                        );
                    
                    END;
                    $BODY$;
        `);
    };

