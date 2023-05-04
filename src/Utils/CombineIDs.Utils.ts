import { createHash } from "crypto";

function isCompare(id1: string, id2: string, index: number) {
  if (id1.charCodeAt(index) > id2.charCodeAt(index)) return 1;
  if (id1.charCodeAt(index) < id2.charCodeAt(index)) return -1;
  return 0;
}

export function CombineIDs(id1: string, id2: string) {
  let id = createHash("md5").update(`${id1}${id2}`).digest("hex");
  if (!id1 || !id2) {
    throw new Error("Combine id is failure");
  }
  for (let i = 0; i < id1.length; i++) {
    let isBreak = false;
    switch (isCompare(id1, id2, i)) {
      case -1:
        isBreak = true;
        id = createHash("md5").update(`${id2}${id1}`).digest("hex");
        break;
      case 1:
        isBreak = true;
        break;
    }
    if (isBreak) {
      break;
    }
  }
  return id;
}
