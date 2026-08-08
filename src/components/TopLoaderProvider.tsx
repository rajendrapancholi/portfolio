'use client';

import NextTopLoader from 'nextjs-toploader';

const TopLoaderProvider = () => {
  return (
    <NextTopLoader
      color="var(--brand)"
      initialPosition={0.08}
      crawlSpeed={200}
      height={1.5}
      crawl={true}
      showSpinner={false}
      easing="ease"
      speed={200}
      shadow="0 0 12px var(--brand), 0 0 6px var(--brand)"
      zIndex={9999}
    />
  );
};

export default TopLoaderProvider;
