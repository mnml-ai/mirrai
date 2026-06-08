import type { CSSProperties } from "react";
import HomepageFinale from "@/components/HomepageFinale";
import LegalCompanyInfo from "@/components/LegalCompanyInfo";
import SiteNavbar from "@/components/SiteNavbar";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";

type TermsSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  listAfterParagraphCount?: number;
};

type TermsPageCopy = {
  kicker: string;
  title: string;
  updated: string;
  intro: string[];
  sections: TermsSection[];
  contact: {
    title: string;
    intro: string;
    emailLabel: string;
    phoneLabel: string;
    addressLabel: string;
    address: string;
  };
};

const TERMS_COPY: Record<Locale, TermsPageCopy> = {
  en: {
    kicker: "Legal",
    title: "Terms & Conditions",
    updated: "Last Updated: June 2026",
    intro: [
      "Welcome to MIRRAI.",
      "These Terms & Conditions govern your use of the MIRRAI website, products, services, and purchases. By accessing our website or placing an order, you agree to the terms below.",
    ],
    sections: [
      {
        title: "1. General Information",
        paragraphs: [
          "MIRRAI designs and manufactures smart mirrors, custom interior products, and integrated technology solutions.",
          "Certain products are made-to-order and may be customized based on the client’s selected specifications, dimensions, finishes, or technical requirements.",
        ],
      },
      {
        title: "2. Products & Custom Orders",
        paragraphs: [
          "Due to the nature of our products:",
          "Clients are responsible for reviewing all product dimensions, specifications, installation requirements, and ensuring the product can be properly transported and moved into the installation location before confirming the order.",
        ],
        bullets: [
          "Product dimensions, finishes, colors, materials, and displayed visuals may slightly vary from website images or conceptual product visuals.",
          "Some products are manufactured only after order confirmation and payment approval.",
          "Custom-made products may require additional production time.",
          "MIRRAI reserves the right to reject or cancel requests that are technically unfeasible or outside production capabilities.",
        ],
      },
      {
        title: "3. Pricing",
        paragraphs: [
          "All prices displayed on the website are subject to change without prior notice.",
          "Prices may:",
          "Final pricing for customized products may be confirmed through direct communication, quotations, or payment links before order confirmation.",
        ],
        listAfterParagraphCount: 2,
        bullets: [
          "Include or exclude delivery and installation depending on the product type or delivery location.",
          "Differ for custom requests, project-based orders, or special finishes.",
          "Be adjusted due to material cost fluctuations or technical modifications.",
        ],
      },
      {
        title: "TV Pricing & Supply",
        paragraphs: [
          "Unless explicitly stated otherwise, MIRRAI product prices do not include the TV screen.",
          "After order confirmation:",
          "The TV screen is purchased specifically for the client after final approval of the selected model and pricing, and its cost is charged separately from the main product price.",
        ],
        listAfterParagraphCount: 2,
        bullets: [
          "If the client already owns a compatible TV, it may be delivered to the MIRRAI warehouse or collected through pickup service for additional fees depending on location and logistics requirements.",
          "If the client does not own a TV, a MIRRAI representative will contact the client to provide compatible TV model options, specifications, and pricing according to the selected mirror size and configuration.",
        ],
      },
      {
        title: "4. Payments",
        paragraphs: [
          "Orders may be paid through:",
          "Installment payments or third-party financing services may be subject to additional processing or service fees depending on the selected payment provider.",
          "Orders are only considered confirmed after payment approval or official confirmation from MIRRAI.",
        ],
        bullets: [
          "Online payment gateways",
          "Bank transfer",
          "Payment links",
          "Cash upon agreement for selected orders",
        ],
      },
      {
        title: "5. Production & Delivery Time",
        paragraphs: [
          "Estimated production and delivery timelines are provided as guidance only and may vary depending on order complexity and workload.",
          "Delays may occur due to:",
          "MIRRAI will make reasonable efforts to communicate any major delays when applicable.",
        ],
        listAfterParagraphCount: 2,
        bullets: [
          "Custom manufacturing requirements",
          "Material availability",
          "Shipping or logistics providers",
          "Technical or operational circumstances outside MIRRAI’s control",
        ],
      },
      {
        title: "6. Installation",
        paragraphs: ["For products requiring installation:"],
        bullets: [
          "Clients must ensure site readiness before the installation appointment.",
          "Delays caused by incomplete site conditions, missing electrical preparation, restricted access, unfinished interiors, or inability to move the product into the installation location may result in installation rescheduling and additional service fees.",
          "Electrical preparation, wall readiness, and structural compatibility remain the client’s responsibility unless otherwise agreed.",
        ],
      },
      {
        title: "7. Warranty & Product Usage",
        paragraphs: [
          "MIRRAI products include a limited 2-year warranty covering manufacturing defects under normal residential use.",
          "Warranty coverage does not apply to:",
          "Products must be used according to their intended purpose and operating guidelines.",
        ],
        listAfterParagraphCount: 2,
        bullets: [
          "Misuse or improper installation",
          "Physical damage after delivery",
          "Mirror glass breakage or cracks after installation or handover",
          "Unauthorized modifications or repairs",
          "Damage caused by water, humidity, electrical instability, misuse, or improper maintenance",
        ],
      },
      {
        title: "8. Intellectual Property",
        paragraphs: [
          "All website content, branding, product concepts, visuals, logos, designs, renders, and media are the intellectual property of MIRRAI and may not be copied, reproduced, distributed, or used without prior written permission.",
        ],
      },
      {
        title: "9. Limitation of Liability",
        paragraphs: ["MIRRAI shall not be held liable for:"],
        bullets: [
          "Indirect or consequential damages",
          "Delays outside reasonable operational control",
          "Third-party transportation or installation issues",
          "Minor visual differences between website visuals and final products",
        ],
      },
      {
        title: "10. Privacy",
        paragraphs: [
          "Client information submitted through the website, forms, or checkout process is handled according to the MIRRAI Privacy Policy.",
        ],
      },
      {
        title: "11. Modifications",
        paragraphs: [
          "MIRRAI reserves the right to update or modify these Terms & Conditions at any time without prior notice.",
        ],
      },
    ],
    contact: {
      title: "12. Contact Information",
      intro: "For inquiries regarding these Terms & Conditions, please contact:",
      emailLabel: "Email",
      phoneLabel: "Phone",
      addressLabel: "Address",
      address: "5th Settlement, Cairo, Egypt",
    },
  },
  ar: {
    kicker: "قانوني",
    title: "الشروط والأحكام",
    updated: "آخر تحديث: يونيو 2026",
    intro: [
      "مرحبًا بكم في MIRRAI.",
      "باستخدامكم لموقع MIRRAI الإلكتروني أو إتمام أي طلب شراء، فإنكم توافقون على الشروط والأحكام التالية، والتي تنظم استخدام الموقع والخدمات والمنتجات المقدمة من خلاله.",
    ],
    sections: [
      {
        title: "1. معلومات عامة",
        paragraphs: [
          "تقوم MIRRAI بتصميم وتصنيع المرايا الذكية، والمنتجات الداخلية المفصلة حسب الطلب، والحلول التكنولوجية المتكاملة.",
          "يتم تصنيع بعض المنتجات خصيصًا حسب الطلب (Made-to-order)، مع إمكانية تخصيص المقاسات، والتشطيبات، والمواصفات الفنية وفقًا لاختيار العميل.",
        ],
      },
      {
        title: "2. المنتجات والطلبات الخاصة",
        paragraphs: [
          "نظرًا لطبيعة منتجات MIRRAI، قد توجد فروقات بسيطة بين الصور المعروضة أو الصور التخيلية للمنتجات وبين المنتج النهائي، سواء في الألوان أو الخامات أو بعض التفاصيل البصرية.",
          "يتم البدء في تصنيع بعض المنتجات فقط بعد تأكيد الطلب واعتماد عملية الدفع، كما قد تتطلب المنتجات المصنوعة حسب الطلب وقتًا إضافيًا للإنتاج حسب طبيعة الطلب.",
          "وتحتفظ MIRRAI بحق رفض أو إلغاء أي طلبات غير قابلة للتنفيذ فنيًا أو التي تقع خارج نطاق الإمكانيات التشغيلية والإنتاجية للشركة.",
          "تنبيه هام: يتحمل العميل المسؤولية الكاملة عن مراجعة جميع أبعاد المنتج، والمواصفات الفنية، ومتطلبات التركيب، بالإضافة إلى التأكد من إمكانية شحن ونقل وإدخال المنتج إلى موقع التركيب قبل تأكيد الطلب.",
        ],
      },
      {
        title: "3. الأسعار",
        paragraphs: [
          "جميع الأسعار المعروضة على الموقع الإلكتروني قابلة للتعديل أو التحديث دون إشعار مسبق.",
          "وقد تشمل الأسعار أو لا تشمل خدمات التوصيل والتركيب، وذلك حسب نوع المنتج أو منطقة الطلب.",
          "كما قد تختلف الأسعار في حالة الطلبات الخاصة، أو المشاريع، أو التشطيبات المميزة، وقد تتغير نتيجة لتقلبات أسعار الخامات أو أي تعديلات فنية مطلوبة.",
          "ويتم تأكيد السعر النهائي للمنتجات المصنوعة حسب الطلب من خلال التواصل المباشر، أو عروض الأسعار الرسمية، أو روابط الدفع المخصصة قبل اعتماد الطلب بشكل نهائي.",
        ],
      },
      {
        title: "شاشات التلفزيون والأسعار",
        paragraphs: [
          "ما لم يتم توضيح خلاف ذلك، فإن أسعار منتجات MIRRAI لا تشمل شاشة التلفزيون.",
          "بعد تأكيد الطلب:",
          "ويتم شراء الشاشة خصيصًا للعميل بعد الموافقة النهائية على النوع والسعر، ويتم احتساب تكلفتها بشكل منفصل عن سعر المنتج الأساسي.",
        ],
        listAfterParagraphCount: 2,
        bullets: [
          "في حال امتلاك العميل لشاشة متوافقة، يمكن تسليمها إلى مقر MIRRAI أو طلب خدمة الاستلام مقابل رسوم إضافية حسب الموقع ومتطلبات النقل.",
          "في حال عدم توفر شاشة لدى العميل، سيقوم أحد ممثلي MIRRAI بالتواصل لتقديم خيارات الشاشات المتوافقة، والمواصفات، والأسعار المناسبة حسب مقاس وتصميم المرآة المختار.",
        ],
      },
      {
        title: "4. سياسة الدفع",
        paragraphs: [
          "يمكن سداد قيمة الطلبات من خلال الوسائل التالية:",
          "قد تخضع خدمات التقسيط أو أنظمة التمويل المقدمة من خلال جهات خارجية إلى رسوم إدارية أو رسوم خدمة إضافية يتم تحديدها من قبل مزود الخدمة.",
          "ولا يعتبر الطلب مؤكدًا أو جاهزًا للتنفيذ إلا بعد اعتماد عملية الدفع أو استلام تأكيد رسمي من MIRRAI.",
        ],
        bullets: [
          "بوابات الدفع الإلكتروني",
          "التحويلات البنكية",
          "روابط الدفع الإلكترونية",
          "الدفع النقدي لبعض الطلبات المتفق عليها",
        ],
      },
      {
        title: "5. مدة الإنتاج والتوصيل",
        paragraphs: [
          "تعتبر المدد الزمنية الخاصة بالإنتاج أو التوصيل تقديرية فقط، وقد تختلف حسب طبيعة الطلب وحجم الأعمال الحالية.",
          "وقد يحدث تأخير بسبب:",
          "وتلتزم MIRRAI ببذل الجهود المعقولة لإبلاغ العميل بأي تأخير جوهري فور توفر التحديثات.",
        ],
        listAfterParagraphCount: 2,
        bullets: [
          "متطلبات التصنيع حسب الطلب",
          "تأخر أو عدم توفر بعض الخامات",
          "ظروف الشحن أو شركات الخدمات اللوجستية",
          "أي ظروف تقنية، قهرية، أو تشغيلية خارجة عن إرادة MIRRAI",
        ],
      },
      {
        title: "6. أعمال التركيب",
        paragraphs: [
          "بالنسبة للمنتجات التي تتطلب خدمة تركيب، يجب على العميل التأكد من جاهزية الموقع بالكامل قبل موعد التركيب المحدد.",
          "وأي تأخير ناتج عن عدم جاهزية الموقع، أو غياب التجهيزات الكهربائية المطلوبة، أو صعوبة الوصول، أو عدم اكتمال أعمال التشطيبات، أو عدم القدرة على إدخال المنتج إلى موقع التركيب؛ قد يؤدي إلى إعادة جدولة الموعد مع تطبيق رسوم خدمة إضافية عند الحاجة.",
          "كما تظل تجهيزات الكهرباء، وجاهزية الحوائط، والتوافق الإنشائي للموقع من مسؤولية العميل ما لم يتم الاتفاق كتابيًا على غير ذلك.",
        ],
      },
      {
        title: "7. الضمان وسياسة الاستخدام",
        paragraphs: [
          "تتضمن منتجات MIRRAI ضمانًا محدودًا لمدة سنتين ضد عيوب التصنيع، وذلك في حالات الاستخدام المنزلي الطبيعي.",
          "ولا يشمل الضمان:",
          "ويجب استخدام المنتجات وفقًا للغرض المخصص لها واتباع تعليمات التشغيل والصيانة المرفقة.",
        ],
        listAfterParagraphCount: 2,
        bullets: [
          "سوء الاستخدام أو التركيب غير الصحيح",
          "الأضرار أو التلفيات الناتجة بعد الاستلام",
          "كسر أو شرخ زجاج المرايا بعد التركيب أو التسليم",
          "أي تعديلات أو إصلاحات غير معتمدة",
          "الأضرار الناتجة عن المياه، أو الرطوبة الزائدة، أو عدم استقرار التيار الكهربائي، أو سوء الصيانة والاستخدام",
        ],
      },
      {
        title: "8. الملكية الفكرية",
        paragraphs: [
          "جميع محتويات الموقع الإلكتروني، بما في ذلك العلامة التجارية، والتصاميم، والرندرات، والمواد البصرية، والشعارات، والوسائط، والمفاهيم التصميمية الخاصة بالمنتجات؛ هي ملكية فكرية حصرية لـ MIRRAI.",
          "ويُحظر نسخ أو إعادة استخدام أو توزيع أي جزء من هذه المواد بأي شكل دون الحصول على موافقة كتابية مسبقة.",
        ],
      },
      {
        title: "9. تحديد المسؤولية",
        paragraphs: ["لا تتحمل MIRRAI أي مسؤولية قانونية عن:"],
        bullets: [
          "الأضرار غير المباشرة أو التبعية الناتجة عن استخدام المنتجات",
          "التأخيرات الخارجة عن السيطرة التشغيلية المعقولة للشركة",
          "المشاكل أو التلفيات الناتجة عن شركات الشحن أو خدمات التركيب الخارجية",
          "الفروقات البصرية الطفيفة والطبيعية بين الصور المعروضة والمنتج النهائي",
        ],
      },
      {
        title: "10. سياسة الخصوصية",
        paragraphs: [
          "يتم التعامل مع كافة بيانات ومعلومات العملاء المقدمة عبر الموقع أو أثناء عملية الطلب والدفع بسرية تامة، وذلك وفقًا لسياسة الخصوصية الخاصة بـ MIRRAI.",
        ],
      },
      {
        title: "11. التعديلات والتحديثات",
        paragraphs: [
          "تحتفظ MIRRAI بالحق الكامل في تعديل أو تحديث هذه الشروط والأحكام في أي وقت دون إشعار مسبق، وتصبح التعديلات سارية فور نشرها على الموقع.",
        ],
      },
    ],
    contact: {
      title: "12. معلومات التواصل",
      intro: "لأي استفسارات أو أسئلة بخصوص الشروط والأحكام، يمكنكم التواصل معنا عبر:",
      emailLabel: "البريد الإلكتروني",
      phoneLabel: "رقم الهاتف",
      addressLabel: "العنوان",
      address: "التجمع الخامس، القاهرة، مصر",
    },
  },
};

