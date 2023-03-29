import React from 'react';
import Link from 'next/link';

export default function Brand() {
    return (
        <Link href={'/'}>
            <a className="brand">Proshop</a>
        </Link>
    );
}
