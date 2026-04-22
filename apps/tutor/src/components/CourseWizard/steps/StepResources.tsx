import { FileDropzone } from "@ssu/ui";
import { useState } from "react";

export function StepResources() {
  const [files, setFiles] = useState<string[]>([]);
  return (
    <div className="space-y-4">
      <p className="text-body text-neutral-600">
        Attach resources per module (demo upload).
      </p>
      <FileDropzone
        onFiles={(f) => setFiles((prev) => [...prev, ...f.map((x) => x.name)])}
      />
      {files.length > 0 && (
        <ul className="text-small text-neutral-700 list-disc pl-5">
          {files.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
