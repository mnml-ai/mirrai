"use client";

import { type ChangeEvent, type DragEvent, type FormEvent, useRef, useState } from "react";
import { DEFAULT_LOCALE, getDictionary, type Locale } from "@/lib/i18n";

const PROCESS_STEP_NUMBERS = ["01", "02", "03"] as const;
const ATTACHMENT_CARD_COUNT = 6;

const PROJECT_TYPES = [
  "Residential",
  "Hospitality",
  "Retail / Commercial",
  "Office",
  "Gym / Studio",
  "Saloon / Spa",
  "Showroom",
  "Other",
] as const;

const FAVORITE_COUNTRY_CODES = [
  { name: "Egypt", code: "+20" },
  { name: "Saudi Arabia", code: "+966" },
  { name: "United Arab Emirates", code: "+971" },
];

const COUNTRY_CODES = [
  { name: "Afghanistan", code: "+93" },
  { name: "Albania", code: "+355" },
  { name: "Algeria", code: "+213" },
  { name: "American Samoa", code: "+1-684" },
  { name: "Andorra", code: "+376" },
  { name: "Angola", code: "+244" },
  { name: "Anguilla", code: "+1-264" },
  { name: "Antigua and Barbuda", code: "+1-268" },
  { name: "Argentina", code: "+54" },
  { name: "Armenia", code: "+374" },
  { name: "Aruba", code: "+297" },
  { name: "Australia", code: "+61" },
  { name: "Austria", code: "+43" },
  { name: "Azerbaijan", code: "+994" },
  { name: "Bahamas", code: "+1-242" },
  { name: "Bahrain", code: "+973" },
  { name: "Bangladesh", code: "+880" },
  { name: "Barbados", code: "+1-246" },
  { name: "Belarus", code: "+375" },
  { name: "Belgium", code: "+32" },
  { name: "Belize", code: "+501" },
  { name: "Benin", code: "+229" },
  { name: "Bermuda", code: "+1-441" },
  { name: "Bhutan", code: "+975" },
  { name: "Bolivia", code: "+591" },
  { name: "Bosnia and Herzegovina", code: "+387" },
  { name: "Botswana", code: "+267" },
  { name: "Brazil", code: "+55" },
  { name: "British Virgin Islands", code: "+1-284" },
  { name: "Brunei", code: "+673" },
  { name: "Bulgaria", code: "+359" },
  { name: "Burkina Faso", code: "+226" },
  { name: "Burundi", code: "+257" },
  { name: "Cambodia", code: "+855" },
  { name: "Cameroon", code: "+237" },
  { name: "Canada", code: "+1" },
  { name: "Cape Verde", code: "+238" },
  { name: "Cayman Islands", code: "+1-345" },
  { name: "Central African Republic", code: "+236" },
  { name: "Chad", code: "+235" },
  { name: "Chile", code: "+56" },
  { name: "China", code: "+86" },
  { name: "Colombia", code: "+57" },
  { name: "Comoros", code: "+269" },
  { name: "Congo", code: "+242" },
  { name: "Cook Islands", code: "+682" },
  { name: "Costa Rica", code: "+506" },
  { name: "Croatia", code: "+385" },
  { name: "Cuba", code: "+53" },
  { name: "Curacao", code: "+599" },
  { name: "Cyprus", code: "+357" },
  { name: "Czech Republic", code: "+420" },
  { name: "Denmark", code: "+45" },
  { name: "Djibouti", code: "+253" },
  { name: "Dominica", code: "+1-767" },
  { name: "Dominican Republic", code: "+1-809" },
  { name: "Ecuador", code: "+593" },
  { name: "El Salvador", code: "+503" },
  { name: "Equatorial Guinea", code: "+240" },
  { name: "Eritrea", code: "+291" },
  { name: "Estonia", code: "+372" },
  { name: "Eswatini", code: "+268" },
  { name: "Ethiopia", code: "+251" },
  { name: "Falkland Islands", code: "+500" },
  { name: "Faroe Islands", code: "+298" },
  { name: "Fiji", code: "+679" },
  { name: "Finland", code: "+358" },
  { name: "France", code: "+33" },
  { name: "French Guiana", code: "+594" },
  { name: "French Polynesia", code: "+689" },
  { name: "Gabon", code: "+241" },
  { name: "Gambia", code: "+220" },
  { name: "Georgia", code: "+995" },
  { name: "Germany", code: "+49" },
  { name: "Ghana", code: "+233" },
  { name: "Gibraltar", code: "+350" },
  { name: "Greece", code: "+30" },
  { name: "Greenland", code: "+299" },
  { name: "Grenada", code: "+1-473" },
  { name: "Guadeloupe", code: "+590" },
  { name: "Guam", code: "+1-671" },
  { name: "Guatemala", code: "+502" },
  { name: "Guernsey", code: "+44-1481" },
  { name: "Guinea", code: "+224" },
  { name: "Guinea-Bissau", code: "+245" },
  { name: "Guyana", code: "+592" },
  { name: "Haiti", code: "+509" },
  { name: "Honduras", code: "+504" },
  { name: "Hong Kong", code: "+852" },
  { name: "Hungary", code: "+36" },
  { name: "Iceland", code: "+354" },
  { name: "India", code: "+91" },
  { name: "Indonesia", code: "+62" },
  { name: "Iran", code: "+98" },
  { name: "Iraq", code: "+964" },
  { name: "Ireland", code: "+353" },
  { name: "Isle of Man", code: "+44-1624" },
  { name: "Italy", code: "+39" },
  { name: "Ivory Coast", code: "+225" },
  { name: "Jamaica", code: "+1-876" },
  { name: "Japan", code: "+81" },
  { name: "Jersey", code: "+44-1534" },
  { name: "Jordan", code: "+962" },
  { name: "Kazakhstan", code: "+7" },
  { name: "Kenya", code: "+254" },
  { name: "Kiribati", code: "+686" },
  { name: "Kosovo", code: "+383" },
  { name: "Kuwait", code: "+965" },
  { name: "Kyrgyzstan", code: "+996" },
  { name: "Laos", code: "+856" },
  { name: "Latvia", code: "+371" },
  { name: "Lebanon", code: "+961" },
  { name: "Lesotho", code: "+266" },
  { name: "Liberia", code: "+231" },
  { name: "Libya", code: "+218" },
  { name: "Liechtenstein", code: "+423" },
  { name: "Lithuania", code: "+370" },
  { name: "Luxembourg", code: "+352" },
  { name: "Macau", code: "+853" },
  { name: "Madagascar", code: "+261" },
  { name: "Malawi", code: "+265" },
  { name: "Malaysia", code: "+60" },
  { name: "Maldives", code: "+960" },
  { name: "Mali", code: "+223" },
  { name: "Malta", code: "+356" },
  { name: "Marshall Islands", code: "+692" },
  { name: "Martinique", code: "+596" },
  { name: "Mauritania", code: "+222" },
  { name: "Mauritius", code: "+230" },
  { name: "Mayotte", code: "+262" },
  { name: "Mexico", code: "+52" },
  { name: "Micronesia", code: "+691" },
  { name: "Moldova", code: "+373" },
  { name: "Monaco", code: "+377" },
  { name: "Mongolia", code: "+976" },
  { name: "Montenegro", code: "+382" },
  { name: "Montserrat", code: "+1-664" },
  { name: "Morocco", code: "+212" },
  { name: "Mozambique", code: "+258" },
  { name: "Myanmar", code: "+95" },
  { name: "Namibia", code: "+264" },
  { name: "Nauru", code: "+674" },
  { name: "Nepal", code: "+977" },
  { name: "Netherlands", code: "+31" },
  { name: "New Caledonia", code: "+687" },
  { name: "New Zealand", code: "+64" },
  { name: "Nicaragua", code: "+505" },
  { name: "Niger", code: "+227" },
  { name: "Nigeria", code: "+234" },
  { name: "Niue", code: "+683" },
  { name: "North Korea", code: "+850" },
  { name: "North Macedonia", code: "+389" },
  { name: "Northern Mariana Islands", code: "+1-670" },
  { name: "Norway", code: "+47" },
  { name: "Oman", code: "+968" },
  { name: "Pakistan", code: "+92" },
  { name: "Palau", code: "+680" },
  { name: "Palestine", code: "+970" },
  { name: "Panama", code: "+507" },
  { name: "Papua New Guinea", code: "+675" },
  { name: "Paraguay", code: "+595" },
  { name: "Peru", code: "+51" },
  { name: "Philippines", code: "+63" },
  { name: "Poland", code: "+48" },
  { name: "Portugal", code: "+351" },
  { name: "Puerto Rico", code: "+1-787" },
  { name: "Qatar", code: "+974" },
  { name: "Reunion", code: "+262" },
  { name: "Romania", code: "+40" },
  { name: "Russia", code: "+7" },
  { name: "Rwanda", code: "+250" },
  { name: "Saint Barthelemy", code: "+590" },
  { name: "Saint Helena", code: "+290" },
  { name: "Saint Kitts and Nevis", code: "+1-869" },
  { name: "Saint Lucia", code: "+1-758" },
  { name: "Saint Martin", code: "+590" },
  { name: "Saint Pierre and Miquelon", code: "+508" },
  { name: "Saint Vincent and the Grenadines", code: "+1-784" },
  { name: "Samoa", code: "+685" },
  { name: "San Marino", code: "+378" },
  { name: "Sao Tome and Principe", code: "+239" },
  { name: "Senegal", code: "+221" },
  { name: "Serbia", code: "+381" },
  { name: "Seychelles", code: "+248" },
  { name: "Sierra Leone", code: "+232" },
  { name: "Singapore", code: "+65" },
  { name: "Sint Maarten", code: "+1-721" },
  { name: "Slovakia", code: "+421" },
  { name: "Slovenia", code: "+386" },
  { name: "Solomon Islands", code: "+677" },
  { name: "Somalia", code: "+252" },
  { name: "South Africa", code: "+27" },
  { name: "South Korea", code: "+82" },
  { name: "South Sudan", code: "+211" },
  { name: "Spain", code: "+34" },
  { name: "Sri Lanka", code: "+94" },
  { name: "Sudan", code: "+249" },
  { name: "Suriname", code: "+597" },
  { name: "Sweden", code: "+46" },
  { name: "Switzerland", code: "+41" },
  { name: "Syria", code: "+963" },
  { name: "Taiwan", code: "+886" },
  { name: "Tajikistan", code: "+992" },
  { name: "Tanzania", code: "+255" },
  { name: "Thailand", code: "+66" },
  { name: "Timor-Leste", code: "+670" },
  { name: "Togo", code: "+228" },
  { name: "Tokelau", code: "+690" },
  { name: "Tonga", code: "+676" },
  { name: "Trinidad and Tobago", code: "+1-868" },
  { name: "Tunisia", code: "+216" },
  { name: "Turkey", code: "+90" },
  { name: "Turkmenistan", code: "+993" },
  { name: "Turks and Caicos Islands", code: "+1-649" },
  { name: "Tuvalu", code: "+688" },
  { name: "Uganda", code: "+256" },
  { name: "Ukraine", code: "+380" },
  { name: "United Kingdom", code: "+44" },
  { name: "United States", code: "+1" },
  { name: "Uruguay", code: "+598" },
  { name: "Uzbekistan", code: "+998" },
  { name: "Vanuatu", code: "+678" },
  { name: "Vatican City", code: "+379" },
  { name: "Venezuela", code: "+58" },
  { name: "Vietnam", code: "+84" },
  { name: "Wallis and Futuna", code: "+681" },
  { name: "Yemen", code: "+967" },
  { name: "Zambia", code: "+260" },
  { name: "Zimbabwe", code: "+263" },
];

