import { NextConfig } from 'next';
import withNextIntl from 'next-intl/plugin';

const withIntl = withNextIntl();

const nextConfig: NextConfig = {
    images: {
        domains: ['github.com'],
    },
};

export default withIntl(nextConfig);