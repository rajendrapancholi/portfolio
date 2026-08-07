import NextTopLoader from 'nextjs-toploader';
const TopLoaderProvider = () => {
    return (
        <NextTopLoader
            color="#06b6d4"      // Cyan color (Tailwind cyan-500)
            initialPosition={0.08}
            crawlSpeed={200}
            height={2}           // Thickness of the bar
            crawl={true}
            showSpinner={false}  // Disable the loading circle for a cleaner look
            easing="ease"
            speed={200}
            shadow="0 0 10px #06b6d4, 0 0 5px #06b6d4" // Glowing effect
        />
    );
};

export default TopLoaderProvider;
