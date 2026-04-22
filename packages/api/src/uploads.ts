export const uploadsApi = {
  presign: async (_file: File): Promise<{ url: string }> => {
    await new Promise((r) => setTimeout(r, 200));
    return { url: "https://example.com/file" };
  },
};
