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
    sdkKey?: string;
    meetingNumber: string;
    password?: string;
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

/**
 * Zoom 6.x CDN no longer serves /css/bootstrap.css (403).
 * Load Component View JS from CDN and styles from our public copy.
 */
export async function loadZoomEmbeddedSdk(): Promise<ZoomEmbeddedSdk> {
  if (window.ZoomMtgEmbedded) {
    return window.ZoomMtgEmbedded;
  }

  const base = `https://source.zoom.us/${ZOOM_SDK_VERSION}`;

  // Zoom's own CDN returns 403 for 6.x /css/*.css — load styles from the npm CDN instead.
  await loadStylesheet(
    `https://cdn.jsdelivr.net/npm/@zoom/meetingsdk@${ZOOM_SDK_VERSION}/dist/ui/zoom-meetingsdk.css`,
  );

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
