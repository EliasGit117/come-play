
const options =  ["Mod", "Shift", "Alt"] as const;

export const getShortcutKey = (key: typeof options[number]) => {
  const isMacOS = /macintosh|mac os x/gi.test(navigator.userAgent);

  if (key === "Mod") {
    return isMacOS ? "⌘" : "Ctrl";
  }

  if (key === "Shift") {
    return isMacOS ? "⇧" : key;
  }

  if (key === "Alt") {
    return isMacOS ? "⌥" : key;
  }

  return key;
};
