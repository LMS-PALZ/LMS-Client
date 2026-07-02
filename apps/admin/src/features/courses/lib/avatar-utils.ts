const AVATAR_PALETTE = [
  "bg-[#86EFAC] text-[#033207]",
  "bg-[#E2E8F0] text-[#033207]",
  "bg-[#2BADFF] text-[#033207]",
  "bg-[#F87171] text-[#033207]",
  "bg-[#FCE4EC] text-[#033207]",
  "bg-[#FFF8E1] text-[#033207]",
  "bg-[#EDE7F6] text-[#033207]",
];

export function getAvatarColorFromId(id: string): string {
  let hash = 0;
  for (let index = 0; index < id.length; index += 1) {
    hash = (hash + id.charCodeAt(index)) % AVATAR_PALETTE.length;
  }
  return AVATAR_PALETTE[hash] ?? AVATAR_PALETTE[0];
}

export function getInitialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.charAt(0).toUpperCase() ?? "";
  const last =
    parts.length > 1 ? parts[parts.length - 1]?.charAt(0).toUpperCase() : "";
  return `${first}${last}`;
}
