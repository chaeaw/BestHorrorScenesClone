(function () {
  "use strict";

  const get = (target) => document.querySelector(target);
  const getAll = (target) => document.querySelectorAll(target);

  const API_URL = "http://localhost:3000/videoList";

  const $contentWrap = get(".contents");
  const $videoList = get(".contents-list");

  const limit = 5; // 보여질 영상 아이템 갯수
  const end = 20;
  let currentPage = 1;
  let total = 5;

  const showVideos = (videos) => {
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

  let is_action = true;
  const startServer = () => {
    // server가 기동되었을때만 innerHTML을 비워주고싶어서 -> 포폴에서는 서버 기동을 따로 못해주므로
    if (is_action === true) {
      $videoList.innerHTML = "";
    }
    is_action = false;
  };

  const getVideos = async () => {
    const response = await fetch(
      `${API_URL}?_page=${currentPage}&_limit=${limit}`
    );

    if (!response.ok) {
      return new Error("에러가 발생했습니다.");
    }
    startServer();
    return await response.json();
  };

  const loadVideo = async () => {
    try {
      const response = await getVideos();
      showVideos(response);
    } catch (error) {
      console.log(
        "json-server for infinite scroll isn't watching DB now. But I make infinite Scroll with dataset. check this please."
      );
      console.log(error);
    }
  };

  const onScrollInServer = () => {
    const scrollY = window.scrollY;
    const clientHeight = $contentWrap.clientHeight;
    const scrollHeight = $contentWrap.scrollHeight;
    if (total === end) {
      window.removeEventListener("scroll", onScroll);
      return;
    }

    if (scrollY + clientHeight >= scrollHeight) {
      currentPage++;
      total += 5;
      loadVideo();
    }
  };

  // json-server 사용시
  window.addEventListener("DOMContentLoaded", () => {
    loadVideo();
    window.addEventListener("scroll", onScrollInServer);
  });

  const onScroll = () => {
    const scrollY = window.scrollY;
    const clientHeight = $contentWrap.clientHeight;
    const scrollHeight = $contentWrap.scrollHeight;

    const videoGroupTopOff = get(`.contents-group[data-open="off"]`);
    if (scrollY + clientHeight >= scrollHeight) {
      videoGroupTopOff.dataset.open = "on";
    }

    if (!videoGroupTopOff) {
      window.removeEventListener("scroll", onScroll);
    }
  };

  window.addEventListener("scroll", onScroll);
})();
