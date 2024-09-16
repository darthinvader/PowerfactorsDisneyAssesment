import { Character } from "@/types/character";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeApiResponse(data: { data: Character | Character[] }): Character[] {
  if (Array.isArray(data.data)) {
    return data.data;
  } else if (data.data) {
    return [data.data];
  }
  return [];
}