import type { CSSProperties } from "react";
import HomepageFinale from "@/components/HomepageFinale";
import SiteNavbar from "@/components/SiteNavbar";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";

type DeliverySection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  listAfterParagraphCount?: number;
};

type DeliveryPageCopy = {
  kicker: string;
  title: string;
  updated: string;
  intro: string;
  sections: DeliverySection[];
  contact: {
    title: string;
    intro: string;
    emailLabel: string;
    phoneLabel: string;
    addressLabel: string;
    address: string;
  };
};

const DELIVERY_COPY: Record<Locale, DeliveryPageCopy> = {
  en: {
    kicker: "Delivery",
    title: "Delivery Policy",
    updated: "Last Updated: June 2026",
    intro:
      "At MIRRAI, we are committed to delivering our products with the highest level of care and quality to ensure they arrive in excellent condition.",
    sections: [
      {
        title: "1. Delivery Areas",
        paragraphs: [
          "MIRRAI currently provides delivery services across Egypt. International shipping may be available for selected products or projects depending on the destination and order requirements.",
          "International delivery and installation availability will be confirmed after reviewing the order details.",
        ],
      },
      {
        title: "2. Delivery Timeframes",
        paragraphs: [
          "Delivery timelines vary depending on:",
          "All delivery timelines provided are estimates only and may vary depending on operational or logistics circumstances.",
        ],
        bullets: [
          "Product type",
          "Production status",
          "Delivery location",
          "Shipping or installation schedule",
        ],
      },
      {
        title: "3. Delivery & Installation Appointments",
        paragraphs: [
          "Customers will be contacted to confirm delivery or installation appointments before execution.",
          "Clients are responsible for ensuring:",
          "If delivery or installation cannot be completed due to site-related conditions, MIRRAI reserves the right to reschedule the appointment and apply additional service fees when necessary.",
        ],
        listAfterParagraphCount: 2,
        bullets: [
          "Site readiness",
          "Accessible delivery and installation access",
          "Ability to move the product into the installation location",
          "Availability of required electrical preparation where applicable",
        ],
      },
      {
        title: "4. Product Inspection Upon Delivery",
        paragraphs: [
          "Customers are encouraged to inspect products upon delivery or immediately after installation.",
          "Any visible damage or product-related issue must be reported to MIRRAI within 48 hours of delivery.",
          "MIRRAI shall not be held responsible for damages reported after this period unless covered under the applicable warranty terms.",
        ],
      },
      {
        title: "5. Delays & Circumstances Beyond Control",
        paragraphs: [
          "Delays may occur due to:",
          "MIRRAI will make reasonable efforts to communicate any significant updates regarding delivery timelines.",
        ],
        bullets: [
          "Shipping or transportation conditions",
          "Material availability delays",
          "Weather conditions",
          "Technical or operational circumstances",
          "Circumstances beyond MIRRAI’s reasonable control",
        ],
      },
      {
        title: "6. Delivery Fees",
        paragraphs: [
          "Delivery or installation fees may vary depending on:",
          "Any additional charges will be communicated before final order confirmation.",
        ],
        bullets: [
          "City or delivery area",
          "Product size",
          "Installation requirements",
          "Floor access or site accessibility",
        ],
      },
    ],
    contact: {
      title: "7. Contact Information",
      intro: "For any delivery or shipping inquiries, please contact:",
      emailLabel: "Email",
      phoneLabel: "Phone",
      addressLabel: "Address",
      address: "5th Settlement, Cairo, Egypt",
    },
  },
  ar: {
    kicker: "التوصيل",
    title: "سياسة التوصيل",
    updated: "آخر تحديث: يونيو 2026",
    intro:
      "في MIRRAI، نحرص على توصيل منتجاتنا بأعلى مستوى من الجودة والعناية لضمان وصولها بأفضل حالة ممكنة.",
    sections: [
      {
        title: "1. مناطق التوصيل",
        paragraphs: [
          "توفر MIRRAI خدمات التوصيل داخل جمهورية مصر العربية، وقد تتوفر خدمات الشحن الدولي لبعض المنتجات أو المشاريع حسب الدولة وطبيعة الطلب.",
          "ويتم تحديد إمكانية الشحن أو التركيب الدولي بعد مراجعة الطلب والتواصل مع العميل.",
        ],
      },
      {
        title: "2. مدة التوصيل",
        paragraphs: [
          "تختلف مدة التوصيل حسب:",
          "وتعتبر جميع المدد الزمنية الموضحة تقديرية وقد تختلف حسب ظروف التشغيل أو الشحن.",
        ],
        bullets: [
          "نوع المنتج",
          "حالة التصنيع",
          "موقع التوصيل",
          "جدول التركيب أو الشحن",
        ],
      },
      {
        title: "3. مواعيد التسليم والتركيب",
        paragraphs: [
          "سيتم التواصل مع العميل لتأكيد موعد التوصيل أو التركيب قبل التنفيذ.",
          "ويجب على العميل التأكد من:",
          "وفي حال تعذر التسليم أو التركيب بسبب ظروف خاصة بالموقع، يحق لـ MIRRAI إعادة جدولة الموعد مع تطبيق رسوم إضافية عند الحاجة.",
        ],
        listAfterParagraphCount: 2,
        bullets: [
          "جاهزية الموقع",
          "سهولة الوصول لمكان التركيب",
          "إمكانية إدخال المنتج إلى الموقع",
          "توافر التجهيزات الكهربائية المطلوبة عند الحاجة",
        ],
      },
      {
        title: "4. فحص المنتج عند الاستلام",
        paragraphs: [
          "يُنصح العميل بفحص المنتج عند الاستلام أو بعد انتهاء التركيب مباشرة.",
          "وفي حال وجود أي تلف ظاهر أو مشكلة متعلقة بالمنتج، يجب إبلاغ MIRRAI خلال 48 ساعة من الاستلام.",
          "ولا تتحمل MIRRAI مسؤولية أي أضرار يتم الإبلاغ عنها بعد مرور هذه الفترة ما لم تكن ضمن حالات الضمان المعتمدة.",
        ],
      },
      {
        title: "5. التأخير أو الظروف الخارجة عن الإرادة",
        paragraphs: [
          "قد تحدث بعض التأخيرات نتيجة:",
          "وفي جميع الحالات، نلتزم ببذل الجهود المعقولة لإبلاغ العميل بأي تحديثات مهمة متعلقة بالتوصيل.",
        ],
        bullets: [
          "ظروف الشحن أو النقل",
          "تأخر توفر الخامات",
          "الأحوال الجوية",
          "الظروف التشغيلية أو التقنية",
          "أي ظروف خارجة عن إرادة MIRRAI",
        ],
      },
      {
        title: "6. رسوم التوصيل",
        paragraphs: [
          "قد تختلف رسوم التوصيل أو التركيب حسب:",
          "ويتم توضيح أي رسوم إضافية للعميل قبل تأكيد الطلب.",
        ],
        bullets: [
          "المدينة أو المنطقة",
          "حجم المنتج",
          "طبيعة التركيب",
          "عدد الطوابق أو صعوبة الوصول",
        ],
      },
    ],
    contact: {
      title: "7. التواصل معنا",
      intro: "لأي استفسارات تتعلق بالتوصيل أو الشحن، يمكنكم التواصل معنا عبر:",
      emailLabel: "البريد الإلكتروني",
      phoneLabel: "رقم الهاتف",
      addressLabel: "العنوان",
      address: "التجمع الخامس، القاهرة، مصر",
    },
  },
};

