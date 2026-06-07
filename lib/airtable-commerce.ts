type AirtableRecord = {
  id: string;
  fields: Record<string, unknown>;
};

type AirtableListResponse = {
  records?: AirtableRecord[];
};

type AirtableMutationResponse = {
  records?: AirtableRecord[];
};

type AirtableFieldMetadata = {
  name: string;
  options?: {
    choices?: Array<{ name: string }>;
  };
};

type AirtableTableMetadata = {
  id: string;
  fields?: AirtableFieldMetadata[];
};

type CustomerInfo = {
  name: string;
  email: string;
  phone: string;
};

type ProductConfigurationFields = {
  productTitle: string;
  size: string;
  frameColor: string;
  tvSize: string;
  tvAvailability: string;
  lighting: string;
  lightColor: string;
  referralCode: string;
};

type AirtableCommerceEnv = {
  pat: string;
  baseId: string;
  ordersTableId: string;
  paymentsTableId: string;
  clientsTableId: string;
  productsTableId: string;
};

export const AIRTABLE_COMMERCE_FIELDS = {
  orders: {
    client: "Client",
    customSpecs: "Custom Specs",
    totalPrice: "Total Price",
    productModel: "Product Model",
    size: "Size",
    frameColor: "Frame Color",
    tvSize: "TV Size",
    tvAvailability: "TV Availability",
    lighting: "Lighting",
    lightColor: "Light Color",
    referralCode: "Referral Code",
    paymentMethod: "Payment Method",
    paymentStatus: "Payment Status",
    orderStatus: "Production Status",
    shopifyOrderLink: "Shopify Order Link",
    externalPaymentUrl: "External Payment Link",
    shopifyInvoiceUrl: "Shopify Invoice URL",
    shopifyDraftOrderId: "Shopify Draft Order ID",
    shopifyOrderId: "Shopify Order ID",
    source: "Source",
    notes: "Notes",
  },
  products: {
    name: "Product Name",
  },
  payments: {
    order: "Order",
    client: "Client",
    paymentDate: "Payment Date",
    amount: "Payment Amount",
    paymentMethod: "Payment Method",
    paymentStatus: "Payment Status",
    paymentType: "Payment Type",
    notes: "Notes",
  },
  clients: {
    name: "Client Name",
    phone: "Contact Phone",
    email: "Contact Email",
  },
} as const;

const ORDER_STATUSES = {
  awaitingPayment: "Awaiting Production",
  activeInProduction: "In Production",
  cancelled: "Cancelled",
} as const;

const ORDER_PAYMENT_STATUSES = {
  unpaid: "Unpaid",
  paid: "Paid in Full",
  refunded: "Refunded",
  partiallyRefunded: "Partially Refunded",
  cancelled: "Cancelled",
} as const;

const PAYMENT_RECORD_STATUSES = {
  paid: "Completed",
  refunded: "Refunded",
} as const;

const PAYMENT_TYPES = {
  shopify: "One-time",
  refund: "Refund",
} as const;

const ORDER_SOURCES = {
  websiteCheckout: "Website Checkout",
  manualShopifyDraft: "Manual Shopify Draft",
} as const;

const AIRTABLE_API_BASE = "https://api.airtable.com/v0";

const tableFieldNamesCache = new Map<string, Promise<Set<string>>>();
const tableFieldChoiceNamesCache = new Map<string, Promise<Set<string>>>();
const productRecordIdCache = new Map<string, Promise<string | null>>();

export class AirtableCommerceError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details: unknown) {
    super(message);
    this.name = "AirtableCommerceError";
    this.status = status;
    this.details = details;
  }
}

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing ${name}.`);
  }

  return value;
}

function getAirtableCommerceEnv(): AirtableCommerceEnv {
  return {
    pat: requiredEnv("AIRTABLE_PAT"),
    baseId: requiredEnv("AIRTABLE_BASE_ID"),
    ordersTableId: requiredEnv("AIRTABLE_ORDERS_TABLE_ID"),
    paymentsTableId: requiredEnv("AIRTABLE_PAYMENTS_TABLE_ID"),
    clientsTableId: process.env.AIRTABLE_CLIENTS_TABLE_ID?.trim() || "",
    productsTableId: process.env.AIRTABLE_PRODUCTS_TABLE_ID?.trim() || "tblbDgLm4cQDLGDr8",
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function asString(value: unknown) {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return "";
}

function asNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const number = Number(value.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(number) ? number : undefined;
}

function cleanFields(fields: Record<string, unknown>) {
  const cleaned: Record<string, unknown> = {};

  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    if (Array.isArray(value) && value.length === 0) {
      return;
    }

    cleaned[key] = value;
  });

  return cleaned;
}

async function getTableFieldNames(tableId: string) {
  const cached = tableFieldNamesCache.get(tableId);

  if (cached) {
    return cached;
  }

  const promise = (async () => {
    const env = getAirtableCommerceEnv();
    const response = await fetch(`${AIRTABLE_API_BASE}/meta/bases/${env.baseId}/tables`, {
      headers: {
        Authorization: `Bearer ${env.pat}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json().catch(() => null) as {
      tables?: Array<{
        id: string;
        fields?: Array<{ name: string }>;
      }>;
    } | null;

    if (!response.ok || !data?.tables) {
      console.warn("Could not inspect Airtable table schema; using configured fields as-is.");
      return new Set<string>();
    }

    const table = data.tables.find((candidate) => candidate.id === tableId);
    return new Set(table?.fields?.map((field) => field.name) || []);
  })();

  tableFieldNamesCache.set(tableId, promise);
  return promise;
}