const FORM_COUNTRIES = [...FAVORITE_COUNTRY_CODES, ...COUNTRY_CODES];
const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;
const ALLOWED_UPLOAD_EXTENSIONS = [".jpg", ".jpeg", ".png", ".pdf", ".dwg", ".skp"];

export default function CustomBriefForm({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const dictionary = getDictionary(locale);
  const formCopy = dictionary.customPage.form;
  const whatsappBriefUrl = `https://wa.me/201144582331?text=${encodeURIComponent(dictionary.whatsapp.smartMirrorPrefill)}`;
  const [notes, setNotes] = useState("");
  const [selectedPhoneCountry, setSelectedPhoneCountry] = useState(FAVORITE_COUNTRY_CODES[0]);
  const [isPhoneCountryOpen, setIsPhoneCountryOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState("");
  const [isUploadDragging, setIsUploadDragging] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | File[]) => {
    const incomingFiles = Array.from(files);
    const validFiles = incomingFiles.filter((file) => {
      const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
      return ALLOWED_UPLOAD_EXTENSIONS.includes(extension) && file.size <= MAX_UPLOAD_SIZE;
    });

    if (validFiles.length !== incomingFiles.length) {
      setUploadError(formCopy.uploadSkipped);
    } else {
      setUploadError("");
    }

    if (validFiles.length > 0) {
      setSelectedFiles((current) => [...current, ...validFiles]);
    }
  };

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      handleFiles(event.target.files);
      event.target.value = "";
    }
  };

  const handleUploadDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsUploadDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  const removeSelectedFile = (fileIndex: number) => {
    setSelectedFiles((current) => current.filter((_, index) => index !== fileIndex));
  };

  const getFormValue = (formData: FormData, key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value.trim() : "";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const phoneNumber = getFormValue(formData, "phone");
    const city = getFormValue(formData, "city");
    const district = getFormValue(formData, "district");

    setSubmitState("submitting");
    setSubmitMessage("");

    try {
      const response = await fetch("/api/custom-brief", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: getFormValue(formData, "fullName"),
          email: getFormValue(formData, "email"),
          phone: `${selectedPhoneCountry.code} ${phoneNumber}`.trim(),
          projectType: getFormValue(formData, "projectType"),
          cityArea: [city, district].filter(Boolean).join(" / "),
          spaceLocation: getFormValue(formData, "spaceLocation"),
          preferredMirrorSize: getFormValue(formData, "preferredMirrorSize"),
          notes,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || formCopy.requestError);
      }

      setSubmitState("success");
      setSubmitMessage(formCopy.success);
      form.reset();
      setNotes("");
      setSelectedFiles([]);
      setUploadError("");
    } catch (error) {
      setSubmitState("error");
      setSubmitMessage(
        error instanceof Error
          ? error.message
          : formCopy.fallbackError
      );
    }
  };

  return (
    <section id="custom-brief" className="brief-section">
      <div className="brief-card">
        {/* Left sidebar */}
        <aside className="brief-sidebar">
          <p className="brief-kicker">{formCopy.kicker}</p>
          <h2 className="brief-title">
            {formCopy.titleLines.map((line, index) => (
              <span key={line}>
                {line}
                {index < formCopy.titleLines.length - 1 ? <br /> : null}
              </span>
            ))}
          </h2>

          <ol className="brief-steps">
            {formCopy.steps.map((step, index) => (
              <li key={step.title} className="brief-step">
                <span className="brief-step-number">{PROCESS_STEP_NUMBERS[index]}</span>
                <div className="brief-step-content">
                  <strong>{step.title}</strong>
                  <span>{step.description}</span>
                </div>
              </li>
            ))}
          </ol>

          <div className="brief-whatsapp-card">
            <div className="brief-whatsapp-head">
              <span className="brief-whatsapp-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                  <path d="M17.6 14.5c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2s-.8 1-1 1.2c-.2.2-.4.2-.7.1-.9-.4-1.7-.9-2.4-1.6-.6-.6-1.2-1.4-1.6-2.2-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5L9 6.6c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.4-.6.6-1 1.4-1 2.2 0 1.4.5 2.7 1.3 3.8 1.6 2.2 3.7 4 6.2 5 .7.3 1.4.5 2.1.5.7 0 1.4-.2 2-.6.7-.4 1.1-1 1.3-1.7.1-.4.1-.8.1-1.2-.1-.1-.3-.2-.6-.3z"/>
                  <path d="M19.4 4.6C17.5 2.5 14.8 1.4 12 1.4 6.2 1.4 1.4 6.2 1.4 12c0 1.9.5 3.7 1.5 5.3L1.4 22.6l5.4-1.4c1.6.9 3.4 1.3 5.2 1.3 5.8 0 10.6-4.8 10.6-10.6 0-2.8-1.1-5.5-3.2-7.3zM12 20.7c-1.6 0-3.2-.4-4.6-1.3l-.3-.2-3.3.9.9-3.2-.2-.3c-.9-1.5-1.4-3.2-1.4-4.9 0-4.9 4-8.8 8.8-8.8 2.4 0 4.6.9 6.2 2.6 1.7 1.7 2.6 3.9 2.6 6.2.1 4.9-3.9 8.9-8.7 9z"/>
                </svg>
              </span>
              <div>
                <strong>{formCopy.whatsappTitle}</strong>
                <span>{formCopy.whatsappBody}</span>
              </div>
            </div>
            <a className="brief-whatsapp-button" href={whatsappBriefUrl} target="_blank" rel="noreferrer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              </svg>
              {formCopy.whatsappCta}
            </a>
          </div>

          <p className="brief-reply-note">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8d6840" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            {formCopy.replyLine1}<br />{formCopy.replyLine2}
          </p>
        </aside>

        {/* Right form */}
        <form className="brief-form" onSubmit={handleSubmit}>
          <div className="brief-row">
            <label className="brief-field">
              <span className="brief-label">{formCopy.labels.fullName} <em>*</em></span>
              <input name="fullName" type="text" placeholder={formCopy.placeholders.fullName} required />
            </label>
            <label className="brief-field">
              <span className="brief-label">{formCopy.labels.email} <em>*</em></span>
              <input name="email" type="email" placeholder={formCopy.placeholders.email} required />
            </label>
          </div>

          <div className="brief-row">
            <label className="brief-field">
              <span className="brief-label">{formCopy.labels.country} <em>*</em></span>
              <select name="country" className="brief-select" defaultValue="" required>
                <option value="" disabled>{formCopy.placeholders.country}</option>
                {FORM_COUNTRIES.map((country) => (
                  <option key={`country-${country.name}`} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="brief-field">
              <span className="brief-label">{formCopy.labels.city} <em>*</em></span>
              <input name="city" type="text" placeholder={formCopy.placeholders.city} required />
            </label>
          </div>

          <div className="brief-row">
            <label className="brief-field">
              <span className="brief-label">{formCopy.labels.phone} <em>*</em></span>
              <div className="brief-phone-group">
                <div
                  className="brief-phone-code-picker"
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) {
                      setIsPhoneCountryOpen(false);
                    }
                  }}
                >
                  <input
                    type="hidden"
                    name="phoneCountryCode"
                    value={`${selectedPhoneCountry.name} ${selectedPhoneCountry.code}`}
                  />
                  <button
                    className="brief-phone-code"
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={isPhoneCountryOpen}
                    onClick={() => setIsPhoneCountryOpen((open) => !open)}
                  >
                    <span>{selectedPhoneCountry.code}</span>
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                      <polyline points="1 1 6 6 11 1" />
                    </svg>
                  </button>
                  {isPhoneCountryOpen ? (
                    <div className="brief-phone-code-menu" role="listbox">
                      <div className="brief-phone-code-group">{formCopy.favorites}</div>
                      {FAVORITE_COUNTRY_CODES.map((country) => (
                        <button
                          key={`favorite-${country.name}`}
                          type="button"
                          role="option"
                          aria-selected={selectedPhoneCountry.name === country.name}
                          onClick={() => {
                            setSelectedPhoneCountry(country);
                            setIsPhoneCountryOpen(false);
                          }}
                        >
                          {country.name} {country.code}
                        </button>
                      ))}
                      <div className="brief-phone-code-group">{formCopy.allCountries}</div>
                      {COUNTRY_CODES.map((country) => (
                        <button
                          key={country.name}
                          type="button"
                          role="option"
                          aria-selected={selectedPhoneCountry.name === country.name}
                          onClick={() => {
                            setSelectedPhoneCountry(country);
                            setIsPhoneCountryOpen(false);
                          }}
                        >
                          {country.name} {country.code}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
                <input name="phone" type="tel" placeholder={formCopy.placeholders.phone} required />
              </div>
            </label>
            <label className="brief-field">
              <span className="brief-label">{formCopy.labels.district}</span>
              <input name="district" type="text" placeholder={formCopy.placeholders.district} />
            </label>
          </div>

          <div className="brief-row">
            <label className="brief-field">
              <span className="brief-label">{formCopy.labels.projectType} <em>*</em></span>
              <select name="projectType" className="brief-select" defaultValue="" required>
                <option value="" disabled>{formCopy.placeholders.projectType}</option>
                {PROJECT_TYPES.map((type) => (
                  <option key={type} value={type}>{formCopy.projectTypes[type]}</option>
                ))}
              </select>
            </label>
            <label className="brief-field">
              <span className="brief-label">{formCopy.labels.spaceLocation} <em>*</em></span>
              <input name="spaceLocation" type="text" placeholder={formCopy.placeholders.spaceLocation} required />
            </label>
          </div>

          <div className="brief-row">
            <label className="brief-field">
              <span className="brief-label">{formCopy.labels.preferredMirrorSize}</span>
              <div className="brief-input-with-icon">
                <input name="preferredMirrorSize" type="text" placeholder={formCopy.placeholders.preferredMirrorSize} />
                <span className="brief-input-icon" aria-hidden>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8d6840" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </span>
              </div>
            </label>
            <label className="brief-field">
              <span className="brief-label">{formCopy.labels.preferredTvSize}</span>
              <input name="preferredTvSize" type="text" placeholder={formCopy.placeholders.preferredTvSize} />
            </label>
          </div>

          <label className="brief-field">
            <span className="brief-label">{formCopy.labels.notes}</span>
            <div className="brief-textarea-wrap">
              <textarea
                name="notes"
                placeholder={formCopy.placeholders.notes}
                value={notes}
                onChange={(e) => setNotes(e.target.value.slice(0, 1000))}
                rows={5}
              />
              <span className="brief-textarea-counter">{notes.length} / {formCopy.characterLimit}</span>
            </div>
          </label>

          <div className="brief-field">
            <span className="brief-label">{formCopy.labels.upload} <em>*</em></span>
            <input
              ref={fileInputRef}
              className="brief-upload-input"
              type="file"
              accept=".jpg,.jpeg,.png,.pdf,.dwg,.skp,image/jpeg,image/png,application/pdf"
              multiple
              onChange={handleFileInputChange}
            />
            <div
              className="brief-upload"
              data-dragging={isUploadDragging}
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setIsUploadDragging(true);
              }}
              onDragLeave={() => setIsUploadDragging(false)}
              onDrop={handleUploadDrop}
            >
              <span className="brief-upload-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8d6840" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </span>
              <div className="brief-upload-text">
                <strong>{formCopy.upload.title}</strong>
                <span>{formCopy.upload.body}</span>
                <small>{formCopy.upload.hint}</small>
              </div>
            </div>
            {uploadError ? <p className="brief-upload-error">{uploadError}</p> : null}
            {selectedFiles.length > 0 ? (
              <ul className="brief-upload-files" aria-label={formCopy.selectedFilesAria}>
                {selectedFiles.map((file, index) => (
                  <li key={`${file.name}-${file.size}-${index}`}>
                    <span className="brief-upload-file-name">{file.name}</span>
                    <small className="brief-upload-file-meta">{(file.size / (1024 * 1024)).toFixed(1)}MB</small>
                    <button
                      type="button"
                      className="brief-upload-remove"
                      aria-label={`${formCopy.removeFileAria} ${file.name}`}
                      onClick={() => removeSelectedFile(index)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="brief-thumbs">
              {Array.from({ length: ATTACHMENT_CARD_COUNT }, (_, index) => (
                <button
                  type="button"
                  key={`attachment-card-${index}`}
                  className="brief-thumb brief-thumb--add"
                  aria-label={`${formCopy.addMoreAria} ${index + 1}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8d6840" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="brief-submit" disabled={submitState === "submitting"}>
            {submitState === "submitting" ? formCopy.submitting : formCopy.submit}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>

          {submitMessage ? (
            <p className="brief-submit-status" data-state={submitState} aria-live="polite">
              {submitMessage}
            </p>
          ) : null}

          <p className="brief-secure">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            {formCopy.secure}
          </p>
        </form>
      </div>

      <style jsx>{`
        .brief-section {
          position: relative;
          z-index: 3;
          background: transparent;
          margin-top: 0;
          padding: 0 clamp(16px, 4.4vw, 58px) clamp(72px, 8vw, 118px);
        }

        .brief-card {
          max-width: 1188px;
          margin: 0 auto;
          background: rgba(255, 252, 247, 0.96);
          border: 1px solid rgba(150, 112, 74, 0.18);
          border-radius: 22px;
          box-shadow: 0 24px 70px rgba(55, 41, 30, 0.12);
          display: grid;
          grid-template-columns: 1fr;
          overflow: hidden;
          transform: translateY(-169px);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        /* Sidebar */
        .brief-sidebar {
          padding: clamp(34px, 4.2vw, 54px);
          border-bottom: 1px solid rgba(141, 104, 64, 0.12);
        }

        .brief-kicker {
          font-family: var(--font-body), system-ui, sans-serif;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.24em;
          color: #a06d3e;
          margin: 0 0 1.25rem;
          text-transform: uppercase;
        }

        .brief-title {
          font-family: var(--font-quote), Georgia, serif;
          font-size: clamp(2.05rem, 2.35vw, 2.52rem);
          font-weight: 700;
          color: #2b211c;
          line-height: 1.08;
          letter-spacing: -0.03em;
          margin: 0 0 2.5rem;
        }

        .brief-steps {
          list-style: none;
          padding: 0;
          margin: 0 0 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.4rem;
        }

        .brief-step {
          display: grid;
          grid-template-columns: 32px 1fr;
          gap: 1rem;
          align-items: start;
        }

        .brief-step-number {
          font-family: var(--font-body), system-ui, sans-serif;
          font-size: 0.74rem;
          font-weight: 700;
          color: #6f5541;
          letter-spacing: 0.04em;
          width: 34px;
          height: 34px;
          display: inline-grid;
          place-items: center;
          border: 1px solid rgba(151, 111, 72, 0.25);
          border-radius: 999px;
        }

        .brief-step-content {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .brief-step-content strong {
          font-family: var(--font-body), system-ui, sans-serif;
          font-size: 0.88rem;
          font-weight: 700;
          color: #2b211c;
        }

        .brief-step-content span {
          font-family: var(--font-body), system-ui, sans-serif;
          font-size: 0.76rem;
          color: rgba(43, 33, 28, 0.62);
          line-height: 1.55;
        }

        /* WhatsApp card */
        .brief-whatsapp-card {
          background: #fff;
          border: 1px solid rgba(141, 104, 64, 0.22);
          border-radius: 12px;
          padding: 1.15rem;
          margin-bottom: 1.25rem;
        }

        .brief-whatsapp-head {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          margin-bottom: 1rem;
        }

        .brief-whatsapp-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #b4854f, #c2945a);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .brief-whatsapp-head strong {
          display: block;
          font-family: var(--font-body), system-ui, sans-serif;
          font-size: 0.84rem;
          font-weight: 700;
          color: #2b211c;
          margin-bottom: 0.15rem;
        }

        .brief-whatsapp-head span {
          font-family: var(--font-body), system-ui, sans-serif;
          font-size: 0.78rem;
          color: rgba(37, 35, 32, 0.62);
        }

        .brief-whatsapp-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.7rem 1rem;
          border: 1px solid #b4854f;
          border-radius: 6px;
          background: linear-gradient(135deg, #b4854f, #c2945a);
          color: #fff;
          font-family: var(--font-body), system-ui, sans-serif;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-decoration: none;
          transition: all 180ms ease;
        }

        .brief-whatsapp-button:hover {
          border-color: #9e7041;
          background: linear-gradient(135deg, #9e7041, #b7834d);
          color: #fff;
        }

        .brief-reply-note {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          font-family: var(--font-body), system-ui, sans-serif;
          font-size: 0.78rem;
          color: rgba(37, 35, 32, 0.62);
          line-height: 1.55;
          margin: 0;
        }

        .brief-reply-note svg {
          flex-shrink: 0;
          margin-top: 2px;
        }

        /* Form */
        .brief-form {
          padding: clamp(34px, 4vw, 54px) clamp(34px, 5vw, 64px);
          display: flex;
          flex-direction: column;
          gap: 1.32rem;
        }

        .brief-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.7rem;
        }

        .brief-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .brief-label {
          font-family: var(--font-body), system-ui, sans-serif;
          font-size: 0.78rem;
          font-weight: 700;
          color: #302721;
        }

        .brief-label em {
          color: #b08658;
          font-style: normal;
          margin-left: 2px;
        }

        .brief-field input[type="text"],
        .brief-field input[type="email"],
        .brief-field input[type="tel"],
        .brief-select,
        .brief-textarea-wrap textarea {
          width: 100%;
          padding: 0.92rem 1rem;
          border: 1px solid rgba(141, 104, 64, 0.28);
          border-radius: 7px;
          background: rgba(255, 255, 255, 0.62);
          font-family: var(--font-body), system-ui, sans-serif;
          font-size: 0.82rem;
          color: #2b211c;
          outline: none;
          transition: border-color 180ms ease;
        }

        .brief-field input::placeholder,
        .brief-textarea-wrap textarea::placeholder {
          color: rgba(37, 35, 32, 0.42);
        }

        .brief-field input:focus,
        .brief-select:focus,
        .brief-textarea-wrap textarea:focus {
          border-color: #b08658;
        }

        .brief-phone-group {
          display: grid;
          grid-template-columns: 112px 1fr;
          gap: 0.5rem;
        }

        .brief-phone-code-picker {
          position: relative;
          min-width: 0;
        }

        .brief-phone-code {
          display: inline-flex;
          width: 100%;
          min-height: 100%;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          min-width: 0;
          padding: 0.92rem 0.7rem 0.92rem 0.85rem;
          border: 1px solid rgba(141, 104, 64, 0.28);
          border-radius: 7px;
          background: rgba(255, 255, 255, 0.62);
          font-family: var(--font-body), system-ui, sans-serif;
          font-size: 0.82rem;
          color: #1A1A1A;
          outline: none;
          cursor: pointer;
        }

        .brief-phone-code-menu {
          position: absolute;
          top: calc(100% + 0.35rem);
          left: 0;
          z-index: 20;
          width: min(340px, 80vw);
          max-height: 260px;
          overflow-y: auto;
          padding: 0.35rem 0;
          border: 1px solid rgba(141, 104, 64, 0.22);
          border-radius: 8px;
          background: #fffaf4;
          box-shadow: 0 18px 40px rgba(55, 41, 30, 0.16);
        }

        .brief-phone-code-menu button {
          display: block;
          width: 100%;
          padding: 0.55rem 0.85rem;
          border: 0;
          background: transparent;
          color: #2b211c;
          font-family: var(--font-body), system-ui, sans-serif;
          font-size: 0.82rem;
          text-align: left;
          cursor: pointer;
        }

        .brief-phone-code-menu button:hover,
        .brief-phone-code-menu button[aria-selected="true"] {
          background: rgba(176, 134, 88, 0.14);
        }

        .brief-phone-code-group {
          padding: 0.55rem 0.85rem 0.3rem;
          color: #8d6840;
          font-family: var(--font-body), system-ui, sans-serif;
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .brief-select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none' stroke='%238d6840' stroke-width='1.5'%3e%3cpolyline points='1 1 6 6 11 1'/%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          padding-right: 2.5rem;
        }

        .brief-input-with-icon {
          position: relative;
        }

        .brief-input-with-icon input {
          padding-right: 2.5rem;
        }

        .brief-input-icon {
          position: absolute;
          right: 0.85rem;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
        }

        .brief-textarea-wrap {
          position: relative;
        }

        .brief-textarea-wrap textarea {
          resize: vertical;
          min-height: 120px;
          font-family: var(--font-body), system-ui, sans-serif;
        }

        .brief-textarea-counter {
          position: absolute;
          right: 0.85rem;
          bottom: 0.6rem;
          font-family: var(--font-body), system-ui, sans-serif;
          font-size: 0.72rem;
          color: rgba(37, 35, 32, 0.42);
        }

        /* Upload */
        .brief-upload {
          border: 1px dashed rgba(141, 104, 64, 0.36);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.45);
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          cursor: pointer;
          transition: background 180ms ease, border-color 180ms ease;
        }

        .brief-upload:hover,
        .brief-upload[data-dragging="true"] {
          border-color: #b08658;
          background: rgba(255, 250, 244, 0.78);
        }

        .brief-upload-input {
          display: none;
        }

        .brief-upload-icon {
          flex-shrink: 0;
          width: 56px;
          height: 56px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .brief-upload-text {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .brief-upload-text strong {
          font-family: var(--font-body), system-ui, sans-serif;
          font-size: 0.88rem;
          font-weight: 600;
          color: #1A1A1A;
        }

        .brief-upload-text span {
          font-family: var(--font-body), system-ui, sans-serif;
          font-size: 0.8rem;
          color: rgba(37, 35, 32, 0.62);
        }

        .brief-upload-text small {
          font-family: var(--font-body), system-ui, sans-serif;
          font-size: 0.72rem;
          color: rgba(37, 35, 32, 0.45);
          margin-top: 0.25rem;
        }

        .brief-upload-error {
          margin: 0;
          color: #9d3f2f;
          font-family: var(--font-body), system-ui, sans-serif;
          font-size: 0.76rem;
        }

        .brief-upload-files {
          display: grid;
          gap: 0.4rem;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .brief-upload-files li {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto 32px;
          align-items: center;
          gap: 0.65rem;
          min-height: 46px;
          padding: 0.45rem 0.48rem 0.45rem 0.75rem;
          border: 1px solid rgba(141, 104, 64, 0.16);
          border-radius: 7px;
          background: rgba(255, 255, 255, 0.52);
          color: #2b211c;
          font-family: var(--font-body), system-ui, sans-serif;
          font-size: 0.78rem;
        }

        .brief-upload-file-name {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          unicode-bidi: plaintext;
        }

        .brief-upload-file-meta {
          color: rgba(37, 35, 32, 0.5);
          white-space: nowrap;
        }

        .brief-upload-remove {
          width: 32px;
          height: 32px;
          border: 1px solid rgba(141, 104, 64, 0.16);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.6);
          color: #8d6840;
          display: inline-grid;
          place-items: center;
          cursor: pointer;
          transition: background 180ms ease, border-color 180ms ease, color 180ms ease;
        }

        .brief-upload-remove:hover {
          border-color: rgba(157, 63, 47, 0.35);
          background: rgba(157, 63, 47, 0.08);
          color: #9d3f2f;
        }

        .brief-thumbs {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 0.5rem;
          margin-top: 0.75rem;
        }

        .brief-thumb {
          position: relative;
          aspect-ratio: 1;
          border: 1px solid rgba(141, 104, 64, 0.18);
          border-radius: 8px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.38);
          cursor: pointer;
          padding: 0;
          transition: background 180ms ease, border-color 180ms ease;
        }

        .brief-thumb:hover {
          border-color: #b08658;
          background: rgba(255, 250, 244, 0.78);
        }

        .brief-thumb--add {
          border-style: dashed;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        /* Submit */
        .brief-submit {
          margin-top: 0.5rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          width: 100%;
          padding: 1rem 1.5rem;
          border: none;
          border-radius: 7px;
          background: linear-gradient(135deg, #b4854f, #c2945a);
          color: #fff;
          font-family: var(--font-body), system-ui, sans-serif;
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 180ms ease;
        }

        .brief-submit:hover {
          background: linear-gradient(135deg, #9e7041, #b7834d);
        }

        .brief-submit:disabled {
          cursor: progress;
          opacity: 0.72;
        }

        .brief-submit-status {
          margin: -0.35rem 0 0;
          text-align: center;
          font-family: var(--font-body), system-ui, sans-serif;
          font-size: 0.8rem;
          font-weight: 700;
          color: #2d6a4f;
        }

        .brief-submit-status[data-state="error"] {
          color: #9f3a2f;
        }

        .brief-secure {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin: 0;
          font-family: var(--font-body), system-ui, sans-serif;
          font-size: 0.76rem;
          color: rgba(37, 35, 32, 0.55);
        }

        @media (min-width: 900px) {
          .brief-row {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (min-width: 1024px) {
          .brief-card {
            grid-template-columns: 360px 1fr;
          }

          .brief-sidebar {
            padding-inline: clamp(34px, 3vw, 44px);
            border-bottom: none;
            border-right: 1px solid rgba(141, 104, 64, 0.08);
          }

          .brief-title {
            font-size: clamp(2.05rem, 2.1vw, 2.32rem);
            letter-spacing: -0.02em;
            white-space: nowrap;
          }
        }

        @media (max-width: 767px) {
          .brief-section {
            padding-inline: 10px;
            padding-bottom: 56px;
          }

          .brief-card {
            width: 100%;
            max-width: 100%;
            min-width: 0;
            border-radius: 16px;
          }

          .brief-sidebar,
          .brief-form {
            min-width: 0;
            padding: clamp(22px, 6vw, 30px);
          }

          .brief-title {
            font-size: clamp(1.78rem, 9vw, 2.2rem);
            letter-spacing: 0;
          }

          .brief-row,
          .brief-field,
          .brief-phone-group,
          .brief-input-with-icon,
          .brief-textarea-wrap {
            min-width: 0;
          }

          .brief-phone-group {
            grid-template-columns: minmax(86px, 0.36fr) minmax(0, 1fr);
          }

          .brief-upload {
            align-items: center;
            gap: 0.75rem;
            padding: 1rem;
            text-align: center;
          }

          .brief-upload-icon {
            width: 40px;
            height: 40px;
          }

          .brief-upload-text {
            min-width: 0;
          }

          .brief-upload-text strong,
          .brief-upload-text span,
          .brief-upload-text small {
            white-space: normal;
          }

          .brief-upload-files li {
            grid-template-columns: minmax(0, 1fr) auto 30px;
            gap: 0.45rem;
            padding-inline: 0.65rem 0.42rem;
          }

          .brief-upload-remove {
            width: 30px;
            height: 30px;
          }

          .brief-thumbs {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 0.48rem;
          }

          .brief-submit {
            min-height: 52px;
            padding-inline: 0.75rem;
            font-size: 0.68rem;
            letter-spacing: 0.14em;
          }
        }
      `}</style>
    </section>
  );
}
