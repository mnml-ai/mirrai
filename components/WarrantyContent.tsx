import type { CSSProperties } from "react";
import HomepageFinale from "@/components/HomepageFinale";
import LegalCompanyInfo from "@/components/LegalCompanyInfo";
import SiteNavbar from "@/components/SiteNavbar";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";

type WarrantySection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  secondaryBullets?: string[];
  listAfterParagraphCount?: number;
};

type WarrantyPageCopy = {
  kicker: string;
  title: string;
  updated: string;
  intro: string;
  sections: WarrantySection[];
  contact: {
    title: string;
    intro: string;
    emailLabel: string;
    phoneLabel: string;
    addressLabel: string;
    address: string;
  };
};

const WARRANTY_COPY: Record<Locale, WarrantyPageCopy> = {
  en: {
    kicker: "Warranty",
    title: "Warranty Policy",
    updated: "Last Updated: June 2026",
    intro:
      "At MIRRAI, we are committed to delivering high-quality products designed to provide a reliable and premium experience. This Warranty Policy outlines the warranty coverage and service conditions applicable to MIRRAI products.",
    sections: [
      {
        title: "1. Warranty Period",
        paragraphs: [
          "MIRRAI provides a limited 2-year warranty (24 months) starting from the date of delivery or installation.",
          "The warranty covers manufacturing defects and operational issues under normal residential use.",
        ],
      },
      {
        title: "2. What Is Covered?",
        paragraphs: [
          "The warranty covers:",
          "If a warranty claim is approved, MIRRAI may:",
        ],
        listAfterParagraphCount: 1,
        bullets: [
          "Manufacturing defects",
          "Technical or operational faults resulting from production issues",
          "Lighting or electronic component failures caused by manufacturing defects",
          "Issues resulting from installation performed by the MIRRAI team",
        ],
        secondaryBullets: [
          "Repair the product",
          "Replace the affected component",
          "Replace the full product when necessary based on technical evaluation",
        ],
      },
      {
        title: "3. TV Screens",
        paragraphs: [
          "Unless otherwise stated, MIRRAI product prices do not include the TV screen.",
          "After order confirmation:",
          "The TV is purchased specifically for the client after final approval of the selected model and pricing.",
          "TV screen warranties are provided by the TV manufacturer or authorized distributor and are not covered under the MIRRAI warranty policy.",
        ],
        listAfterParagraphCount: 2,
        bullets: [
          "If the client already owns a compatible TV, it may be delivered to the MIRRAI warehouse or collected through pickup service for additional fees depending on location and logistics requirements.",
          "If the client does not own a TV, a MIRRAI representative will contact the client to provide compatible TV model options, specifications, and pricing according to the selected mirror size and configuration.",
        ],
      },
      {
        title: "4. What Is Not Covered?",
        paragraphs: ["The warranty does not cover:"],
        bullets: [
          "Broken or cracked mirror glass after delivery or installation",
          "Misuse, negligence, or improper handling",
          "Commercial or unintended use",
          "Damage caused by accidents or physical impact",
          "Direct exposure to water or excessive humidity outside normal residential use",
          "Electrical instability or external electrical issues",
          "Unauthorized repairs, dismantling, or modifications",
          "Damage caused by improper cleaning materials or chemical products",
          "Damage resulting from transportation, relocation, or reinstallation handled by the client or third parties",
        ],
      },
      {
        title: "5. Warranty Conditions",
        paragraphs: ["To qualify for warranty service:"],
        bullets: [
          "The product must be used according to its intended purpose and operating instructions",
          "No unauthorized repairs or modifications may be performed",
          "Access to the product must be available for inspection or maintenance when required",
          "Proof of purchase or order confirmation may be requested",
        ],
      },
      {
        title: "6. Warranty & Maintenance Requests",
        paragraphs: [
          "To submit a warranty or maintenance request, clients should provide:",
          "All requests will be reviewed by the MIRRAI technical team to determine the appropriate solution.",
        ],
        bullets: [
          "Order number",
          "Photos or videos showing the issue",
          "A brief explanation of the problem",
        ],
      },
      {
        title: "7. Service & Transportation Fees",
        paragraphs: [
          "Additional charges may apply in certain cases, including:",
          "Any applicable fees will be communicated before service is performed.",
        ],
        bullets: [
          "Site visits outside standard coverage areas",
          "Product dismantling or reinstallation requests",
          "Transportation or shipping related to maintenance or service",
          "Cases not covered under warranty",
        ],
      },
      {
        title: "8. Limitation of Liability",
        paragraphs: [
          "The warranty is limited to repair or replacement of defective components only.",
          "MIRRAI shall not be liable for indirect damages, losses, or issues resulting from misuse, improper handling, or conditions outside warranty coverage.",
        ],
      },
    ],
    contact: {
      title: "9. Contact Information",
      intro: "For warranty or maintenance inquiries, please contact:",
      emailLabel: "Email",
      phoneLabel: "Phone",
      addressLabel: "Address",
      address: "5th Settlement, Cairo, Egypt",
    },
  },
  ar: {
    kicker: "الضمان",
    title: "سياسة الضمان",
    updated: "آخر تحديث: يونيو 2026",
    intro:
      "في MIRRAI، نحرص على تقديم منتجات عالية الجودة مصممة لتوفير تجربة استخدام موثوقة وعملية. وتوضح سياسة الضمان التالية حدود التغطية والخدمات المتعلقة بمنتجات MIRRAI.",
    sections: [
      {
        title: "1. مدة الضمان",
        paragraphs: [
          "توفر MIRRAI ضمانًا محدودًا لمدة سنتين (24 شهرًا) يبدأ من تاريخ الاستلام أو التركيب.",
          "ويغطي الضمان عيوب التصنيع والأعطال التشغيلية الناتجة عن الاستخدام المنزلي الطبيعي.",
        ],
      },
      {
        title: "2. ما الذي يشمله الضمان؟",
        paragraphs: [
          "يشمل الضمان:",
          "وفي حال اعتماد حالة الضمان، يحق لـ MIRRAI:",
        ],
        listAfterParagraphCount: 1,
        bullets: [
          "عيوب التصنيع",
          "الأعطال التقنية أو التشغيلية الناتجة عن التصنيع",
          "مشاكل الإضاءة أو المكونات الإلكترونية الناتجة عن عيوب تشغيلية",
          "الأعطال الناتجة عن التركيب الذي يتم بواسطة فريق MIRRAI",
        ],
        secondaryBullets: [
          "إصلاح المنتج",
          "استبدال الجزء المتضرر",
          "أو استبدال المنتج بالكامل حسب تقييم الفريق الفني",
        ],
      },
      {
        title: "3. شاشات التلفزيون (TV)",
        paragraphs: [
          "ما لم يتم توضيح خلاف ذلك، فإن أسعار منتجات MIRRAI لا تشمل شاشة التلفزيون.",
          "بعد تأكيد الطلب:",
          "ويتم شراء الشاشة خصيصًا للعميل بعد الموافقة النهائية على النوع والسعر.",
          "ويخضع ضمان شاشة التلفزيون لسياسة ضمان الشركة المصنعة أو الوكيل المعتمد، ولا يدخل ضمن ضمان MIRRAI.",
        ],
        listAfterParagraphCount: 2,
        bullets: [
          "في حال امتلاك العميل لشاشة متوافقة، يمكن تسليمها إلى مقر MIRRAI أو طلب خدمة الاستلام مقابل رسوم إضافية حسب الموقع ومتطلبات النقل.",
          "في حال عدم توفر شاشة لدى العميل، سيقوم أحد ممثلي MIRRAI بالتواصل لتقديم خيارات الشاشات المتوافقة، والمواصفات، والأسعار المناسبة حسب مقاس وتصميم المرآة المختار.",
        ],
      },
      {
        title: "4. ما الذي لا يشمله الضمان؟",
        paragraphs: ["لا يشمل الضمان الحالات التالية:"],
        bullets: [
          "كسر أو شرخ زجاج المرايا بعد التركيب أو التسليم",
          "سوء الاستخدام أو الإهمال أو التعامل غير الصحيح مع المنتج",
          "الاستخدام التجاري أو غير المخصص للمنتج",
          "الأضرار الناتجة عن الحوادث أو الصدمات",
          "التعرض المباشر للمياه أو الرطوبة الزائدة خارج الاستخدام الطبيعي",
          "مشاكل الكهرباء أو عدم استقرار التيار الكهربائي",
          "أي تعديل أو فك أو إصلاح يتم بواسطة جهة غير معتمدة من MIRRAI",
          "التلف الناتج عن مواد تنظيف أو مواد كيميائية غير مناسبة",
          "الأضرار الناتجة عن النقل أو الفك أو إعادة التركيب من قبل العميل أو أي طرف خارجي",
        ],
      },
      {
        title: "5. شروط الضمان",
        paragraphs: ["يشترط للاستفادة من الضمان:"],
        bullets: [
          "استخدام المنتج بطريقة صحيحة ووفق تعليمات التشغيل",
          "عدم إجراء أي تعديلات أو إصلاحات غير معتمدة",
          "توفير إمكانية الوصول للمنتج عند الحاجة للفحص أو الصيانة",
          "تقديم ما يثبت الطلب أو عملية الشراء عند طلب الخدمة",
        ],
      },
      {
        title: "6. طلبات الصيانة أو الضمان",
        paragraphs: [
          "في حال وجود مشكلة مشمولة بالضمان، يرجى التواصل مع فريق MIRRAI مع توضيح:",
          "وسيتم مراجعة الطلب من قبل الفريق الفني لتحديد الإجراء المناسب.",
        ],
        bullets: [
          "رقم الطلب",
          "صور أو فيديو للمشكلة",
          "شرح مختصر للحالة",
        ],
      },
      {
        title: "7. رسوم الخدمة أو النقل",
        paragraphs: [
          "قد يتم تطبيق رسوم إضافية في بعض الحالات، مثل:",
          "وسيتم توضيح أي رسوم قبل تنفيذ الخدمة.",
        ],
        bullets: [
          "المعاينات خارج نطاق التغطية المعتاد",
          "طلبات الفك أو إعادة التركيب",
          "النقل أو الشحن المرتبط بأعمال الصيانة أو الخدمة",
          "الحالات غير المشمولة بالضمان",
        ],
      },
      {
        title: "8. تحديد المسؤولية",
        paragraphs: [
          "يقتصر الضمان على إصلاح أو استبدال الأجزاء المتضررة فقط.",
          "ولا تتحمل MIRRAI أي مسؤولية عن الأضرار غير المباشرة أو أي خسائر ناتجة عن سوء الاستخدام أو الأعطال الخارجة عن نطاق الضمان.",
        ],
      },
    ],
    contact: {
      title: "9. معلومات التواصل",
      intro: "لأي استفسارات تتعلق بالضمان أو الصيانة، يمكنكم التواصل معنا عبر:",
      emailLabel: "البريد الإلكتروني",
      phoneLabel: "رقم الهاتف",
      addressLabel: "العنوان",
      address: "التجمع الخامس، القاهرة، مصر",
    },
  },
};

