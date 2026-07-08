const ZOOM_SDK_VERSION = "6.2.0";

type ZoomEmbeddedClient = {
  init: (args: {
    zoomAppRoot: HTMLElement;
    language?: string;
    patchJsMedia?: boolean;
    leaveOnPageUnload?: boolean;
  }) => Promise<unknown>;
  join: (args: {
    signature: string;
    sdkKey: string;
    meetingNumber: string;
    password: string;
    userName: string;
  }) => Promise<unknown>;
};

export type ZoomEmbeddedSdk = {
  createClient: () => ZoomEmbeddedClient;
  destroyClient: () => void;
};

declare global {
  interface Window {
    ZoomMtgEmbedded?: ZoomEmbeddedSdk;
  }
}

function loadStylesheet(href: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`link[href="${href}"]`)) {
      resolve();
      return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to load stylesheet ${href}`));
    document.head.appendChild(link);
  });
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script ${src}`));
    document.body.appendChild(script);
  });
}

export async function loadZoomEmbeddedSdk(): Promise<ZoomEmbeddedSdk> {
  if (window.ZoomMtgEmbedded) {
    return window.ZoomMtgEmbedded;
  }

  const base = `https://source.zoom.us/${ZOOM_SDK_VERSION}`;

  await Promise.all([
    loadStylesheet(`${base}/css/bootstrap.css`),
    loadStylesheet(`${base}/css/react-select.css`),
  ]);

  await loadScript(`${base}/lib/vendor/react.min.js`);
  await loadScript(`${base}/lib/vendor/react-dom.min.js`);
  await loadScript(`${base}/lib/vendor/redux.min.js`);
  await loadScript(`${base}/lib/vendor/redux-thunk.min.js`);
  await loadScript(`${base}/lib/vendor/lodash.min.js`);
  await loadScript(`${base}/zoom-meeting-embedded-${ZOOM_SDK_VERSION}.min.js`);

  if (!window.ZoomMtgEmbedded) {
    throw new Error("Zoom Meeting SDK failed to load.");
  }

  return window.ZoomMtgEmbedded;
}
