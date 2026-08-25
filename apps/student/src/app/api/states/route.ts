import {
  fallbackStates,
  fetchNigeriaStatesFromApi,
  getApiBaseUrl,
} from "@ssu/api";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const upstream = await fetchNigeriaStatesFromApi(getApiBaseUrl());
    const states = upstream.length > 0 ? upstream : fallbackStates();

    return NextResponse.json({
      status: true,
      data: states,
    });
  } catch {
    return NextResponse.json({
      status: true,
      data: fallbackStates(),
    });
  }
}
