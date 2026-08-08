import NextTopLoader from 'nextjs-toploader';
const TopLoaderProvider = () => {
    return (
        <NextTopLoader
            color="var(--color-brand)"      // brand accent (theme-aware)
            initialPosition={0.08}
            crawlSpeed={200}
            height={2}           // Thickness of the bar
            crawl={true}
            showSpinner={false}  // Disable the loading circle for a cleaner look
            easing="ease"
            speed={200}
            shadow="0 0 10px var(--color-brand), 0 0 5px var(--color-brand)" // Glowing effect
        />
    );
};

export default TopLoaderProvider;
