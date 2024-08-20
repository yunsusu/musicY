import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const access = atomWithStorage("access", "");
export const songChoice = atom("");
export const device = atom("");
