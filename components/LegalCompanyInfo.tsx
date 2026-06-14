import { DEFAULT_LOCALE, getDictionary, type Locale } from "@/lib/i18n";
import { INFO_EMAIL_DISPLAY } from "@/lib/emails";

type LegalCompanyInfoProps = {
  variant?: "contact" | "legal";
  locale?: Locale;
};

export const ODX_LEGAL_LINE = "MIRRAI by ODX Studio - Tax ID / VAT: 769-598-773";

function ContactCompanyInfo({ locale }: { locale: Locale }) {
  const companyInfo = getDictionary(locale).contactPage.companyInfo;

  return (
    <div className="legal-company-info legal-company-info--contact">
      <p>{companyInfo.intro}</p>
      <dl>
        <div>
          <dt>{companyInfo.companyLabel}</dt>
          <dd>{companyInfo.companyValue}</dd>
        </div>
        <div>
          <dt>{companyInfo.vatLabel}</dt>
          <dd>{companyInfo.vatValue}</dd>
        </div>
        <div>
          <dt>{companyInfo.tradeNumberLabel}</dt>
          <dd>{companyInfo.tradeNumberValue}</dd>
        </div>
        <div>
          <dt>{companyInfo.registeredAddressLabel}</dt>
          <dd>{companyInfo.registeredAddressValue}</dd>
        </div>
        <div>
          <dt>{companyInfo.phoneLabel}</dt>
          <dd>
            <a href={`tel:${companyInfo.phoneValue}`}>{companyInfo.phoneValue}</a>
          </dd>
        </div>
        <div>
          <dt>{companyInfo.emailLabel}</dt>
          <dd>
            <a href={`mailto:${companyInfo.emailValue}`}>{INFO_EMAIL_DISPLAY}</a>
          </dd>
        </div>
      </dl>
    </div>
  );
}

export default function LegalCompanyInfo({
  variant = "legal",
  locale = DEFAULT_LOCALE,
}: LegalCompanyInfoProps) {
  if (variant === "contact") {
    return <ContactCompanyInfo locale={locale} />;
  }

  return (
    <div className={`legal-company-info legal-company-info--${variant}`}>
      <p>MIRRAI is a brand by ODX Studio.</p>
      <dl>
        <div>
          <dt>Company:</dt>
          <dd>ODX Studio</dd>
        </div>
        <div>
          <dt>Tax ID / VAT:</dt>
          <dd>769-598-773</dd>
        </div>
        <div>
          <dt>Location:</dt>
          <dd>5th Settlement, Cairo, Egypt</dd>
        </div>
      </dl>
    </div>
  );
}
