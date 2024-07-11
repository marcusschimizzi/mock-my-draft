import { composePlugins, withNx } from '@nx/next';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
};

const plugins = [withNx];

export default composePlugins(...plugins)(nextConfig);
