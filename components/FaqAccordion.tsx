"use client";

import { useState } from "react";

type FaqAccordionProps = {
  items: ReadonlyArray<{
    question: string;
    answer: string;
  }>;
};

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="faq-list">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `faq-answer-${index}`;

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
            <div id={panelId} className="faq-answer" hidden={!isOpen}>
              <p>{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
