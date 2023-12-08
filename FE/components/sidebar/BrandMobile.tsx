import React from 'react';
import Link from 'next/link';

export default function BrandMobile() {
    return (
        <Link href={'/'}>
            {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
            <a className="brand-mobile" />
        </Link>
    );
}
