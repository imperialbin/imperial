import { DefaultSeoProps } from "next-seo";

const config: DefaultSeoProps = {
  defaultTitle: "IMPERIAL",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://impb.in/",
    siteName: "IMPERIAL",
    title: "IMPERIAL",
    images: [
      {
        url: "https://cdn.impb.in/assets/header.png",
      },
    ],
  },
  twitter: {
    handle: "@imperialbin",
    site: "@imperial",
    cardType: "summary_large_image",
  },
  description: "Share code with anyone in a matter of seconds.",
};

export default config;
