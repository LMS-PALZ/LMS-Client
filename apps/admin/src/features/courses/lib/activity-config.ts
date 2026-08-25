import { FileText, Radio } from "lucide-react";
import type { ActivityTypeOption } from "../types/activity";

export const ACTIVITY_TYPE_OPTIONS: ActivityTypeOption[] = [
  { id: "live_session", label: "Live Session", icon: Radio },
  { id: "reading", label: "Reading", icon: FileText },
];
