(function () {
  "use strict";

  const get = (target) => document.querySelector(target);
  const getAll = (target) => document.querySelectorAll(target);

  const API_URL = "http://localhost:3000/videoList";

  const $videoList = get(".contents-list");

  const limit = 5; // 보여질 영상 아이템 갯수
  const end = 20;
  let currentPage = 1;
  let total = 5;

  const showVideos = (videos) => {
    $videoList.innerHTML = "";
    videos.forEach((item) => {
      const { link, title, artist, thought, rating } = item;
      const $videoItem = document.createElement("li");
      $videoItem.classList.add("contents-item");
      $videoItem.innerHTML = `
      <div class="title">
        <h2><a href="${link}">#</a>${title}</h2>
        <p>songs by ${artist}</p>
      </div>
      <div class="videoBox">
        <iframe src="${link}" title="YouTube video player" frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen></iframe>
        <!--youtube-->
      </div>
      <div class="thought">
        <div class="thoughtWrap">
          <p class="thought-con">${thought}</p>
          <div class="rating">
            my rating: ${rating}/10
          </div>
        </div>
      </div>
      <!-- <div class="comments">
        <p>No Commnets</p>
        <button>Leave a Comment</button>
      </div> -->`;
      $videoList.appendChild($videoItem);
    });
  };

  const getVideos = async () => {
    const response = await fetch(
      `${API_URL}?_page=${currentPage}&_limit=${limit}`
    );

    if (!response.ok) {
      return new Error("에러가 발생했습니다.");
    }
    return await response.json();
  };

  const loadVideo = async () => {
    try {
      const response = await getVideos();
      showVideos(response);
    } catch (error) {
      console.log(error);
    }
  };

  const onScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (total === end) {
      window.removeEventListener("scroll", onScroll);
      return;
    }
  };

  window.addEventListener("DOMContentLoaded", () => {
    loadVideo();
    window.addEventListener("scroll", onScroll);
  });
})();
