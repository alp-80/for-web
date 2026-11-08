import { For, createSignal, onMount, onCleanup } from "solid-js";

import { Trans } from "@lingui/solid/macro";
import { cva } from "styled-system/css";
import { styled } from "styled-system/jsx";

import { Header, iconSize, main } from "@revolt/ui";

import MdHome from "@material-design-icons/svg/filled/home.svg?component-solid";

import { HeaderIcon } from "./common/CommonHeader";

const CLICK_SOUND_URL = "/click.mp3";

const Base = styled("div", {
  base: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    color: "var(--md-sys-color-on-surface)",
  },
});

const content = cva({
  base: {
    ...main.raw(),
    padding: "48px 0",
    gap: "32px",
    alignItems: "center",
    justifyContent: "center",
  },
});

const Gallery = styled("div", {
  base: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "16px",
    width: "100%",
    maxWidth: "1100px",
    padding: "0 24px",
  },
});

const Thumb = styled("button", {
  base: {
    padding: 0,
    border: "none",
    cursor: "pointer",
    borderRadius: "var(--borderRadius-lg)",
    overflow: "hidden",
    background: "var(--md-sys-color-surface-variant)",
    aspectRatio: "1 / 1",

    "& img": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
      transition: "transform 0.2s",
    },
    "&:hover img": {
      transform: "scale(1.05)",
    },
  },
});

const Lightbox = styled("div", {
  base: {
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(0, 0, 0, 0.85)",
    zIndex: 1000,
    padding: "24px",
    cursor: "zoom-out",

    "& img": {
      maxWidth: "95vw",
      maxHeight: "95vh",
      objectFit: "contain",
      borderRadius: "8px",
    },
  },
});

const images = import.meta.glob<string>(
  "../../public/gallery/*.{png,jpg,jpeg,webp,gif,avif}",
  { eager: true, query: "?url", import: "default" },
);

export function HomePage() {
  const [opened, setOpened] = createSignal<string | null>(null);

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
        <Gallery>
          <For each={Object.values(images)}>
            {(src) => (
              <Thumb onClick={() => setOpened(src)}>
                <img src={src} alt="" loading="lazy" />
              </Thumb>
            )}
          </For>
        </Gallery>
      </div>
      {opened() && (
        <Lightbox onClick={() => setOpened(null)}>
          <img src={opened()!} alt="" />
        </Lightbox>
      )}
    </Base>
  );
}