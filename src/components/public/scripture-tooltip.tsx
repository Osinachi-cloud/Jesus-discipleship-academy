"use client";

import { useEffect, useRef } from "react";

export function ScriptureTooltip() {
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.classList.contains("scripture-reference")) return;

      const reference = target.getAttribute("data-reference") || "";
      const verseText = target.getAttribute("data-verse-text") || "";

      if (!tooltipRef.current) return;

      tooltipRef.current.innerHTML = `
        <div class="scripture-tooltip-header">
          ${reference}
        </div>
        <div class="scripture-tooltip-body">
          ${verseText}
        </div>
      `;

      const rect = target.getBoundingClientRect();
      const tooltipWidth = 380;

      let left = rect.left + rect.width / 2 - tooltipWidth / 2;
      if (left < 10) left = 10;
      if (left + tooltipWidth > window.innerWidth - 10) {
        left = window.innerWidth - tooltipWidth - 10;
      }

      tooltipRef.current.style.left = `${left}px`;
      tooltipRef.current.style.top = `${rect.top + window.scrollY - 10}px`;
      tooltipRef.current.style.transform = "translateY(-100%)";
      tooltipRef.current.style.opacity = "1";
      tooltipRef.current.style.visibility = "visible";
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.classList.contains("scripture-reference")) return;

      if (tooltipRef.current) {
        tooltipRef.current.style.opacity = "0";
        tooltipRef.current.style.visibility = "hidden";
      }
    };

    document.addEventListener("mouseenter", handleMouseEnter, true);
    document.addEventListener("mouseleave", handleMouseLeave, true);

    return () => {
      document.removeEventListener("mouseenter", handleMouseEnter, true);
      document.removeEventListener("mouseleave", handleMouseLeave, true);
    };
  }, []);

  return (
    <div
      ref={tooltipRef}
      className="scripture-tooltip-container"
      style={{
        position: "absolute",
        opacity: 0,
        visibility: "hidden",
        transition: "opacity 0.2s ease",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    />
  );
}
