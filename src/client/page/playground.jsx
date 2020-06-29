import React from "react";

const Playground_Page = () => (
  <div>
    {/* <video src="//player.bilibili.com/player.html?aid=2590037&bvid=BV1hs411S7WY&cid=4047333&page=1"></video> */}
    <audio
      id="audio"
      src="http://go.163.com/2018/0209/mengniu/audio/bgm.mp3"
      autoplay
      loop
    ></audio>
    <iframe
      frameborder="no"
      border="0"
      marginwidth="0"
      marginheight="0"
      width="330"
      height="86"
      src="//music.163.com/outchain/player?type=2&id=35416226&auto=1&height=66"
    ></iframe>
    <iframe
      width="830"
      height="467"
      src="//player.bilibili.com/player.html?aid=2590037&bvid=BV1hs411S7WY&cid=4047333&page=1"
      border="0"
      frameborder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
    <iframe
      width="830"
      height="467"
      src="https://www.youtube.com/embed/wDndmXcB1CA"
      frameborder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  </div>
);

export default Playground_Page;
