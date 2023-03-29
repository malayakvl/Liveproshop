import React from 'react';

interface Props {
    colSpan: number;
    children: React.ReactNode;
}

const EmptyTable: React.FC<Props> = ({ colSpan, children }) => (
    <tr>
        <td
            style={{ height: 90, verticalAlign: 'middle' }}
            rowSpan={5}
            colSpan={colSpan}
            className="text-center">
            {children}
        </td>
    </tr>
);

export default EmptyTable;
