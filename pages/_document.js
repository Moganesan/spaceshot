import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta charSet="UTF-8" />
          <title>Spaceshot</title>
          <meta
            name="description"
            content="SpaceShot is a fun and social game on Shardeum, It consists of a Space Shuttle that
            Briefly elaborate on what
            goes up and up until it is randomly shot by
            you want to discuss.
            meteors, SpaceShot is simple, You wager an amount & pick a point (multiplier) at which you think the Space Shuttle will not explode by, Wager 0.1 SHM & if it goes beyond 10x, you win 1 SHM, Or pick a lower multiplier like 1.5x, The choice is yours, You cash out before the meteors shoot or lose the wagered amount."
          />
          <meta name="keywords" content="web3.blockchain,game,play to earn" />
          <meta name="author" content="Moganesan" />
          <meta property="og:site_name" content="spaceshot" />
          <meta
            property="og:title"
            content="Multiply your Shardeum instantly with SpaceShot"
          />
          <meta
            property="og:description"
            content="SpaceShot is a fun and social game on Shardeum, It consists of a Space Shuttle that
            Briefly elaborate on what
            goes up and up until it is randomly shot by
            you want to discuss.
            meteors, SpaceShot is simple, You wager an amount & pick a point (multiplier) at which you think the Space Shuttle will not explode by, Wager 0.1 SHM & if it goes beyond 10x, you win 1 SHM, Or pick a lower multiplier like 1.5x, The choice is yours, You cash out before the meteors shoot or lose the wagered amount."
          />
          <meta property="og:type" content="website" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=VT323&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <div id="modal" />
          <NextScript />
        </body>
      </Html>
    );
  }
}