async function getTableFieldChoiceNames(tableId: string, fieldName: string) {
  const cacheKey = `${tableId}:${fieldName}`;
  const cached = tableFieldChoiceNamesCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const promise = (async () => {
    const env = getAirtableCommerceEnv();
    const response = await fetch(`${AIRTABLE_API_BASE}/meta/bases/${env.baseId}/tables`, {
      headers: {
        Authorization: `Bearer ${env.pat}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json().catch(() => null) as {
      tables?: AirtableTableMetadata[];
    } | null;

    if (!response.ok || !data?.tables) {
      console.warn("Could not inspect Airtable select options; using configured value as-is.");
      return new Set<string>();
    }

    const table = data.tables.find((candidate) => candidate.id === tableId);
    const airtableField = table?.fields?.find((candidate) => candidate.name === fieldName);
    return new Set(airtableField?.options?.choices?.map((choice) => choice.name) || []);
  })();

  tableFieldChoiceNamesCache.set(cacheKey, promise);
  return promise;
}

async function safeSingleSelectValue(
  tableId: string,
  fieldName: string,
  desiredValue: string,
  fallbackValues: string[] = []
) {
  const choices = await getTableFieldChoiceNames(tableId, fieldName);

  if (choices.size === 0 || choices.has(desiredValue)) {
    return desiredValue;
  }

  return fallbackValues.find((fallbackValue) => choices.has(fallbackValue));
}

async function cleanFieldsForTable(tableId: string, fields: Record<string, unknown>) {
  const cleaned = cleanFields(fields);
  const fieldNames = await getTableFieldNames(tableId);

  if (fieldNames.size === 0) {
    return cleaned;
  }

  return Object.fromEntries(
    Object.entries(cleaned).filter(([fieldName]) => fieldNames.has(fieldName))
  );
}

function unique(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function idFromGid(value: string) {
  const match = value.match(/\/(\d+)(?:\?.*)?$/);
  return match?.[1] || "";
}

function idVariants(...values: unknown[]) {
  const variants: string[] = [];

  values.forEach((value) => {
    const id = asString(value);

    if (!id) {
      return;
    }

    variants.push(id);

    const numericId = idFromGid(id);
    if (numericId) {
      variants.push(numericId);
    }
  });

  return unique(variants);
}

function getRecordValue(record: Record<string, unknown>, key: string) {
  return record[key];
}

function getNestedRecord(record: Record<string, unknown>, key: string) {
  const value = record[key];
  return isRecord(value) ? value : undefined;
}

function getNestedString(record: Record<string, unknown>, key: string) {
  return asString(record[key]);
}

function getNestedAmount(record: Record<string, unknown>, key: string) {
  const value = record[key];
  if (isRecord(value)) {
    const shopMoney = getNestedRecord(value, "shop_money");
    const presentmentMoney = getNestedRecord(value, "presentment_money");
    return asNumber(shopMoney?.amount) ?? asNumber(presentmentMoney?.amount);
  }

  return asNumber(value);
}

function field(name: string) {
  return `{${name}}`;
}

function airtableString(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function containsFormula(fieldName: string, value: string) {
  return `FIND("${airtableString(value)}", ${field(fieldName)}) > 0`;
}

function exactLowerFormula(fieldName: string, value: string) {
  return `LOWER(${field(fieldName)}) = "${airtableString(value.toLowerCase())}"`;
}

function exactFormula(fieldName: string, value: string) {
  return `${field(fieldName)} = "${airtableString(value)}"`;
}

function orFormula(parts: string[]) {
  const filtered = parts.filter(Boolean);

  if (filtered.length === 0) {
    return "";
  }

  if (filtered.length === 1) {
    return filtered[0];
  }

  return `OR(${filtered.join(",")})`;
}

function andFormula(parts: string[]) {
  const filtered = parts.filter(Boolean);

  if (filtered.length === 0) {
    return "";
  }

  if (filtered.length === 1) {
    return filtered[0];
  }

  return `AND(${filtered.join(",")})`;
}

function idSearchFormula(labels: string[], ids: string[], notesField: string) {
  return orFormula(
    labels.flatMap((label) => ids.map((id) => containsFormula(notesField, `${label}: ${id}`)))
  );
}

function exactIdFieldFormula(fieldName: string, ids: string[], fieldNames: Set<string>) {
  if (fieldNames.size > 0 && !fieldNames.has(fieldName)) {
    return "";
  }

  return orFormula(unique(ids).map((id) => exactFormula(fieldName, id)));
}

function legacyNotesIdFormula(labels: string[], ids: string[], notesField: string, fieldNames: Set<string>) {
  if (fieldNames.size > 0 && !fieldNames.has(notesField)) {
    return "";
  }

  return idSearchFormula(labels, ids, notesField);
}

function exactExistingFieldFormula(fieldName: string, value: string, fieldNames: Set<string>) {
  if (!value || (fieldNames.size > 0 && !fieldNames.has(fieldName))) {
    return "";
  }

  return exactFormula(fieldName, value);
}

function blankExistingFieldFormula(fieldName: string, fieldNames: Set<string>) {
  if (fieldNames.size > 0 && !fieldNames.has(fieldName)) {
    return "";
  }

  return `NOT(${field(fieldName)})`;
}

async function airtableRequest<TData>(
  tableId: string,
  path: string,
  init: RequestInit = {}
) {
  const env = getAirtableCommerceEnv();
  const response = await fetch(
    `${AIRTABLE_API_BASE}/${env.baseId}/${encodeURIComponent(tableId)}${path}`,
    {
      ...init,
      headers: {
        Authorization: `Bearer ${env.pat}`,
        "Content-Type": "application/json",
        ...init.headers,
      },
    }
  );
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new AirtableCommerceError(
      "Airtable commerce request failed.",
      response.status,
      data
    );
  }

  return data as TData;
}

async function findRecord(tableId: string, filterByFormula: string) {
  if (!filterByFormula) {
    return null;
  }

  const records = await findRecords(tableId, filterByFormula, 1);
  return records[0] || null;
}

async function findRecords(
  tableId: string,
  filterByFormula: string,
  maxRecords = 1,
  sort?: { field: string; direction: "asc" | "desc" }
) {
  if (!filterByFormula) {
    return [];
  }

  const params = new URLSearchParams({
    filterByFormula,
    maxRecords: String(maxRecords),
  });

  if (sort) {
    params.set("sort[0][field]", sort.field);
    params.set("sort[0][direction]", sort.direction);
  }

  const data = await airtableRequest<AirtableListResponse>(tableId, `?${params}`);
  return data.records || [];
}

async function createRecord(tableId: string, fields: Record<string, unknown>) {
  const safeFields = await cleanFieldsForTable(tableId, fields);
  const data = await airtableRequest<AirtableMutationResponse>(tableId, "", {
    method: "POST",
    body: JSON.stringify({
      records: [{ fields: safeFields }],
      typecast: true,
    }),
  });

  const record = data.records?.[0];

  if (!record) {
    throw new Error("Airtable did not return the created record.");
  }

  return record;
}

async function updateRecord(tableId: string, recordId: string, fields: Record<string, unknown>) {
  const safeFields = await cleanFieldsForTable(tableId, fields);
  const data = await airtableRequest<AirtableMutationResponse>(tableId, "", {
    method: "PATCH",
    body: JSON.stringify({
      records: [{ id: recordId, fields: safeFields }],
      typecast: true,
    }),
  });

  const record = data.records?.[0];

  if (!record) {
    throw new Error("Airtable did not return the updated record.");
  }

  return record;
}

function getDraftOrderIds(payload: Record<string, unknown>) {
  return idVariants(
    payload.id,
    payload.admin_graphql_api_id,
    payload.draft_order_id,
    payload.draftOrderId,
    getNestedRecord(payload, "draft_order")?.id,
    getNestedRecord(payload, "draft_order")?.admin_graphql_api_id
  );
}

function getOrderIds(payload: Record<string, unknown>) {
  return idVariants(payload.id, payload.admin_graphql_api_id, payload.order_id, payload.orderId);
}

function collectDraftOrderValues(value: unknown, depth = 0): string[] {
  if (depth > 4) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => collectDraftOrderValues(item, depth + 1));
  }

  if (!isRecord(value)) {
    return [];
  }

  const matches: string[] = [];

  Object.entries(value).forEach(([key, entry]) => {
    const normalizedKey = key.toLowerCase();
    const keyLooksLikeDraftOrderId =
      normalizedKey.includes("draft")
      && normalizedKey.includes("order")
      && (normalizedKey.includes("id") || normalizedKey.includes("gid"));

    if (keyLooksLikeDraftOrderId) {
      matches.push(...idVariants(entry));
    }

    matches.push(...collectDraftOrderValues(entry, depth + 1));
  });

  return unique(matches);
}

function getPaidOrderDraftIds(payload: Record<string, unknown>) {
  const sourceName = getNestedString(payload, "source_name").toLowerCase();
  const sourceIdentifier = getNestedString(payload, "source_identifier");
  const sourceId = sourceName.includes("draft") ? sourceIdentifier : "";
  const attributes = collectConfigurationAttributes(payload);
  const note = getNestedString(payload, "note");

  return unique([
    ...idVariants(
      payload.draft_order_id,
      payload.draftOrderId,
      payload.draft_order_admin_graphql_api_id,
      getNestedRecord(payload, "draft_order")?.id,
      getNestedRecord(payload, "draft_order")?.admin_graphql_api_id,
      sourceId,
      getAttribute(attributes, [
        "Shopify Draft Order ID",
        "MIRRAI Draft Order ID",
        "Draft Order ID",
      ]),
      getAttribute(attributes, [
        "Shopify Draft Order GID",
        "MIRRAI Draft Order GID",
        "Draft Order GID",
      ]),
      getNoteLineValue(note, [
        "Shopify Draft Order ID",
        "MIRRAI Draft Order ID",
        "Draft Order ID",
      ]),
      getNoteLineValue(note, [
        "Shopify Draft Order GID",
        "MIRRAI Draft Order GID",
        "Draft Order GID",
      ])
    ),
    ...collectDraftOrderValues(payload),
  ]);
}

function getMirraiCheckoutIds(payload: Record<string, unknown>) {
  const attributes = collectConfigurationAttributes(payload);
  const note = getNestedString(payload, "note");

  return unique([
    getAttribute(attributes, ["MIRRAI Checkout ID", "Checkout ID"]),
    getNoteLineValue(note, ["MIRRAI Checkout ID", "Checkout ID"]),
  ]);
}

function getCustomerInfo(payload: Record<string, unknown>): CustomerInfo {
  const customer = getNestedRecord(payload, "customer") || {};
  const billingAddress = getNestedRecord(payload, "billing_address") || {};
  const shippingAddress = getNestedRecord(payload, "shipping_address") || {};
  const defaultAddress = getNestedRecord(customer, "default_address") || {};
  const firstName =
    getNestedString(customer, "first_name")
    || getNestedString(billingAddress, "first_name")
    || getNestedString(shippingAddress, "first_name")
    || getNestedString(defaultAddress, "first_name");
  const lastName =
    getNestedString(customer, "last_name")
    || getNestedString(billingAddress, "last_name")
    || getNestedString(shippingAddress, "last_name")
    || getNestedString(defaultAddress, "last_name");
  const name =
    getNestedString(customer, "name")
    || getNestedString(billingAddress, "name")
    || getNestedString(shippingAddress, "name")
    || getNestedString(defaultAddress, "name")
    || [firstName, lastName].filter(Boolean).join(" ");
  const email =
    getNestedString(payload, "email")
    || getNestedString(customer, "email")
    || getNestedString(billingAddress, "email")
    || getNestedString(shippingAddress, "email");
  const phone =
    getNestedString(payload, "phone")
    || getNestedString(customer, "phone")
    || getNestedString(billingAddress, "phone")
    || getNestedString(shippingAddress, "phone")
    || getNestedString(defaultAddress, "phone");

  return { name, email, phone };
}

function getInvoiceUrl(payload: Record<string, unknown>) {
  return (
    getNestedString(payload, "invoice_url")
    || getNestedString(payload, "invoiceUrl")
    || getNestedString(payload, "invoiceUrl")
  );
}

function getTags(payload: Record<string, unknown>) {
  const tags = getRecordValue(payload, "tags");

  if (Array.isArray(tags)) {
    return tags.map(asString).filter(Boolean);
  }

  return asString(tags)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function getOrderSource(payload: Record<string, unknown>) {
  const text = [
    getNestedString(payload, "note"),
    getTags(payload).join(" "),
    getNestedString(payload, "source_name"),
  ].join(" ").toLowerCase();

  if (
    text.includes("mirrai website")
    || text.includes("website draft order")
    || text.includes("draft checkout")
  ) {
    return ORDER_SOURCES.websiteCheckout;
  }

  return ORDER_SOURCES.manualShopifyDraft;
}

function primaryShopifyId(ids: string[]) {
  return ids.find((id) => /^\d+$/.test(id)) || ids[0] || "";
}

function getTotalPrice(payload: Record<string, unknown>) {
  return (
    asNumber(payload.total_price)
    ?? asNumber(payload.current_total_price)
    ?? asNumber(payload.subtotal_price)
    ?? getNestedAmount(payload, "total_price_set")
    ?? getNestedAmount(payload, "current_total_price_set")
  );
}

function getCurrency(payload: Record<string, unknown>) {
  const totalPriceSet = getNestedRecord(payload, "total_price_set");
  const shopMoney = totalPriceSet ? getNestedRecord(totalPriceSet, "shop_money") : undefined;

  return (
    getNestedString(payload, "currency")
    || getNestedString(payload, "presentment_currency")
    || getNestedString(shopMoney || {}, "currency_code")
  );
}

function getPaymentMethod(payload: Record<string, unknown>) {
  const gateways = getRecordValue(payload, "payment_gateway_names");

  if (Array.isArray(gateways)) {
    const gateway = gateways.map(asString).find(Boolean);
    if (gateway) {
      const normalizedGateway = gateway.toLowerCase();

      if (normalizedGateway.includes("paypal")) {
        return "PayPal";
      }

      if (normalizedGateway.includes("cash")) {
        return "Cash";
      }

      if (normalizedGateway.includes("bank")) {
        return "Bank Transfer";
      }

      if (normalizedGateway.includes("card") || normalizedGateway.includes("credit")) {
        return "Credit Card";
      }

      return "Shopify Payment";
    }
  }

  return "Shopify Payment";
}

function getPaymentDate(payload: Record<string, unknown>) {
  const value =
    getNestedString(payload, "processed_at")
    || getNestedString(payload, "updated_at")
    || getNestedString(payload, "created_at");

  return value || new Date().toISOString();
}

function getFinancialStatus(payload: Record<string, unknown>) {
  return getNestedString(payload, "financial_status").toLowerCase();
}

function getRefundIds(payload: Record<string, unknown>) {
  return idVariants(payload.id, payload.admin_graphql_api_id, payload.refund_id, payload.refundId);
}

function getRefundOrderIds(payload: Record<string, unknown>) {
  return idVariants(
    payload.order_id,
    payload.orderId,
    payload.order_admin_graphql_api_id,
    getNestedRecord(payload, "order")?.id,
    getNestedRecord(payload, "order")?.admin_graphql_api_id
  );
}

function getRecordArray(payload: Record<string, unknown>, key: string) {
  const value = getRecordValue(payload, key);
  return Array.isArray(value) ? value.filter(isRecord) : [];
}

function getMoneyCurrency(record: Record<string, unknown>, key: string) {
  const value = getRecordValue(record, key);

  if (!isRecord(value)) {
    return "";
  }

  const shopMoney = getNestedRecord(value, "shop_money");
  const presentmentMoney = getNestedRecord(value, "presentment_money");
  return (
    getNestedString(shopMoney || {}, "currency_code")
    || getNestedString(presentmentMoney || {}, "currency_code")
  );
}

function getRefundTransactionAmount(transaction: Record<string, unknown>) {
  return (
    asNumber(transaction.amount)
    ?? getNestedAmount(transaction, "amount_set")
    ?? getNestedAmount(transaction, "total_unsettled_set")
  );
}

function getRefundAmount(payload: Record<string, unknown>) {
  const transactions = getRecordArray(payload, "transactions");
  const transactionTotal = transactions.reduce((sum, transaction) => {
    const kind = getNestedString(transaction, "kind").toLowerCase();
    const amount = getRefundTransactionAmount(transaction);

    if (amount === undefined) {
      return sum;
    }

    if (kind && !kind.includes("refund")) {
      return sum;
    }

    return sum + Math.abs(amount);
  }, 0);

  if (transactionTotal > 0) {
    return transactionTotal;
  }

  const refundLineTotal = getRecordArray(payload, "refund_line_items").reduce((sum, item) => {
    const subtotal =
      asNumber(item.subtotal)
      ?? getNestedAmount(item, "subtotal_set")
      ?? 0;
    const tax =
      asNumber(item.total_tax)
      ?? getNestedAmount(item, "total_tax_set")
      ?? 0;

    return sum + subtotal + tax;
  }, 0);

  if (refundLineTotal > 0) {
    return refundLineTotal;
  }

  return (
    asNumber(payload.amount)
    ?? asNumber(payload.total_refunded)
    ?? getNestedAmount(payload, "amount_set")
  );
}

function getRefundCurrency(payload: Record<string, unknown>) {
  const transactions = getRecordArray(payload, "transactions");
  const transactionCurrency = transactions
    .map((transaction) => (
      getNestedString(transaction, "currency")
      || getNestedString(transaction, "currency_code")
      || getMoneyCurrency(transaction, "amount_set")
    ))
    .find(Boolean);

  return transactionCurrency || getCurrency(payload);
}

function getRefundDate(payload: Record<string, unknown>) {
  return (
    getNestedString(payload, "processed_at")
    || getNestedString(payload, "created_at")
    || getNestedString(payload, "updated_at")
    || new Date().toISOString()
  );
}

function getCancellationReason(payload: Record<string, unknown>) {
  return (
    getNestedString(payload, "cancel_reason")
    || getNestedString(payload, "cancellation_reason")
    || getNestedString(payload, "reason")
  );
}

function getRefundReason(payload: Record<string, unknown>) {
  return (
    getNestedString(payload, "note")
    || getNestedString(payload, "reason")
    || getNestedString(payload, "message")
  );
}

function getOrderTotalFromAirtable(order: AirtableRecord | null) {
  return order ? asNumber(order.fields[AIRTABLE_COMMERCE_FIELDS.orders.totalPrice]) : undefined;
}

async function getCancelledOrderPaymentStatus(payload: Record<string, unknown>) {
  const env = getAirtableCommerceEnv();
  const paymentStatusField = AIRTABLE_COMMERCE_FIELDS.orders.paymentStatus;
  const financialStatus = getFinancialStatus(payload);

  if (financialStatus === "refunded") {
    return safeSingleSelectValue(
      env.ordersTableId,
      paymentStatusField,
      ORDER_PAYMENT_STATUSES.refunded
    );
  }

  if (financialStatus === "partially_refunded") {
    return safeSingleSelectValue(
      env.ordersTableId,
      paymentStatusField,
      ORDER_PAYMENT_STATUSES.partiallyRefunded,
      [ORDER_PAYMENT_STATUSES.refunded]
    );
  }

  if (financialStatus === "paid" || financialStatus === "partially_paid") {
    return safeSingleSelectValue(
      env.ordersTableId,
      paymentStatusField,
      financialStatus === "paid" ? ORDER_PAYMENT_STATUSES.paid : "Deposit Paid",
      [ORDER_PAYMENT_STATUSES.paid]
    );
  }

  return safeSingleSelectValue(
    env.ordersTableId,
    paymentStatusField,
    ORDER_PAYMENT_STATUSES.cancelled,
    [ORDER_PAYMENT_STATUSES.unpaid]
  );
}

async function getRefundOrderPaymentStatus(
  payload: Record<string, unknown>,
  order: AirtableRecord | null,
  refundAmount: number | undefined
) {
  const env = getAirtableCommerceEnv();
  const paymentStatusField = AIRTABLE_COMMERCE_FIELDS.orders.paymentStatus;
  const financialStatus = getFinancialStatus(payload);

  if (financialStatus === "refunded") {
    return safeSingleSelectValue(
      env.ordersTableId,
      paymentStatusField,
      ORDER_PAYMENT_STATUSES.refunded
    );
  }

  if (financialStatus === "partially_refunded") {
    return safeSingleSelectValue(
      env.ordersTableId,
      paymentStatusField,
      ORDER_PAYMENT_STATUSES.partiallyRefunded,
      [ORDER_PAYMENT_STATUSES.refunded]
    );
  }

  const orderTotal = getOrderTotalFromAirtable(order);
  const isFullRefund =
    refundAmount !== undefined
    && orderTotal !== undefined
    && refundAmount + 0.01 >= orderTotal;

  return safeSingleSelectValue(
    env.ordersTableId,
    paymentStatusField,
    isFullRefund ? ORDER_PAYMENT_STATUSES.refunded : ORDER_PAYMENT_STATUSES.partiallyRefunded,
    [ORDER_PAYMENT_STATUSES.refunded]
  );
}

function getAttributeEntries(possibleArray: unknown) {
  if (!Array.isArray(possibleArray)) {
    return [];
  }

  return possibleArray
    .filter(isRecord)
    .map((entry) => {
      const key = asString(entry.name) || asString(entry.key);
      const value = asString(entry.value);
      return key && value ? [key, value] as const : null;
    })
    .filter((entry): entry is readonly [string, string] => Boolean(entry));
}

function normalizeAttributeKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function collectConfigurationAttributes(payload: Record<string, unknown>) {
  const attributes = new Map<string, string>();
  const add = (key: string, value: string) => {
    const normalizedKey = normalizeAttributeKey(key);

    if (normalizedKey && value && !attributes.has(normalizedKey)) {
      attributes.set(normalizedKey, value);
    }
  };

  getAttributeEntries(payload.note_attributes).forEach(([key, value]) => add(key, value));

  const lineItems = getRecordValue(payload, "line_items");

  if (Array.isArray(lineItems)) {
    lineItems.filter(isRecord).forEach((item) => {
      [item.properties, item.custom_attributes, item.note_attributes].forEach((possibleArray) => {
        getAttributeEntries(possibleArray).forEach(([key, value]) => add(key, value));
      });
    });
  }

  return attributes;
}

function getAttribute(attributes: Map<string, string>, keys: string[]) {
  for (const key of keys) {
    const value = attributes.get(normalizeAttributeKey(key));

    if (value) {
      return value;
    }
  }

  return "";
}

function getNoteLineValue(note: string, labels: string[]) {
  const lines = note.split("\n");

  for (const label of labels) {
    const normalizedLabel = label.toLowerCase();
    const line = lines.find((candidate) => candidate.toLowerCase().startsWith(`${normalizedLabel}:`));

    if (line) {
      return line.slice(line.indexOf(":") + 1).trim();
    }
  }

  return "";
}

function getFirstLineItemTitle(payload: Record<string, unknown>) {
  const lineItems = getRecordValue(payload, "line_items");

  if (!Array.isArray(lineItems)) {
    return "";
  }

  const firstLineItem = lineItems.find(isRecord);
  return firstLineItem ? getNestedString(firstLineItem, "title") || getNestedString(firstLineItem, "name") : "";
}

function normalizeTvSize(value: string) {
  const match = value.match(/\d+/);
  return match ? `${match[0]}\"` : "";
}

function normalizeOptionalSelect(value: string) {
  return value && value.toLowerCase() !== "none" ? value : "";
}

function normalizeReferralCode(value: string) {
  return value && value.toLowerCase() !== "none" ? value : "";
}

function getProductConfigurationFields(payload: Record<string, unknown>): ProductConfigurationFields {
  const attributes = collectConfigurationAttributes(payload);
  const note = getNestedString(payload, "note");
  const lineItemTitle = getFirstLineItemTitle(payload);
  const productTitle =
    getAttribute(attributes, ["Product model", "Product Model"])
    || getNoteLineValue(note, ["Model"])
    || lineItemTitle.split(" - ")[0].trim();

  return {
    productTitle,
    size: getAttribute(attributes, ["Size"]) || getNoteLineValue(note, ["Size"]),
    frameColor: getAttribute(attributes, ["Frame color", "Frame Color"]) || getNoteLineValue(note, ["Frame color"]),
    tvSize: normalizeTvSize(getAttribute(attributes, ["TV size", "TV Size"]) || getNoteLineValue(note, ["TV size"])),
    tvAvailability: getAttribute(attributes, ["TV availability", "TV Availability"]) || getNoteLineValue(note, ["TV availability"]),
    lighting: getAttribute(attributes, ["Lighting type", "Lighting"]) || getNoteLineValue(note, ["Lighting"]),
    lightColor: normalizeOptionalSelect(getAttribute(attributes, ["Light color", "Light Color"]) || getNoteLineValue(note, ["Light color"])),
    referralCode: normalizeReferralCode(getAttribute(attributes, ["Referral / discount code", "Referral code", "Referral Code"]) || getNoteLineValue(note, ["Referral / discount code", "Referral code"])),
  };
}

function getLineItemAttributes(item: Record<string, unknown>) {
  const attributes: string[] = [];
  const possibleArrays = [item.properties, item.custom_attributes, item.note_attributes];

  possibleArrays.forEach((possibleArray) => {
    if (!Array.isArray(possibleArray)) {
      return;
    }

    possibleArray.forEach((entry) => {
      if (!isRecord(entry)) {
        return;
      }

      const key = asString(entry.name) || asString(entry.key);
      const value = asString(entry.value);

      if (key && value) {
        attributes.push(`${key}: ${value}`);
      }
    });
  });

  return attributes;
}

function formatLineItems(payload: Record<string, unknown>) {
  const lineItems = getRecordValue(payload, "line_items");

  if (!Array.isArray(lineItems)) {
    return "";
  }

  return lineItems
    .filter(isRecord)
    .map((item, index) => {
      const title = getNestedString(item, "title") || getNestedString(item, "name") || `Item ${index + 1}`;
      const quantity = asString(item.quantity);
      const attributes = getLineItemAttributes(item);
      const details = [
        `${index + 1}. ${title}${quantity ? ` x ${quantity}` : ""}`,
        ...attributes.map((attribute) => `   - ${attribute}`),
      ];

      return details.join("\n");
    })
    .join("\n");
}

function formatNoteAttributes(payload: Record<string, unknown>) {
  const noteAttributes = getRecordValue(payload, "note_attributes");

  if (!Array.isArray(noteAttributes)) {
    return "";
  }

  return noteAttributes
    .filter(isRecord)
    .map((attribute) => {
      const key = asString(attribute.name) || asString(attribute.key);
      const value = asString(attribute.value);
      return key && value ? `${key}: ${value}` : "";
    })
    .filter(Boolean)
    .join("\n");
}

function getProductConfiguration(payload: Record<string, unknown>) {
  const lineItems = formatLineItems(payload);
  const noteAttributes = formatNoteAttributes(payload);
  const note = getNestedString(payload, "note");

  return [
    lineItems ? `Line items:\n${lineItems}` : "",
    noteAttributes ? `Attributes:\n${noteAttributes}` : "",
    note ? `Shopify note:\n${note}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

function getShopifyShop() {
  return process.env.SHOPIFY_SHOP?.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "") || "";
}

function getShopifyOrderLink(orderIds: string[]) {
  const shop = getShopifyShop();
  const numericId = orderIds.map((id) => idFromGid(id) || id).find((id) => /^\d+$/.test(id));

  if (!shop || !numericId) {
    return "";
  }

  return `https://${shop}/admin/orders/${numericId}`;
}

function buildNotes(lines: Array<[string, string | number | undefined]>) {
  return lines
    .map(([label, value]) => {
      const stringValue = asString(value);
      return stringValue ? `${label}: ${stringValue}` : "";
    })
    .filter(Boolean)
    .join("\n");
}

function appendUniqueNotes(existingNotes: unknown, newNotes: string) {
  const existing = asString(existingNotes);
  const linesToAdd = newNotes
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !existing.includes(line));

  if (linesToAdd.length === 0) {
    return existing;
  }

  return [existing, linesToAdd.join("\n")].filter(Boolean).join("\n");
}

async function findOrderByIds(fieldNamesToSearch: string[], legacyLabels: string[], ids: string[]) {
  const env = getAirtableCommerceEnv();
  const orderFieldNames = await getTableFieldNames(env.ordersTableId);
  const idValues = unique(ids);
  const formula = orFormula([
    ...fieldNamesToSearch.map((fieldName) => exactIdFieldFormula(fieldName, idValues, orderFieldNames)),
    legacyNotesIdFormula(
      legacyLabels,
      idValues,
      AIRTABLE_COMMERCE_FIELDS.orders.notes,
      orderFieldNames
    ),
  ]);

  return findRecord(env.ordersTableId, formula);
}

async function findOrderByInvoiceUrl(invoiceUrl: string) {
  const env = getAirtableCommerceEnv();
  const orderFields = AIRTABLE_COMMERCE_FIELDS.orders;
  const orderFieldNames = await getTableFieldNames(env.ordersTableId);
  const formula = orFormula([
    exactExistingFieldFormula(orderFields.shopifyInvoiceUrl, invoiceUrl, orderFieldNames),
    exactExistingFieldFormula(orderFields.externalPaymentUrl, invoiceUrl, orderFieldNames),
  ]);

  return findRecord(env.ordersTableId, formula);
}

async function findOrderByCheckoutIds(checkoutIds: string[]) {
  const env = getAirtableCommerceEnv();
  const orderFields = AIRTABLE_COMMERCE_FIELDS.orders;
  const formula = orFormula(
    unique(checkoutIds).map((checkoutId) => containsFormula(
      orderFields.customSpecs,
      `MIRRAI Checkout ID: ${checkoutId}`
    ))
  );

  return findRecord(env.ordersTableId, formula);
}

async function findOpenDraftOrderByConfiguration(configuration: ProductConfigurationFields) {
  const env = getAirtableCommerceEnv();
  const orderFields = AIRTABLE_COMMERCE_FIELDS.orders;
  const orderFieldNames = await getTableFieldNames(env.ordersTableId);

  if (
    !configuration.size
    || !configuration.frameColor
    || !configuration.tvSize
    || !configuration.tvAvailability
    || !configuration.lighting
  ) {
    return null;
  }

  const formula = andFormula([
    exactExistingFieldFormula(orderFields.source, ORDER_SOURCES.websiteCheckout, orderFieldNames),
    exactExistingFieldFormula(orderFields.paymentStatus, ORDER_PAYMENT_STATUSES.unpaid, orderFieldNames),
    exactExistingFieldFormula(orderFields.orderStatus, ORDER_STATUSES.awaitingPayment, orderFieldNames),
    blankExistingFieldFormula(orderFields.shopifyOrderId, orderFieldNames),
    exactExistingFieldFormula(orderFields.size, configuration.size, orderFieldNames),
    exactExistingFieldFormula(orderFields.frameColor, configuration.frameColor, orderFieldNames),
    exactExistingFieldFormula(orderFields.tvSize, configuration.tvSize, orderFieldNames),
    exactExistingFieldFormula(orderFields.tvAvailability, configuration.tvAvailability, orderFieldNames),
    exactExistingFieldFormula(orderFields.lighting, configuration.lighting, orderFieldNames),
    configuration.lightColor
      ? exactExistingFieldFormula(orderFields.lightColor, configuration.lightColor, orderFieldNames)
      : blankExistingFieldFormula(orderFields.lightColor, orderFieldNames),
    configuration.referralCode
      ? exactExistingFieldFormula(orderFields.referralCode, configuration.referralCode, orderFieldNames)
      : blankExistingFieldFormula(orderFields.referralCode, orderFieldNames),
  ]);
  const records = await findRecords(
    env.ordersTableId,
    formula,
    1,
    { field: "Order Created Date", direction: "desc" }
  );

  return records[0] || null;
}

async function findPaymentByOrderIds(orderIds: string[]) {
  const env = getAirtableCommerceEnv();
  const formula = idSearchFormula(
    ["Shopify Order ID", "Shopify Order GID"],
    unique(orderIds),
    AIRTABLE_COMMERCE_FIELDS.payments.notes
  );

  return findRecord(env.paymentsTableId, formula);
}

async function findPaymentByRefundIds(refundIds: string[]) {
  const env = getAirtableCommerceEnv();
  const formula = idSearchFormula(
    ["Shopify Refund ID", "Shopify Refund GID"],
    unique(refundIds),
    AIRTABLE_COMMERCE_FIELDS.payments.notes
  );

  return findRecord(env.paymentsTableId, formula);
}

async function upsertClient(customer: CustomerInfo) {
  const env = getAirtableCommerceEnv();

  if (!env.clientsTableId || (!customer.name && !customer.email && !customer.phone)) {
    return null;
  }

  const fields = AIRTABLE_COMMERCE_FIELDS.clients;
  const filters = [
    customer.email ? exactLowerFormula(fields.email, customer.email) : "",
    customer.phone ? exactFormula(fields.phone, customer.phone) : "",
  ].filter(Boolean);
  const existing = filters.length > 0 ? await findRecord(env.clientsTableId, orFormula(filters)) : null;
  const recordFields = {
    [fields.name]: customer.name || customer.email || customer.phone,
    [fields.email]: customer.email,
    [fields.phone]: customer.phone,
  };

  if (existing) {
    return updateRecord(env.clientsTableId, existing.id, recordFields);
  }

  return createRecord(env.clientsTableId, recordFields);
}

async function findProductRecordId(productTitle: string) {
  const normalizedTitle = productTitle.trim().toLowerCase();

  if (!normalizedTitle) {
    return null;
  }

  const cached = productRecordIdCache.get(normalizedTitle);

  if (cached) {
    return cached;
  }

  const promise = (async () => {
    const env = getAirtableCommerceEnv();
    const productNameField = AIRTABLE_COMMERCE_FIELDS.products.name;
    const record = await findRecord(env.productsTableId, exactLowerFormula(productNameField, productTitle));
    return record?.id || null;
  })();

  productRecordIdCache.set(normalizedTitle, promise);
  return promise;
}

function getLinkedClientIds(order: AirtableRecord | null, client: AirtableRecord | null) {
  if (client) {
    return [client.id];
  }

  const linkedClients = order?.fields[AIRTABLE_COMMERCE_FIELDS.orders.client];
  return Array.isArray(linkedClients) ? linkedClients.map(asString).filter(Boolean) : [];
}

function getInternalDetailsField(
  fieldNames: Set<string>,
  existingOrder: AirtableRecord,
  details: string
) {
  const orderFields = AIRTABLE_COMMERCE_FIELDS.orders;

  if (fieldNames.size === 0 || fieldNames.has(orderFields.notes)) {
    return {
      [orderFields.notes]: appendUniqueNotes(existingOrder.fields[orderFields.notes], details),
    };
  }

  return {
    [orderFields.customSpecs]: appendUniqueNotes(
      existingOrder.fields[orderFields.customSpecs],
      details
    ),
  };
}

function buildCancellationDetails(payload: Record<string, unknown>) {
  return buildNotes([
    ["Shopify cancellation", "Received"],
    ["Cancelled at", getNestedString(payload, "cancelled_at") || getNestedString(payload, "closed_at")],
    ["Cancel reason", getCancellationReason(payload)],
    ["Financial status", getFinancialStatus(payload)],
    ["Cancel note", getNestedString(payload, "note")],
  ]);
}

function buildRefundDetails(
  payload: Record<string, unknown>,
  refundIds: string[],
  orderIds: string[],
  refundAmount: number | undefined,
  currency: string
) {
  return buildNotes([
    ["Shopify refund", "Received"],
    ["Shopify Refund ID", refundIds.find((id) => /^\d+$/.test(id)) || refundIds[0]],
    ["Shopify Refund GID", refundIds.find((id) => id.startsWith("gid://"))],
    ["Shopify Order ID", orderIds.find((id) => /^\d+$/.test(id)) || orderIds[0]],
    ["Refund amount", refundAmount],
    ["Currency", currency],
    ["Refund date", getRefundDate(payload)],
    ["Refund reason", getRefundReason(payload)],
  ]);
}

export async function syncDraftOrderToAirtable(payload: Record<string, unknown>) {
  const env = getAirtableCommerceEnv();
  const orderFields = AIRTABLE_COMMERCE_FIELDS.orders;
  const draftOrderIds = getDraftOrderIds(payload);

  if (draftOrderIds.length === 0) {
    throw new Error("Shopify draft order webhook did not include a draft order ID.");
  }

  const invoiceUrl = getInvoiceUrl(payload);
  const existingOrder = await findOrderByIds(
    [orderFields.shopifyDraftOrderId],
    ["Shopify Draft Order ID", "Shopify Draft Order GID"],
    draftOrderIds
  ) || await findOrderByInvoiceUrl(invoiceUrl);
  const customer = getCustomerInfo(payload);
  const client = await upsertClient(customer);
  const totalPrice = getTotalPrice(payload);
  const configuration = getProductConfiguration(payload);
  const configurationFields = getProductConfigurationFields(payload);
  const productRecordId = await findProductRecordId(configurationFields.productTitle);
  const fields = {
    [orderFields.orderStatus]: ORDER_STATUSES.awaitingPayment,
    [orderFields.paymentStatus]: ORDER_PAYMENT_STATUSES.unpaid,
    [orderFields.productModel]: productRecordId ? [productRecordId] : undefined,
    [orderFields.size]: configurationFields.size || undefined,
    [orderFields.frameColor]: configurationFields.frameColor || undefined,
    [orderFields.tvSize]: configurationFields.tvSize || undefined,
    [orderFields.tvAvailability]: configurationFields.tvAvailability || undefined,
    [orderFields.lighting]: configurationFields.lighting || undefined,
    [orderFields.lightColor]: configurationFields.lightColor || undefined,
    [orderFields.referralCode]: configurationFields.referralCode || undefined,
    [orderFields.shopifyDraftOrderId]: primaryShopifyId(draftOrderIds) || undefined,
    [orderFields.shopifyInvoiceUrl]: invoiceUrl || undefined,
    [orderFields.externalPaymentUrl]: invoiceUrl || undefined,
    [orderFields.source]: getOrderSource(payload),
    [orderFields.totalPrice]: totalPrice,
    [orderFields.customSpecs]: configuration || undefined,
    [orderFields.client]: client ? [client.id] : undefined,
  };
  const order = existingOrder
    ? await updateRecord(env.ordersTableId, existingOrder.id, fields)
    : await createRecord(env.ordersTableId, fields);

  return {
    action: existingOrder ? "updated" : "created",
    orderRecordId: order.id,
    draftOrderIds,
  };
}

export async function syncPaidOrderToAirtable(payload: Record<string, unknown>) {
  const env = getAirtableCommerceEnv();
  const orderFields = AIRTABLE_COMMERCE_FIELDS.orders;
  const paymentFields = AIRTABLE_COMMERCE_FIELDS.payments;
  const orderIds = getOrderIds(payload);
  const draftOrderIds = getPaidOrderDraftIds(payload);
  const checkoutIds = getMirraiCheckoutIds(payload);
  const invoiceUrl = getInvoiceUrl(payload);
  const configuration = getProductConfiguration(payload);
  const configurationFields = getProductConfigurationFields(payload);

  if (orderIds.length === 0) {
    throw new Error("Shopify paid order webhook did not include an order ID.");
  }

  const orderByOrderId = await findOrderByIds(
    [orderFields.shopifyOrderId],
    ["Shopify Order ID", "Shopify Order GID"],
    orderIds
  );
  const existingOrder = orderByOrderId || await findOrderByIds(
    [orderFields.shopifyDraftOrderId],
    ["Shopify Draft Order ID", "Shopify Draft Order GID"],
    draftOrderIds
  ) || await findOrderByInvoiceUrl(invoiceUrl)
    || await findOrderByCheckoutIds(checkoutIds)
    || await findOpenDraftOrderByConfiguration(configurationFields);
  const customer = getCustomerInfo(payload);
  const client = await upsertClient(customer);
  const linkedClientIds = getLinkedClientIds(existingOrder, client);
  const totalPrice = getTotalPrice(payload);
  const orderTotalPrice = asNumber(existingOrder?.fields[orderFields.totalPrice]) ?? totalPrice;
  const paymentMethod = getPaymentMethod(payload);
  const orderLink = getShopifyOrderLink(orderIds);
  const productRecordId = await findProductRecordId(configurationFields.productTitle);
  const orderUpdateFields = {
    [orderFields.orderStatus]: ORDER_STATUSES.activeInProduction,
    [orderFields.paymentStatus]: ORDER_PAYMENT_STATUSES.paid,
    [orderFields.paymentMethod]: paymentMethod,
    [orderFields.shopifyOrderLink]: orderLink,
    [orderFields.productModel]: productRecordId ? [productRecordId] : undefined,
    [orderFields.size]: configurationFields.size || undefined,
    [orderFields.frameColor]: configurationFields.frameColor || undefined,
    [orderFields.tvSize]: configurationFields.tvSize || undefined,
    [orderFields.tvAvailability]: configurationFields.tvAvailability || undefined,
    [orderFields.lighting]: configurationFields.lighting || undefined,
    [orderFields.lightColor]: configurationFields.lightColor || undefined,
    [orderFields.referralCode]: configurationFields.referralCode || undefined,
    [orderFields.shopifyOrderId]: primaryShopifyId(orderIds) || undefined,
    [orderFields.shopifyDraftOrderId]: primaryShopifyId(draftOrderIds) || undefined,
    [orderFields.shopifyInvoiceUrl]: invoiceUrl || undefined,
    [orderFields.externalPaymentUrl]: invoiceUrl || undefined,
    [orderFields.source]: getOrderSource(payload),
    [orderFields.totalPrice]: orderTotalPrice,
    [orderFields.customSpecs]: configuration || undefined,
    [orderFields.client]: linkedClientIds.length > 0 ? linkedClientIds : undefined,
  };
  const order = existingOrder
    ? await updateRecord(env.ordersTableId, existingOrder.id, orderUpdateFields)
    : await createRecord(env.ordersTableId, orderUpdateFields);
  const paymentNotes = buildNotes([
    ["Shopify Order ID", orderIds.find((id) => /^\d+$/.test(id)) || orderIds[0]],
    ["Shopify Order GID", orderIds.find((id) => id.startsWith("gid://"))],
    ["Shopify Draft Order ID", draftOrderIds.find((id) => /^\d+$/.test(id))],
    ["Currency", getCurrency(payload)],
    ["Payment Method", paymentMethod],
  ]);
  const existingPayment = await findPaymentByOrderIds(orderIds);
  const paymentRecordFields = {
    [paymentFields.order]: [order.id],
    [paymentFields.client]: getLinkedClientIds(order, client),
    [paymentFields.paymentDate]: getPaymentDate(payload),
    [paymentFields.amount]: totalPrice,
    [paymentFields.paymentMethod]: paymentMethod,
    [paymentFields.paymentStatus]: PAYMENT_RECORD_STATUSES.paid,
    [paymentFields.paymentType]: PAYMENT_TYPES.shopify,
    [paymentFields.notes]: existingPayment
      ? appendUniqueNotes(existingPayment.fields[paymentFields.notes], paymentNotes)
      : paymentNotes,
  };
  const payment = existingPayment
    ? await updateRecord(env.paymentsTableId, existingPayment.id, paymentRecordFields)
    : await createRecord(env.paymentsTableId, paymentRecordFields);

  return {
    orderAction: existingOrder ? "updated" : "created",
    paymentAction: existingPayment ? "updated" : "created",
    orderRecordId: order.id,
    paymentRecordId: payment.id,
    orderIds,
    draftOrderIds,
  };
}

export async function syncCancelledOrderToAirtable(payload: Record<string, unknown>) {
  const env = getAirtableCommerceEnv();
  const orderFields = AIRTABLE_COMMERCE_FIELDS.orders;
  const orderIds = getOrderIds(payload);

  if (orderIds.length === 0) {
    throw new Error("Shopify cancelled order webhook did not include an order ID.");
  }

  const existingOrder = await findOrderByIds(
    [orderFields.shopifyOrderId],
    ["Shopify Order ID", "Shopify Order GID"],
    orderIds
  );

  if (!existingOrder) {
    return {
      orderAction: "skipped",
      reason: "order_not_found",
      orderIds,
    };
  }

  const orderFieldNames = await getTableFieldNames(env.ordersTableId);
  const cancellationDetails = buildCancellationDetails(payload);
  const orderUpdateFields = {
    [orderFields.orderStatus]: await safeSingleSelectValue(
      env.ordersTableId,
      orderFields.orderStatus,
      ORDER_STATUSES.cancelled
    ),
    [orderFields.paymentStatus]: await getCancelledOrderPaymentStatus(payload),
    [orderFields.shopifyOrderId]: primaryShopifyId(orderIds) || undefined,
    ...getInternalDetailsField(orderFieldNames, existingOrder, cancellationDetails),
  };
  const order = await updateRecord(env.ordersTableId, existingOrder.id, orderUpdateFields);

  return {
    orderAction: "updated",
    orderRecordId: order.id,
    orderIds,
  };
}

export async function syncRefundToAirtable(payload: Record<string, unknown>) {
  const env = getAirtableCommerceEnv();
  const orderFields = AIRTABLE_COMMERCE_FIELDS.orders;
  const paymentFields = AIRTABLE_COMMERCE_FIELDS.payments;
  const orderIds = getRefundOrderIds(payload);
  const refundIds = getRefundIds(payload);

  if (orderIds.length === 0) {
    throw new Error("Shopify refund webhook did not include an order ID.");
  }

  if (refundIds.length === 0) {
    throw new Error("Shopify refund webhook did not include a refund ID.");
  }

  const existingOrder = await findOrderByIds(
    [orderFields.shopifyOrderId],
    ["Shopify Order ID", "Shopify Order GID"],
    orderIds
  );

  if (!existingOrder) {
    return {
      orderAction: "skipped",
      paymentAction: "skipped",
      reason: "order_not_found",
      orderIds,
      refundIds,
    };
  }

  const refundAmount = getRefundAmount(payload);
  const currency = getRefundCurrency(payload);
  const orderFieldNames = await getTableFieldNames(env.ordersTableId);
  const refundDetails = buildRefundDetails(payload, refundIds, orderIds, refundAmount, currency);
  const orderUpdateFields = {
    [orderFields.paymentStatus]: await getRefundOrderPaymentStatus(
      payload,
      existingOrder,
      refundAmount
    ),
    [orderFields.shopifyOrderId]: primaryShopifyId(orderIds) || undefined,
    ...getInternalDetailsField(orderFieldNames, existingOrder, refundDetails),
  };
  const order = await updateRecord(env.ordersTableId, existingOrder.id, orderUpdateFields);
  const existingPayment = await findPaymentByRefundIds(refundIds);
  const paymentRecordFields = {
    [paymentFields.order]: [order.id],
    [paymentFields.client]: getLinkedClientIds(order, null),
    [paymentFields.paymentDate]: getRefundDate(payload),
    [paymentFields.amount]: refundAmount,
    [paymentFields.paymentMethod]: await safeSingleSelectValue(
      env.paymentsTableId,
      paymentFields.paymentMethod,
      getPaymentMethod(payload),
      ["Shopify Payment", "Other"]
    ),
    [paymentFields.paymentStatus]: await safeSingleSelectValue(
      env.paymentsTableId,
      paymentFields.paymentStatus,
      PAYMENT_RECORD_STATUSES.refunded
    ),
    [paymentFields.paymentType]: await safeSingleSelectValue(
      env.paymentsTableId,
      paymentFields.paymentType,
      PAYMENT_TYPES.refund
    ),
    [paymentFields.notes]: existingPayment
      ? appendUniqueNotes(existingPayment.fields[paymentFields.notes], refundDetails)
      : refundDetails,
  };
  const payment = existingPayment
    ? await updateRecord(env.paymentsTableId, existingPayment.id, paymentRecordFields)
    : await createRecord(env.paymentsTableId, paymentRecordFields);

  return {
    orderAction: "updated",
    paymentAction: existingPayment ? "updated" : "created",
    orderRecordId: order.id,
    paymentRecordId: payment.id,
    orderIds,
    refundIds,
  };
}
