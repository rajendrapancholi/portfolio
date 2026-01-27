import { createPageMetadata } from "@/lib/seo/metadata";
import CreateBlogForm from "../../../../components/blog/CreateBlogForm";
import { generateDynamicJsonLd } from "@/lib/seo/jsonld";
import { ENV } from "@/config/env";
import Script from "next/script";
import safeJSONStringify from "@/lib/utils/safeSanitize";


export const metadata = createPageMetadata({
    title: "Create New Post",
    description: "Draft and publish your latest insights to your portfolio.",
    canonical: "https://rajendrapancholi.vercel.app",
});
const baseUrl = ENV.BASE_URL ?? "https://rajendrapancholi.vercel.app";
export default function CreateBlogPage() {
    const jsonLd = generateDynamicJsonLd({
        type: "blog",
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
    });
    return (
        <>
            <Script
                id="jsonld-create-blog"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: safeJSONStringify(jsonLd, { decodeUri: true }),
                }}
            />
            <CreateBlogForm />
        </>
    );
}
