"use client";

import dynamic from "next/dynamic";
import type { ZoomLiveEmbedClientProps } from "./ZoomLiveEmbedClient";

const ZoomLiveEmbedClient = dynamic(
  () =>
    import("./ZoomLiveEmbedClient").then(
      (module) => module.ZoomLiveEmbedClient,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[640px] items-center justify-center rounded-[18px] bg-[#1a1a1a]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    ),
  },
);

export type ZoomLiveEmbedProps = ZoomLiveEmbedClientProps;

export function ZoomLiveEmbed(props: ZoomLiveEmbedProps) {
  return <ZoomLiveEmbedClient {...props} />;
}
