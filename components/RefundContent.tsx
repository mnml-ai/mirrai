import type { CSSProperties } from "react";
import HomepageFinale from "@/components/HomepageFinale";
import LegalCompanyInfo from "@/components/LegalCompanyInfo";
import SiteNavbar from "@/components/SiteNavbar";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { MIRRAI_EMAIL, MIRRAI_EMAIL_DISPLAY } from "@/lib/emails";

type RefundSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  listAfterParagraphCount?: number;
};

type RefundPageCopy = {
  kicker: string;
  title: string;
  updated: string;
  intro: string;
  sections: RefundSection[];
  contact: {
    title: string;
    intro: string;
    emailLabel: string;
    phoneLabel: string;
    addressLabel: string;
    address: string;
  };
};

const REFUND_COPY: Record<Locale, RefundPageCopy> = {
  en: {
    kicker: "Refunds",
    title: "Refund Policy",
    updated: "Last Updated: June 2026",
    intro:
      "At MIRRAI, we strive to provide high-quality products and exceptional customer service. As many of our products are custom-made or manufactured upon order, the following Refund Policy applies.",
    sections: [
      {
        title: "1. Order Cancellation Before Production",
        paragraphs: [
          "Customers may cancel an order within 48 hours of order confirmation and payment approval for a full refund.",
          "After the initial 48-hour period, MIRRAI reserves the right to deduct any costs already incurred for design work, materials procurement, or production activities.",
        ],
      },
      {
        title: "2. Custom-Made Products",
        paragraphs: [
          "Due to the personalized nature of our products, custom-made items are non-refundable and non-returnable once production has commenced.",
          "This includes:",
        ],
        listAfterParagraphCount: 2,
        bullets: [
          "Custom dimensions",
          "Custom finishes or colors",
          "Client-requested modifications or specifications",
        ],
      },
      {
        title: "3. Defective or Damaged Products",
        paragraphs: [
          "If a product contains a manufacturing defect or damage resulting from MIRRAI’s production or installation process, customers must notify MIRRAI within 48 hours of delivery.",
          "Following inspection, MIRRAI may:",
          "The appropriate resolution will be determined by MIRRAI following technical evaluation.",
        ],
        listAfterParagraphCount: 2,
        bullets: [
          "Repair the product",
          "Replace the affected component or product",
          "Issue a refund if repair or replacement is not possible",
        ],
      },
      {
        title: "4. Damage After Delivery",
        paragraphs: [
          "Refunds, returns, or replacements do not apply to damage occurring after delivery or installation, including:",
        ],
        bullets: [
          "Broken or cracked mirror glass",
          "Misuse",
          "Accidental damage",
          "Water or humidity damage",
          "Electrical issues caused by external factors",
          "Unauthorized repairs or modifications",
        ],
      },
      {
        title: "5. Product Acceptance",
        paragraphs: [
          "Customers are encouraged to inspect products upon delivery or immediately after installation.",
          "Any visible manufacturing or quality issues should be reported before final acceptance of the product.",
          "Once accepted, the product becomes subject to the applicable warranty terms.",
        ],
      },
      {
        title: "6. Refund Processing",
        paragraphs: [
          "Approved refunds will be issued using the original payment method whenever possible.",
          "Refund processing may require between 7 and 14 business days depending on the payment provider or banking institution.",
          "Installment fees, financing charges, payment gateway fees, and third-party service fees are non-refundable.",
        ],
      },
    ],
    contact: {
      title: "7. Contact Information",
      intro: "For any questions regarding this Refund Policy, please contact:",
      emailLabel: "Email",
      phoneLabel: "Phone",
      addressLabel: "Address",
      address: "5th Settlement, Cairo, Egypt",
    },
  },
  ar: {
    kicker: "الاسترجاع",
    title: "سياسة الاسترجاع والاسترداد",
    updated: "آخر تحديث: يونيو 2026",
    intro:
      "في MIRRAI نسعى لتقديم منتجات عالية الجودة وتجربة شراء مميزة. ونظرًا لأن معظم منتجاتنا يتم تصنيعها أو تجهيزها حسب الطلب، فإن سياسة الاسترجاع والاسترداد تخضع للشروط التالية:",
    sections: [
      {
        title: "1. إلغاء الطلب قبل بدء التصنيع",
        paragraphs: [
          "يمكن للعميل طلب إلغاء الطلب خلال 48 ساعة من تأكيد الطلب واعتماد الدفع، وفي هذه الحالة يتم استرداد المبلغ المدفوع بالكامل.",
          "بعد انتهاء فترة الـ 48 ساعة، يحق لـ MIRRAI خصم أي تكاليف تم تحملها بالفعل والمتعلقة بالتصميم أو الخامات أو إجراءات التصنيع التي تم البدء بها.",
        ],
      },
      {
        title: "2. المنتجات المصنعة حسب الطلب",
        paragraphs: [
          "نظرًا لأن معظم منتجات MIRRAI يتم تصنيعها أو تجهيزها وفقًا لمواصفات خاصة بالعميل، فإن المنتجات المصنوعة حسب الطلب لا يمكن استرجاعها أو استبدالها أو استرداد قيمتها بعد بدء عملية التصنيع.",
          "ويشمل ذلك:",
        ],
        listAfterParagraphCount: 2,
        bullets: [
          "المقاسات الخاصة",
          "التشطيبات والألوان الخاصة",
          "أي تعديلات أو مواصفات تم تنفيذها بناءً على طلب العميل",
        ],
      },
      {
        title: "3. المنتجات التالفة أو المعيبة",
        paragraphs: [
          "في حال استلام منتج يحتوي على عيب تصنيع واضح أو تلف ناتج عن التصنيع أو التركيب بواسطة MIRRAI، يجب إبلاغنا خلال 48 ساعة من الاستلام.",
          "وبعد مراجعة الحالة، يحق لـ MIRRAI:",
          "ويتم تحديد الإجراء المناسب وفقًا لتقييم فريق MIRRAI الفني.",
        ],
        listAfterParagraphCount: 2,
        bullets: [
          "إصلاح المنتج",
          "استبدال المنتج أو الجزء المتضرر",
          "استرداد المبلغ المدفوع إذا تعذر الإصلاح أو الاستبدال",
        ],
      },
      {
        title: "4. التلف الناتج بعد الاستلام",
        paragraphs: [
          "لا يشمل الاسترجاع أو الاسترداد أي أضرار ناتجة بعد التسليم أو التركيب، بما في ذلك:",
        ],
        bullets: [
          "كسر أو شرخ الزجاج",
          "سوء الاستخدام",
          "الحوادث أو الصدمات",
          "الرطوبة أو المياه",
          "مشاكل الكهرباء أو التوصيلات غير المطابقة للمواصفات",
          "أي تدخل أو تعديل من جهة غير معتمدة من MIRRAI",
        ],
      },
      {
        title: "5. رفض المنتج عند التسليم",
        paragraphs: [
          "يحق للعميل فحص المنتج عند الاستلام أو بعد انتهاء التركيب.",
          "وفي حال وجود مشكلة واضحة متعلقة بالتصنيع أو الجودة، يجب الإبلاغ عنها فورًا قبل توقيع الاستلام النهائي.",
          "أما بعد قبول واستلام المنتج، فتسري شروط الضمان الموضحة في سياسة الضمان.",
        ],
      },
      {
        title: "6. آلية الاسترداد",
        paragraphs: [
          "في الحالات التي يتم فيها اعتماد استرداد مالي، يتم رد المبلغ باستخدام نفس وسيلة الدفع الأصلية كلما أمكن ذلك.",
          "وقد تستغرق عملية الاسترداد من 7 إلى 14 يوم عمل حسب مزود خدمة الدفع أو البنك.",
          "ولا تشمل المبالغ المستردة أي رسوم تقسيط أو رسوم خدمات مالية أو رسوم معالجة مدفوعات تفرضها جهات خارجية.",
        ],
      },
    ],
    contact: {
      title: "7. التواصل معنا",
      intro: "لأي استفسارات تتعلق بسياسة الاسترجاع والاسترداد، يمكنكم التواصل معنا عبر:",
      emailLabel: "البريد الإلكتروني",
      phoneLabel: "رقم الهاتف",
      addressLabel: "العنوان",
      address: "التجمع الخامس، القاهرة، مصر",
    },
  },
};

