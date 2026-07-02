"use client";

import { useRef, useState } from "react";
import { Info, Upload, Link2, FileText, X } from "lucide-react";
import {
  CustomSelect,
  Button,
  Input,
  AlertBanner,
  DatePicker,
  Spinner,
} from "@ssu/ui";
import {
  usecreateAssessmentMutation,
  usePrograms,
  useClassroomModules,
} from "@ssu/queries";
import { useRouter } from "next/navigation";

type StaffTab = "file" | "link";

export function CreateAssignmentPage() {
  const [activeTab, setActiveTab] = useState<StaffTab>("file");
  const router = useRouter();
  const createAssessment = usecreateAssessmentMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [courseId, setCourseId] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [couseSlug, setCourseSlug] = useState("");
  const [module, setModule] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [weight, setWeight] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [urlMeta, setUrlMeta] = useState<
    { name: string; type: string; url: string }[]
  >([]);

  const { data: programs } = usePrograms();
  const { data: modulesData } = useClassroomModules(courseId);
  const moduleOptions = modulesData?.modules?.map((m: any) => m.title) ?? [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    setFiles((prev) => [...prev, ...selected]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...dropped]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const addUrl = () => {
    if (!urlInput.trim()) return;
    setUrlMeta((prev) => [
      ...prev,
      { name: urlInput, type: "link", url: urlInput },
    ]);
    setUrlInput("");
  };

  const handleSubmit = async (isDraft: boolean) => {
    if (!title || !couseSlug) return;

    try {
      await createAssessment.mutateAsync({
        program: couseSlug,
        title,
        module: module || undefined,
        instructions: instructions || undefined,
        dueDate: dueDate ? dueDate.split("-").reverse().join("/") : undefined,
        weight: weight ? Number(weight) : undefined,
        referenceMaterialsMeta: urlMeta.length ? urlMeta : undefined,
        files: files.length ? files : undefined,
        isDraft,
      });

      router.push("/assessment");
    } catch {}
  };

  return (
    <div className="space-y-8">
      {createAssessment.isError && (
        <AlertBanner variant="error">
          {(createAssessment.error as Error)?.message}
        </AlertBanner>
      )}

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          className="rounded-full px-4 text-[#4C7D5B] text-sm bg-[#ECF1ED] border-none"
          disabled={createAssessment.isPending}
          onClick={() => handleSubmit(true)}
        >
          {createAssessment.isPending ? (
            <Spinner className="h-4 w-4 animate-spin" />
          ) : (
            "Save as draft"
          )}
        </Button>

        <Button
          type="button"
          variant="primary"
          className="rounded-full px-6 bg-[#4C7D5B] text-[#F8F9FA]"
          disabled={createAssessment.isPending || !title || !courseTitle}
          onClick={() => handleSubmit(false)}
        >
          {createAssessment.isPending ? (
            <Spinner className="h-4 w-4 animate-spin" />
          ) : (
            "Publish"
          )}
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.8fr_1fr]">
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Assessment title
            </label>
            <Input
              placeholder="Enter assessment title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Instructions
            </label>
            <div className="overflow-hidden rounded-xl border border-[#D7DFEC]">
              <div className="flex items-center gap-4 border-b bg-[#F8FAFC] px-4 py-3">
                <span className="cursor-pointer font-bold">B</span>
                <span className="cursor-pointer italic">I</span>
                <span className="cursor-pointer underline">U</span>
                <span className="cursor-pointer">≡</span>
                <span className="cursor-pointer">•</span>
              </div>
              <textarea
                rows={14}
                placeholder="Write assignment instructions..."
                className="w-full resize-none p-4 outline-none"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium">Reference Material</h3>

            <div className="flex items-center mb-2 gap-2 rounded-[12px] bg-[#ECF0F6] p-[2px] w-fit">
              <button
                type="button"
                onClick={() => setActiveTab("file")}
                className={`rounded-[9px] px-5 py-2 text-[12px] flex gap-2 font-medium transition ${
                  activeTab === "file"
                    ? "bg-white text-[#1D1D1D] shadow-sm"
                    : "text-[#6B7280]"
                }`}
              >
                <Upload className="h-4 w-4" /> From Device
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("link")}
                className={`rounded-[9px] px-5 py-2 text-[12px] flex gap-2 font-medium transition ${
                  activeTab === "link"
                    ? "bg-white text-[#1D1D1D] shadow-sm"
                    : "text-[#6B7280]"
                }`}
              >
                <Link2 className="h-4 w-4" /> From URL
              </button>
            </div>

            {activeTab === "file" ? (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer rounded-xl border border-dashed border-[#CBD5E1] px-10 py-6 text-center hover:bg-[#FAFBFD]"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
                <p className="text-sm text-[#475569]">
                  Drop file here or{" "}
                  <span className="font-medium text-[#4E845F]">
                    click to browse
                  </span>
                </p>
                <p className="mt-2 text-xs text-[#94A3B8]">
                  You can upload files up to the maximum of 100 MB
                </p>
              </div>
            ) : (
              <div className="cursor-pointer rounded-xl border border-dashed border-[#CBD5E1] px-10 py-6 hover:bg-[#FAFBFD] flex items-center justify-center">
                <Input
                  placeholder="Paste URL"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-[60%] text-sm"
                />
                <button
                  type="button"
                  onClick={addUrl}
                  className="border-non px-4 py-2 text-md text-[15px] text-[#4C7D5B]"
                >
                  + Add
                </button>
              </div>
            )}

            {/* Uploaded files */}
            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-[#E8EDF5] bg-[#FAFBFD] px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#4E845F]" />
                      <span className="text-[13px] text-[#1D1D1D]">
                        {file.name}
                      </span>
                      <span className="text-[12px] text-[#9CA3AF]">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="rounded-full p-1 bg-[#6B757D]"
                    >
                      <X className="h-3 w-3 text-[#FFFFFF]" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {urlMeta.length > 0 && (
              <div className="mt-3 space-y-2">
                {urlMeta.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-[#E8EDF5] bg-[#FAFBFD] px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <Link2 className="h-4 w-4 text-[#4E845F]" />
                      <span className="text-[13px] text-[#1D1D1D]">
                        {item.url}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setUrlMeta((prev) => prev.filter((_, i) => i !== index))
                      }
                      className="rounded-full p-1 bg-[#6B757D]"
                    >
                      <X className="h-3 w-3 text-[#FFFFFF]" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">Course</label>
            <CustomSelect
              placeholder="Select a course"
              value={courseTitle}
              onChange={(selectedTitle) => {
                const selected = programs?.find(
                  (p) => p.title === selectedTitle,
                );
                setCourseTitle(selectedTitle);
                setCourseId(selected?.id ?? "");
                setCourseSlug(selected?.slug ?? "");
              }}
              options={programs?.map((program) => program.title) ?? []}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Module</label>
            <CustomSelect
              placeholder="Select a module"
              options={
                moduleOptions.length ? moduleOptions : ["Select a course first"]
              }
              value={module}
              onChange={setModule}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Due date</label>
            <div className="relative">
              <DatePicker
                id="assignment-due-date"
                value={dueDate}
                onChange={setDueDate}
              />
            </div>
            <div className="mt-2 flex items-center gap-2 rounded-lg bg-[#E8F0FF] px-3 py-2 text-sm text-[#2563EB]">
              <Info className="h-4 w-4" />
              Submission auto closes at 11:59pm
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Weight (%)</label>
            <Input
              placeholder="Enter a weight"
              type="number"
              min="0"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
