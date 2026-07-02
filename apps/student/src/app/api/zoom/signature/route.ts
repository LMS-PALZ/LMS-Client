import {
  generateMeetingSdkSignature,
  normalizeMeetingNumber,
  readZoomSdkCredentials,
} from "@/lib/zoom/signature";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      meetingNumber?: string | number;
      role?: number;
    };

    const meetingNumber = normalizeMeetingNumber(
      String(body.meetingNumber ?? ""),
    );
    const role: 0 | 1 = body.role === 1 ? 1 : 0;

    if (!meetingNumber) {
      return NextResponse.json(
        { message: "meetingNumber is required" },
        { status: 400 },
      );
    }

    const { clientId, clientSecret } = readZoomSdkCredentials();
    if (!clientId || !clientSecret) {
      return NextResponse.json(
        {
          message:
            "Zoom Meeting SDK is not configured. Add ZOOM_MEETING_SDK_CLIENT_ID and ZOOM_MEETING_SDK_CLIENT_SECRET.",
        },
        { status: 503 },
      );
    }

    const signature = generateMeetingSdkSignature(
      clientId,
      clientSecret,
      meetingNumber,
      role,
    );

    return NextResponse.json({
      signature,
      sdkKey: clientId,
    });
  } catch {
    return NextResponse.json(
      { message: "Unable to generate Zoom meeting signature." },
      { status: 500 },
    );
  }
}
