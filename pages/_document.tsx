import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="scroll-smooth">
      <Head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <body className="text-slate-700 antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
