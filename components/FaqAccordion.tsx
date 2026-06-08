"use client";

import { useState } from "react";

type FaqAccordionProps = {
  items: ReadonlyArray<{
    question: string;
    answer: string;
  }>;
  idPrefix?: string;
  defaultOpenIndex?: number | null;
};

export default function FaqAccordion({
  items,
  idPrefix = "faq",
  defaultOpenIndex = null,
}: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  return (
    <div className="faq-list">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `${idPrefix}-answer-${index}`;

        return (
          <div className="faq-item" key={item.question} data-open={isOpen}>
            <button
              className="faq-question"
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              <span>{item.question}</span>
              <b aria-hidden>+</b>
            </button>
            <div id={panelId} className="faq-answer" aria-hidden={!isOpen}>
              <div className="faq-answer-inner">
                <p>{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
