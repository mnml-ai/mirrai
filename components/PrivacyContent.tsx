import type { CSSProperties } from "react";
import HomepageFinale from "@/components/HomepageFinale";
import LegalCompanyInfo from "@/components/LegalCompanyInfo";
import SiteNavbar from "@/components/SiteNavbar";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";

type PrivacySection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  listAfterParagraphCount?: number;
};

type PrivacyPageCopy = {
  kicker: string;
  title: string;
  updated: string;
  intro: string;
  sections: PrivacySection[];
  contact: {
    title: string;
    intro: string;
    emailLabel: string;
    phoneLabel: string;
    addressLabel: string;
    address: string;
  };
};

const PRIVACY_COPY: Record<Locale, PrivacyPageCopy> = {
  en: {
    kicker: "Privacy",
    title: "Privacy Policy",
    updated: "Last Updated: June 2026",
    intro:
      "At MIRRAI, we respect your privacy and are committed to protecting the personal information you share with us when using our website, contacting us, or purchasing our products and services.",
    sections: [
      {
        title: "1. Information We Collect",
        paragraphs: ["We may collect the following information:"],
        bullets: [
          "Name",
          "Phone number",
          "Email address",
          "Delivery or installation address",
          "Order and product information",
          "Information submitted through contact forms, WhatsApp conversations, or email communications",
        ],
      },
      {
        title: "2. How We Use Your Information",
        paragraphs: ["Your information may be used to:"],
        bullets: [
          "Process and fulfill orders",
          "Respond to inquiries and customer requests",
          "Schedule delivery and installation services",
          "Issue quotations and invoices",
          "Improve our products, services, and website experience",
          "Provide updates related to your order when necessary",
        ],
      },
      {
        title: "3. Sharing of Information",
        paragraphs: [
          "MIRRAI does not sell, rent, or share personal information with third parties for marketing purposes.",
          "Information may be shared when necessary with:",
          "Only the minimum information required to perform these services will be shared.",
        ],
        listAfterParagraphCount: 2,
        bullets: [
          "Payment service providers",
          "Shipping and logistics providers",
          "Technology platforms and systems used to manage orders and customer services",
        ],
      },
      {
        title: "4. Data Protection",
        paragraphs: [
          "We implement reasonable technical and organizational measures to protect personal information from unauthorized access, misuse, alteration, or disclosure.",
          "However, no online transmission or storage system can be guaranteed to be completely secure.",
        ],
      },
      {
        title: "5. Cookies",
        paragraphs: [
          "Our website may use cookies and similar technologies to improve website functionality, analyze traffic, and enhance user experience.",
          "Users may control cookie settings through their browser preferences.",
        ],
      },
      {
        title: "6. Data Retention",
        paragraphs: [
          "Personal information is retained only for as long as necessary to provide services, fulfill orders, and comply with legal or operational requirements.",
        ],
      },
      {
        title: "7. Your Rights",
        paragraphs: ["You may request to:"],
        bullets: [
          "Access your personal information",
          "Correct or update your information",
          "Request deletion of your information where legally permitted",
          "Opt out of marketing communications at any time",
        ],
      },
      {
        title: "8. Changes to This Policy",
        paragraphs: [
          "MIRRAI reserves the right to update or modify this Privacy Policy at any time. Changes become effective once published on the website.",
        ],
      },
    ],
    contact: {
      title: "9. Contact Us",
      intro: "For any questions regarding this Privacy Policy or your personal information, please contact:",
      emailLabel: "Email",
      phoneLabel: "Phone",
      addressLabel: "Address",
      address: "5th Settlement, Cairo, Egypt",
    },
  },
  ar: {
    kicker: "الخصوصية",
    title: "سياسة الخصوصية",
    updated: "آخر تحديث: يونيو 2026",
    intro:
      "في MIRRAI، نحترم خصوصية عملائنا ونلتزم بحماية المعلومات الشخصية التي يتم مشاركتها معنا عند استخدام الموقع أو التواصل معنا أو إتمام عمليات الشراء.",
    sections: [
      {
        title: "1. المعلومات التي نجمعها",
        paragraphs: ["قد نقوم بجمع بعض المعلومات الشخصية عند استخدام الموقع أو تقديم طلب، وتشمل:"],
        bullets: [
          "الاسم",
          "رقم الهاتف",
          "البريد الإلكتروني",
          "عنوان التوصيل أو التركيب",
          "معلومات الطلبات والمنتجات المطلوبة",
          "أي معلومات يتم مشاركتها عبر نماذج التواصل أو الواتساب أو البريد الإلكتروني",
        ],
      },
      {
        title: "2. كيفية استخدام المعلومات",
        paragraphs: ["يتم استخدام المعلومات التي نجمعها من أجل:"],
        bullets: [
          "معالجة الطلبات وتنفيذها",
          "التواصل مع العملاء بخصوص الطلبات أو الاستفسارات",
          "جدولة التوصيل أو التركيب",
          "إصدار عروض الأسعار والفواتير",
          "تحسين تجربة المستخدم والخدمات المقدمة",
          "إرسال التحديثات المتعلقة بالطلبات عند الحاجة",
        ],
      },
      {
        title: "3. مشاركة المعلومات",
        paragraphs: [
          "لا تقوم MIRRAI ببيع أو تأجير أو مشاركة المعلومات الشخصية مع أي طرف ثالث لأغراض تسويقية.",
          "قد يتم مشاركة بعض البيانات عند الضرورة مع:",
          "وذلك فقط بالقدر اللازم لإتمام الخدمة المطلوبة.",
        ],
        listAfterParagraphCount: 2,
        bullets: [
          "مزودي خدمات الدفع",
          "شركات الشحن أو التوصيل",
          "الجهات أو الأنظمة التقنية المستخدمة لإدارة الطلبات والخدمات",
        ],
      },
      {
        title: "4. حماية البيانات",
        paragraphs: [
          "نتخذ الإجراءات التقنية والإدارية المناسبة لحماية المعلومات الشخصية من الوصول غير المصرح به أو الاستخدام أو التعديل أو الإفصاح غير المصرح به.",
          "ومع ذلك، لا يمكن ضمان الحماية الكاملة لأي عملية نقل بيانات عبر الإنترنت.",
        ],
      },
      {
        title: "5. ملفات تعريف الارتباط (Cookies)",
        paragraphs: [
          "قد يستخدم الموقع ملفات تعريف الارتباط وتقنيات مشابهة لتحسين تجربة التصفح وتحليل أداء الموقع وتطوير الخدمات المقدمة.",
          "يمكن للمستخدم التحكم في إعدادات ملفات تعريف الارتباط من خلال متصفح الإنترنت الخاص به.",
        ],
      },
      {
        title: "6. الاحتفاظ بالبيانات",
        paragraphs: [
          "نحتفظ بالمعلومات الشخصية للفترة اللازمة لتقديم الخدمات وتنفيذ الطلبات والوفاء بالمتطلبات القانونية أو التشغيلية عند الحاجة.",
        ],
      },
      {
        title: "7. حقوق المستخدم",
        paragraphs: ["يمكن للمستخدم طلب:"],
        bullets: [
          "الاطلاع على بياناته الشخصية",
          "تحديث أو تصحيح البيانات",
          "حذف البيانات متى كان ذلك ممكنًا قانونيًا",
          "إيقاف الرسائل التسويقية في أي وقت",
        ],
      },
      {
        title: "8. التعديلات على سياسة الخصوصية",
        paragraphs: [
          "تحتفظ MIRRAI بحق تعديل أو تحديث هذه السياسة في أي وقت، وتصبح التعديلات سارية فور نشرها على الموقع.",
        ],
      },
    ],
    contact: {
      title: "9. التواصل معنا",
      intro: "في حال وجود أي استفسار يتعلق بسياسة الخصوصية أو البيانات الشخصية، يمكن التواصل معنا عبر:",
      emailLabel: "البريد الإلكتروني",
      phoneLabel: "رقم الهاتف",
      addressLabel: "العنوان",
      address: "التجمع الخامس، القاهرة، مصر",
    },
  },
};

