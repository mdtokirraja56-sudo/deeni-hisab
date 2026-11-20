"use client";
import { useEffect, useRef } from "react";

type Args = {
  tab: string;
  hasResult: boolean;
  dialogOpen: boolean;
  closeDialog: () => void;
  closeResult: () => void;
  goHome: () => void;
};

/* Android back / swipe-back: har naya screen (tab, result, dialog) history me
   ek entry banata hai, taa ke back dabane par sirf ek qadam peeche jaye. */
export function useBackNav(a: Args) {
  const depth = (a.tab !== "mirath" ? 1 : 0) + (a.hasResult ? 1 : 0) + (a.dialogOpen ? 1 : 0);
  const pushed = useRef(0);
  const ignore = useRef(false);
  const latest = useRef(a);
  latest.current = a;

  useEffect(() => {
    if (depth > pushed.current) {
      for (let i = pushed.current; i < depth; i++) window.history.pushState({ dh: i + 1 }, "");
      pushed.current = depth;
    } else if (depth < pushed.current) {
      const diff = pushed.current - depth;
      pushed.current = depth;
      ignore.current = true;
      window.history.go(-diff);
    }
  }, [depth]);

  useEffect(() => {
    const onPop = () => {
      if (ignore.current) { ignore.current = false; return; }
      const s = latest.current;
      if (pushed.current <= 0) return;
      pushed.current -= 1;
      if (s.dialogOpen) s.closeDialog();
      else if (s.hasResult) s.closeResult();
      else if (s.tab !== "mirath") s.goHome();
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
}
