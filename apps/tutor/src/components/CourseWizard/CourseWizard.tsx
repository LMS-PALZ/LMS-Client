"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { courseDetailsStepSchema } from "@ssu/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FileDropzone, Input, StepWizard } from "@ssu/ui";
import { GripVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { StepDetails } from "./steps/StepDetails";
import { StepModules } from "./steps/StepModules";
import { StepResources } from "./steps/StepResources";
import { StepReview } from "./steps/StepReview";
import type { CourseModuleDraft } from "./types";

function SortableModuleRow({
  item,
  onTitle,
  onRemove,
}: {
  item: CourseModuleDraft;
  onTitle: (id: string, title: string) => void;
  onRemove: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 rounded-lg border bg-white p-3 shadow-card"
    >
      <button
        type="button"
        className="touch-none rounded p-2 text-neutral-500 hover:bg-neutral-100"
        aria-label="Reorder"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <Input
        className="flex-1"
        value={item.title}
        onChange={(e) => onTitle(item.id, e.target.value)}
        aria-label="Module title"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onRemove(item.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

const steps = [
  { id: "details", label: "Details" },
  { id: "modules", label: "Modules" },
  { id: "resources", label: "Resources" },
  { id: "review", label: "Review" },
];

export function CourseWizard() {
  const [active, setActive] = useState(0);
  const [modules, setModules] = useState<CourseModuleDraft[]>([
    { id: "m1", title: "Introduction", type: "live", description: "" },
  ]);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  const detailsForm = useForm<z.infer<typeof courseDetailsStepSchema>>({
    resolver: zodResolver(courseDetailsStepSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      durationHours: 0,
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const onDragEnd = (e: DragEndEvent) => {
    const { active: a, over: o } = e;
    if (!o || a.id === o.id) return;
    setModules((items) => {
      const oldIndex = items.findIndex((i) => i.id === a.id);
      const newIndex = items.findIndex((i) => i.id === o.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  return (
    <div className="space-y-6">
      <StepWizard steps={steps} activeIndex={active}>
        {active === 0 && (
          <StepDetails
            form={detailsForm}
            bannerSlot={
              <FileDropzone
                maxSizeBytes={2 * 1024 * 1024}
                description="Banner image, max 2MB. Recommended 1200×400px."
                accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
                onFiles={(files) => {
                  const f = files[0];
                  if (f) setBannerUrl(URL.createObjectURL(f));
                }}
              />
            }
            previewUrl={bannerUrl}
          />
        )}
        {active === 1 && (
          <StepModules
            modules={modules}
            onAdd={() =>
              setModules((m) => [
                ...m,
                {
                  id: `m-${Date.now()}`,
                  title: "New module",
                  type: "reading",
                  description: "",
                },
              ])
            }
            list={
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={onDragEnd}
              >
                <SortableContext
                  items={modules.map((m) => m.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {modules.map((mod) => (
                      <SortableModuleRow
                        key={mod.id}
                        item={mod}
                        onTitle={(id, title) =>
                          setModules((ms) =>
                            ms.map((x) => (x.id === id ? { ...x, title } : x)),
                          )
                        }
                        onRemove={(id) =>
                          setModules((ms) => ms.filter((x) => x.id !== id))
                        }
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            }
          />
        )}
        {active === 2 && <StepResources />}
        {active === 3 && (
          <StepReview values={detailsForm.watch()} modules={modules} />
        )}
      </StepWizard>
      <div className="flex justify-between gap-2">
        <Button
          type="button"
          variant="secondary"
          disabled={active === 0}
          onClick={() => setActive((i) => i - 1)}
        >
          Back
        </Button>
        {active < steps.length - 1 ? (
          <Button
            type="button"
            variant="primary"
            onClick={() => {
              if (active === 0) {
                void detailsForm.handleSubmit(() => setActive((i) => i + 1))();
              } else {
                setActive((i) => i + 1);
              }
            }}
          >
            Next
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button type="button" variant="secondary">
              Save as draft
            </Button>
            <Button type="button" variant="primary">
              Publish
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
