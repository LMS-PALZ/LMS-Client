"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "../../atoms/Button";
import { Modal } from "./Modal";

const meta: Meta<typeof Modal> = {
  title: "Organisms/Modal",
  component: Modal,
};

export default meta;
type Story = StoryObj<typeof Modal>;

function Demo() {
  const [open, setOpen] = useState(true);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Example"
        footer={<Button onClick={() => setOpen(false)}>OK</Button>}
      >
        <p className="text-body">Content</p>
      </Modal>
    </>
  );
}

export const Default: Story = { render: () => <Demo /> };
