import Script from 'next/script';
import { DynamicJsonLdProps, generateDynamicJsonLd } from '@/lib/seo/jsonld';
import safeJSONStringify from '@/lib/utils/safeSanitize';

export const JsonLd: React.FC<DynamicJsonLdProps> = (props) => {
    const jsonLd = generateDynamicJsonLd(props);

    return (
        <Script
            id={`jsonld-${props.type}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: safeJSONStringify(jsonLd) }}
        />
    );
};
