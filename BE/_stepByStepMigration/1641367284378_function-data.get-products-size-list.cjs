exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
    CREATE OR REPLACE FUNCTION data.get_products_size_list()
 RETURNS json
 LANGUAGE plpgsql
AS $function$
BEGIN

    RETURN (
        SELECT
            json_agg(
                json_build_object(
                    'id_1', p1.id,
                    'name_1', p1.name,
                    'id_2', p2.id,
                    'name_2', p2.name,
                    'id_3', p3.id,
                    'name_3', p3.name,
                    'id_4', p4.id,
                    'name_4', p4.name,
                    'id_5', p5.id,
                    'name_5', p5.name
                )
                ORDER BY
                    p1.order_by,
                    p2.order_by,
                    p3.order_by,
                    p4.order_by
            ) AS fields_json
        FROM
            (
                SELECT *
                FROM data.product_sizes
                WHERE TRUE
                    AND (group_by = 1)
                ORDER BY
                    order_by
            ) p1
            FULL JOIN (
                SELECT *
                FROM data.product_sizes
                WHERE TRUE
                    AND (group_by = 2)
                ORDER BY
                    order_by
            ) p2 ON (p1.order_by = p2.order_by)
            FULL JOIN (
                SELECT *
                FROM data.product_sizes
                WHERE TRUE
                    AND (group_by = 3)
                ORDER BY
                    order_by
            ) p3 ON (p1.order_by = p3.order_by)
            FULL JOIN (
                SELECT *
                FROM data.product_sizes
                WHERE TRUE
                    AND (group_by = 4)
                ORDER BY
                    order_by
            ) p4 ON (p3.order_by = p4.order_by)
            FULL JOIN (
                SELECT *
                FROM data.product_sizes
                WHERE TRUE
                    AND (group_by = 5)
                ORDER BY
                    order_by
            ) p5 ON (p4.order_by = p5.order_by)
    )
    ;

END;
$function$
;
        `);
};