type WarrantyPageContentProps = {
  locale?: Locale;
};

function renderSection(section: WarrantySection) {
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
        {section.secondaryBullets ? (
          <ul className="terms-list">
            {section.secondaryBullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

export function WarrantyPageContent({ locale = DEFAULT_LOCALE }: WarrantyPageContentProps) {
  const warranty = WARRANTY_COPY[locale];

  return (
    <main className="terms-page warranty-page">
      <SiteNavbar />

      <section className="terms-hero" aria-labelledby="warranty-page-title">
        <div className="terms-hero-inner">
          <p className="terms-kicker">{warranty.kicker}</p>
          <h1 id="warranty-page-title">{warranty.title}</h1>
          <p className="terms-updated">{warranty.updated}</p>
          <div className="terms-intro">
            <p>{warranty.intro}</p>
          </div>
        </div>
      </section>

      <section className="terms-body" aria-label={warranty.title}>
        {warranty.sections.map(renderSection)}
        <section className="terms-section terms-contact">
          <h2>{warranty.contact.title}</h2>
          <div className="terms-section-content">
            <p>{warranty.contact.intro}</p>
            <address className="terms-contact-list">
              <span>
                <strong>{warranty.contact.emailLabel}:</strong>{" "}
                <a href="mailto:mirrai@odxstudio.com">mirrai@odxstudio.com</a>
              </span>
              <span>
                <strong>{warranty.contact.phoneLabel}:</strong>{" "}
                <a href="tel:+201228674700">+20 122 867 4700</a>
              </span>
              <span>
                <strong>{warranty.contact.addressLabel}:</strong> {warranty.contact.address}
              </span>
            </address>
            <LegalCompanyInfo />
          </div>
        </section>
      </section>

      <div className="homepage-finale-region terms-page-footer-region" style={{ "--hotels-card-overlap": "0px" } as CSSProperties}>
        <div className="homepage-finale-backdrop" aria-hidden />
        <HomepageFinale showCta={false} locale={locale} routeKey="warranty" />
      </div>
    </main>
  );
}