type DeliveryPageContentProps = {
  locale?: Locale;
};

function renderSection(section: DeliverySection) {
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

export function DeliveryPageContent({ locale = DEFAULT_LOCALE }: DeliveryPageContentProps) {
  const delivery = DELIVERY_COPY[locale];

  return (
    <main className="terms-page delivery-page">
      <SiteNavbar />

      <section className="terms-hero" aria-labelledby="delivery-page-title">
        <div className="terms-hero-inner">
          <p className="terms-kicker">{delivery.kicker}</p>
          <h1 id="delivery-page-title">{delivery.title}</h1>
          <p className="terms-updated">{delivery.updated}</p>
          <div className="terms-intro">
            <p>{delivery.intro}</p>
          </div>
        </div>
      </section>

      <section className="terms-body" aria-label={delivery.title}>
        {delivery.sections.map(renderSection)}
        <section className="terms-section terms-contact">
          <h2>{delivery.contact.title}</h2>
          <div className="terms-section-content">
            <p>{delivery.contact.intro}</p>
            <address className="terms-contact-list">
              <span>
                <strong>{delivery.contact.emailLabel}:</strong>{" "}
                <a href="mailto:info@mirrai.com">info@mirrai.com</a>
              </span>
              <span>
                <strong>{delivery.contact.phoneLabel}:</strong>{" "}
                <a href="tel:+201144582331">+20 114 458 23331</a>
              </span>
              <span>
                <strong>{delivery.contact.addressLabel}:</strong> {delivery.contact.address}
              </span>
            </address>
          </div>
        </section>
      </section>

      <div className="homepage-finale-region terms-page-footer-region" style={{ "--hotels-card-overlap": "0px" } as CSSProperties}>
        <div className="homepage-finale-backdrop" aria-hidden />
        <HomepageFinale showCta={false} locale={locale} routeKey="delivery" />
      </div>
    </main>
  );
}