type PrivacyPageContentProps = {
  locale?: Locale;
};

function renderSection(section: PrivacySection) {
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

export function PrivacyPageContent({ locale = DEFAULT_LOCALE }: PrivacyPageContentProps) {
  const privacy = PRIVACY_COPY[locale];

  return (
    <main className="terms-page privacy-page">
      <SiteNavbar />

      <section className="terms-hero" aria-labelledby="privacy-page-title">
        <div className="terms-hero-inner">
          <p className="terms-kicker">{privacy.kicker}</p>
          <h1 id="privacy-page-title">{privacy.title}</h1>
          <p className="terms-updated">{privacy.updated}</p>
          <div className="terms-intro">
            <p>{privacy.intro}</p>
          </div>
        </div>
      </section>

      <section className="terms-body" aria-label={privacy.title}>
        {privacy.sections.map(renderSection)}
        <section className="terms-section terms-contact">
          <h2>{privacy.contact.title}</h2>
          <div className="terms-section-content">
            <p>{privacy.contact.intro}</p>
            <address className="terms-contact-list">
              <span>
                <strong>{privacy.contact.emailLabel}:</strong>{" "}
                <a href="mailto:mirrai@odxstudio.com">mirrai@odxstudio.com</a>
              </span>
              <span>
                <strong>{privacy.contact.phoneLabel}:</strong>{" "}
                <a href="tel:+201228674700">+20 122 867 4700</a>
              </span>
              <span>
                <strong>{privacy.contact.addressLabel}:</strong> {privacy.contact.address}
              </span>
            </address>
            <LegalCompanyInfo />
          </div>
        </section>
      </section>

      <div className="homepage-finale-region terms-page-footer-region" style={{ "--hotels-card-overlap": "0px" } as CSSProperties}>
        <div className="homepage-finale-backdrop" aria-hidden />
        <HomepageFinale showCta={false} locale={locale} routeKey="privacy" />
      </div>
    </main>
  );
}
