const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP || "9779848303515";

interface ProjectInquiryData {
  projectName: string;
  businessType: string;
}

interface OrderData {
  productName: string;
  price?: string;
  size?: string;
  color?: string;
  customerAddress?: string;
}

/**
 * Generate a WhatsApp link for a project inquiry
 */
export function generateProjectInquiryLink(data: ProjectInquiryData): string {
  const message = `Hello Nishan! 👋\n\nI saw your *${data.projectName}* project and I'm interested in getting a similar website for my ${data.businessType}.\n\nCould we discuss the details?`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate a WhatsApp link for a general contact
 */
export function generateContactLink(customMessage?: string): string {
  const message =
    customMessage ||
    `Hello Nishan! 👋\n\nI found your portfolio and I'd like to discuss building a website for my business.\n\nCould you get back to me?`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate a WhatsApp link for a product order (demo sites)
 */
export function generateOrderLink(data: OrderData): string {
  let message = `Hello! 👋\n\nI'd like to order:\n*${data.productName}*`;
  if (data.price) message += `\nPrice: ${data.price}`;
  if (data.size) message += `\nSize: ${data.size}`;
  if (data.color) message += `\nColor: ${data.color}`;
  if (data.customerAddress) message += `\nDelivery address: ${data.customerAddress}`;
  message += `\n\nPlease confirm availability. Thank you!`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate a start-a-project link
 */
export function generateStartProjectLink(): string {
  const message = `Hello Nishan! 👋\n\nI'd like to start a project with you.\n\nI'm ready to fill out the brief form and discuss my requirements.`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}
