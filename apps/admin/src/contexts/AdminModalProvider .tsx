"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Modal } from "@ssu/ui";

type AdminModalContextValue = {
  openModal: (title: string, content: ReactNode) => void;
  closeModal: () => void;
};

const AdminModalContext = createContext<AdminModalContextValue | null>(null);

export function AdminModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<ReactNode>(null);

  const openModal = useCallback((title: string, content: ReactNode) => {
    setTitle(title);
    setContent(content);
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
    setTitle("");
    setContent(null);
  }, []);

  const value = useMemo(
    () => ({ openModal, closeModal }),
    [openModal, closeModal],
  );

  return (
    <AdminModalContext.Provider value={value}>
      {children}
      <Modal
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) closeModal();
        }}
        title={title}
      >
        {content}
      </Modal>
    </AdminModalContext.Provider>
  );
}

export function useAdminModal() {
  const context = useContext(AdminModalContext);
  if (!context) {
    throw new Error("useAdminModal must be used within AdminModalProvider");
  }
  return context;
}
