import {
  buildBirthYearOptions,
  fetchBirthYearsFromApi,
  getApiBaseUrl,
} from "@ssu/api";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const upstream = await fetchBirthYearsFromApi(getApiBaseUrl());
    const years = upstream.length > 0 ? upstream : buildBirthYearOptions();

    return NextResponse.json({
      status: true,
      data: years,
    });
  } catch {
    return NextResponse.json({
      status: true,
      data: buildBirthYearOptions(),
    });
  }
}
