import { useEffect } from "react";

/**
 * 设置页面标题
 * @param title 标题文案
 */
export function usePageTitle(title: string) {
  useEffect(() => {
    const prev = document.title;
    document.title = title;
    return () => {
      document.title = prev;
    };
  }, [title]);
}
