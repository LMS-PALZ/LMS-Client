"use client";

import { useState } from "react";
import { Info, Upload, Link2 } from "lucide-react";
import { CustomSelect, Button, Input, DatePicker } from "@ssu/ui";

export function CreateAssignmentPage() {
  const [course, setCourse] = useState("");
  const [student, setStudent] = useState("");
  const [module, setModule] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);

  return (
    <div className="space-y-8">
      <div className="flex justify-end gap-3">
        <Button
          variant="secondary"
          className="rounded-full px-4 text-[#4C7D5B] text-sm bg-[#ECF1ED] border-none"
        >
          Save as draft
        </Button>

        <Button
          variant="primary"
          className="rounded-full px-6 bg-[#4C7D5B] text-[#F8F9FA]"
        >
          Assign
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.8fr_1fr]">
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Assessment title
            </label>

            <Input placeholder="Search assignment" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Instructions
            </label>

            <div className="overflow-hidden rounded-xl border border-[#D7DFEC]">
              <div className="flex items-center gap-4 border-b bg-[#F8FAFC] px-4 py-3">
                <span>B</span>
                <span>I</span>
                <span>U</span>
                <span>≡</span>
                <span>•</span>
              </div>

              <textarea
                rows={14}
                placeholder="Write assignment instructions..."
                className="w-full resize-none p-4 outline-none"
              />
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium">Reference Material</h3>

            <div className="mb-4 flex gap-2">
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm"
              >
                <Upload className="h-4 w-4" />
                From Device
              </button>

              <button
                type="button"
                className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm"
              >
                <Link2 className="h-4 w-4" />
                From URL
              </button>
            </div>

            <div className="rounded-xl border border-dashed border-[#CBD5E1] px-10 py-6 text-center">
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
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">Course</label>

            <CustomSelect
              placeholder="Select a program"
              options={[
                "Frontend Development",
                "Product Design",
                "Data Analysis",
              ]}
              value={course}
              onChange={setCourse}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Student</label>

            <CustomSelect
              placeholder="All current students"
              options={["All current students", "Student A", "Student B"]}
              value={student}
              onChange={setStudent}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Module</label>

            <CustomSelect
              placeholder="Select a module"
              options={["HTML", "CSS", "React"]}
              value={module}
              onChange={setModule}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Due date</label>

            <DatePicker
              id="assignment-due-date"
              value={dueDate}
              onChange={setDueDate}
            />

            <div className="mt-2 flex items-center gap-2 rounded-lg bg-[#E8F0FF] px-3 py-2 text-sm text-[#2563EB]">
              <Info className="h-4 w-4" />
              Submission auto closes at 11:59pm
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Weight</label>

            <Input placeholder="Enter a weight" />
          </div>
        </div>
      </div>
    </div>
  );
}