type RefundPageContentProps = {
  locale?: Locale;
};

function renderSection(section: RefundSection) {
  const listAfterParagraphCount = section.listAfterParagraphCount ?? 1;
  const paragraphsBeforeList = section.bullets
    ? section.paragraphs?.slice(0, listAfterParagraphCount)
    : section.paragraphs;
  const paragraphsAfterList = section.bullets
    ? section.paragraphs?.slice(listAfterParagraphCount)
    : [];

  return (
    <section className="terms-section" key={section.title}>
      <h2>{section.title}</h2>
      <div className="terms-section-content">
        {paragraphsBeforeList?.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {section.bullets ? (
          <ul className="terms-list">
            {section.bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
        {paragraphsAfterList?.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

export function RefundPageContent({ locale = DEFAULT_LOCALE }: RefundPageContentProps) {
  const refund = REFUND_COPY[locale];

  return (
    <main className="terms-page refund-page">
      <SiteNavbar />

      <section className="terms-hero" aria-labelledby="refund-page-title">
        <div className="terms-hero-inner">
          <p className="terms-kicker">{refund.kicker}</p>
          <h1 id="refund-page-title">{refund.title}</h1>
          <p className="terms-updated">{refund.updated}</p>
          <div className="terms-intro">
            <p>{refund.intro}</p>
          </div>
        </div>
      </section>

      <section className="terms-body" aria-label={refund.title}>
        {refund.sections.map(renderSection)}
        <section className="terms-section terms-contact">
          <h2>{refund.contact.title}</h2>
          <div className="terms-section-content">
            <p>{refund.contact.intro}</p>
            <address className="terms-contact-list">
              <span>
                <strong>{refund.contact.emailLabel}:</strong>{" "}
                <a href={`mailto:${MIRRAI_EMAIL}`}>{MIRRAI_EMAIL_DISPLAY}</a>
              </span>
              <span>
                <strong>{refund.contact.phoneLabel}:</strong>{" "}
                <a href="tel:+201228674700">+20 122 867 4700</a>
              </span>
              <span>
                <strong>{refund.contact.addressLabel}:</strong> {refund.contact.address}
              </span>
            </address>
            <LegalCompanyInfo />
          </div>
        </section>
      </section>

      <div className="homepage-finale-region terms-page-footer-region" style={{ "--hotels-card-overlap": "0px" } as CSSProperties}>
        <div className="homepage-finale-backdrop" aria-hidden />
        <HomepageFinale showCta={false} locale={locale} routeKey="refund" />
      </div>
    </main>
  );
}
