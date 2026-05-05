const YT_ORIGIN = "https://www.youtube.com";

function postCommand(iframe: HTMLIFrameElement, func: string) {
  iframe.contentWindow?.postMessage(
    JSON.stringify({ event: "command", func, args: [] }),
    YT_ORIGIN,
  );
}

let activeIframe: HTMLIFrameElement | null = null;

export function registerActiveVideo(iframe: HTMLIFrameElement) {
  if (activeIframe && activeIframe !== iframe) {
    postCommand(activeIframe, "pauseVideo");
  }
  activeIframe = iframe;
}

export function unregisterActiveVideo(iframe: HTMLIFrameElement) {
  if (activeIframe === iframe) {
    activeIframe = null;
  }
}

export function pauseActiveVideo() {
  if (activeIframe) {
    postCommand(activeIframe, "pauseVideo");
  }
}

export function observeVisibility(
  element: HTMLElement,
  iframe: HTMLIFrameElement,
  threshold = 0.3,
): () => void {
  let wasPlaying = true;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry) return;
      if (!entry.isIntersecting && wasPlaying) {
        postCommand(iframe, "pauseVideo");
        wasPlaying = false;
      } else if (entry.isIntersecting && !wasPlaying) {
        if (activeIframe === iframe) {
          postCommand(iframe, "playVideo");
          wasPlaying = true;
        }
      }
    },
    { threshold },
  );

  observer.observe(element);
  return () => observer.disconnect();
}
