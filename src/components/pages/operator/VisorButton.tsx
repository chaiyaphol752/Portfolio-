"use client";

import { useRef, useState } from "react";
import s from "./operator.module.css";

/**
 * The page's one easter egg: touching the visor briefly synchronises the environment
 * (via a data attribute on the root) and surfaces a single line of text. Nothing else.
 */
export function VisorButton({ rootId, label, message }: { rootId: string; label: string; message: string }) {
  const [shown, setShown] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const activate = () => {
    const root = document.getElementById(rootId);
    window.clearTimeout(timer.current);
    if (root) root.dataset.sync = "";
    setShown(true);
    timer.current = window.setTimeout(() => {
      if (root) delete root.dataset.sync;
      setShown(false);
    }, 2600);
  };

  return (
    <>
      <button type="button" className={s.visorButton} aria-label={label} onClick={activate} />
      <p className={s.visorMessage} data-shown={shown ? "" : undefined} role="status">
        {shown ? message : ""}
      </p>
    </>
  );
}
