"use client";

import type { ReactNode } from "react";
import {
  Button as AriaButton,
  Disclosure as AriaDisclosure,
  DisclosureGroup as AriaDisclosureGroup,
  DisclosurePanel as AriaDisclosurePanel,
  Heading as AriaHeading,
} from "react-aria-components";
import type { DisclosureGroupProps } from "react-aria-components";
import { Plus } from "./icons";

/**
 * Contained accordion, adapted from BoardUI's `Accordion variant="contained"`
 * (https://www.boardui.com): cards on a tray, built on React Aria's
 * DisclosureGroup so each header is a real button with aria-expanded, and
 * collapsed panels stay find-in-page searchable. The panel height eases on
 * React Aria's `--disclosure-panel-height`; content fades, drops 4px and
 * un-blurs. Re-tokenised to Papr's palette.
 */
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

export function Accordion({
  className = "",
  children,
  ...props
}: Omit<DisclosureGroupProps, "className" | "children"> & { className?: string; children: ReactNode }) {
  return (
    <AriaDisclosureGroup
      {...props}
      className={`flex flex-col gap-[3px] rounded-[26px] bg-paper-2 p-[3px] ring-1 ring-line/70 ${className}`}
    >
      {children}
    </AriaDisclosureGroup>
  );
}

export function AccordionItem({ id, title, children }: { id: string; title: ReactNode; children: ReactNode }) {
  return (
    <AriaDisclosure
      id={id}
      className="group/item rounded-[23px] bg-white shadow-[0_1px_2px_rgb(13_21_19/0.04)]"
    >
      <AriaHeading level={3} className="flex">
        <AriaButton
          slot="trigger"
          className={({ isFocusVisible }) =>
            `group/trigger flex w-full cursor-pointer items-center gap-3 rounded-[23px] px-5 py-4 text-start outline-none md:px-6 md:py-5 ${
              isFocusVisible ? "ring-2 ring-teal ring-inset" : ""
            }`
          }
        >
          <span className="min-w-0 flex-1 text-[16px] font-medium tracking-[-0.01em] text-ink">{title}</span>
          <span
            aria-hidden
            className={`grid size-7 shrink-0 place-items-center rounded-full bg-paper text-ink-3 transition-[rotate,color,background-color] duration-300 motion-reduce:transition-none ${EASE} group-hover/trigger:text-ink group-data-[expanded]/item:rotate-45 group-data-[expanded]/item:bg-teal group-data-[expanded]/item:text-peach`}
          >
            <Plus className="size-3.5" />
          </span>
        </AriaButton>
      </AriaHeading>
      <AriaDisclosurePanel
        className={`h-(--disclosure-panel-height) overflow-clip transition-[height] duration-300 motion-reduce:transition-none ${EASE}`}
      >
        <div
          className={`px-5 pb-5 text-[15px] leading-relaxed text-pretty text-ink-2 opacity-0 transition-[opacity,translate,filter] duration-300 motion-reduce:transition-none motion-safe:-translate-y-1 motion-safe:blur-[4px] group-data-[expanded]/item:translate-y-0 group-data-[expanded]/item:opacity-100 group-data-[expanded]/item:blur-[0px] md:px-6 md:pb-6 ${EASE}`}
        >
          <p className="max-w-[60ch]">{children}</p>
        </div>
      </AriaDisclosurePanel>
    </AriaDisclosure>
  );
}