type TermsPageContentProps = {
  locale?: Locale;
};

function renderSection(section: TermsSection) {
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

export function TermsPageContent({ locale = DEFAULT_LOCALE }: TermsPageContentProps) {
  const terms = TERMS_COPY[locale];

  return (
    <main className="terms-page">
      <SiteNavbar />

      <section className="terms-hero" aria-labelledby="terms-page-title">
        <div className="terms-hero-inner">
          <p className="terms-kicker">{terms.kicker}</p>
          <h1 id="terms-page-title">{terms.title}</h1>
          <p className="terms-updated">{terms.updated}</p>
          <div className="terms-intro">
            {terms.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="terms-body" aria-label={terms.title}>
        {terms.sections.map(renderSection)}
        <section className="terms-section terms-contact">
          <h2>{terms.contact.title}</h2>
          <div className="terms-section-content">
            <p>{terms.contact.intro}</p>
            <address className="terms-contact-list">
              <span>
                <strong>{terms.contact.emailLabel}:</strong>{" "}
                <a href="mailto:mirrai@odxstudio.com">mirrai@odxstudio.com</a>
              </span>
              <span>
                <strong>{terms.contact.phoneLabel}:</strong>{" "}
                <a href="tel:+201228674700">+20 122 867 4700</a>
              </span>
              <span>
                <strong>{terms.contact.addressLabel}:</strong> {terms.contact.address}
              </span>
            </address>
            <LegalCompanyInfo />
          </div>
        </section>
      </section>

      <div className="homepage-finale-region terms-page-footer-region" style={{ "--hotels-card-overlap": "0px" } as CSSProperties}>
        <div className="homepage-finale-backdrop" aria-hidden />
        <HomepageFinale showCta={false} locale={locale} routeKey="terms" />
      </div>
    </main>
  );
}
