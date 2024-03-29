import { Html, Head, Main, NextScript } from "next/document";
import { getCssText } from "../stitches.config";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <style
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: getCssText() }}
          id="stitches"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#191919" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
