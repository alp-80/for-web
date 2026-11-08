import { createSignal, onMount, onCleanup } from "solid-js";

import { Trans } from "@lingui/solid/macro";
import { cva } from "styled-system/css";
import { styled } from "styled-system/jsx";

import { Header, iconSize } from "@revolt/ui";

import MdHome from "@material-design-icons/svg/filled/home.svg?component-solid";

import { HeaderIcon } from "./common/CommonHeader";

const CLICK_SOUND_URL = "/click.mp3";

const Base = styled("div", {
  base: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    color: "var(--md-sys-color-on-surface)",
  },
});

const content = cva({
  base: {
    flex: "1",
    minHeight: "0",
    width: "100%",
    height: "100%",
    display: "flex",
    overflow: "hidden",
  },
});

const Photo = styled("img", {
  base: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
});

const images = import.meta.glob<string>(
  "../../public/gallery/*.{png,jpg,jpeg,webp,gif,avif}",
  { eager: true, query: "?url", import: "default" },
);

export function HomePage() {
  const [photo] = createSignal<string | null>(() => {
    const list = Object.values(images);
    if (list.length === 0) return null;
    return list[Math.floor(Math.random() * list.length)];
  });

  onMount(() => {
    const clickAudio = new Audio(CLICK_SOUND_URL);
    clickAudio.volume = 0.3;

    const handleGlobalClick = () => {
      clickAudio.currentTime = 0;
      clickAudio.play().catch(() => {});
    };

    document.addEventListener("click", handleGlobalClick);

    onCleanup(() => {
      document.removeEventListener("click", handleGlobalClick);
    });
  });

  return (
    <Base>
      <Header placement="primary">
        <HeaderIcon>
          <MdHome {...iconSize(22)} />
        </HeaderIcon>
        <Trans>Home</Trans>
      </Header>
      <div use:scrollable={{ class: content() }}>
        {photo() ? (
          <Photo src={photo()!} alt="" />
        ) : (
          <Trans>No photos found</Trans>
        )}
      </div>
    </Base>
  );
}