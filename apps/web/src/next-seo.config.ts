import { DefaultSeoProps } from "next-seo";

const config: DefaultSeoProps = {
  defaultTitle: "IMPERIAL",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://impb.in/",
    siteName: "IMPERIAL",
    title: "IMPERIAL",
  },
  twitter: {
    handle: "@imperialbin",
    site: "@imperial",
    cardType: "summary_large_image",
  },
};

export default config;
