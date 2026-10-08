/**
 * Broadcast & Notification Utilities for Stanbax Schools Ibadan
 * Enables automated WhatsApp notice dispatch and email broadcasting
 * directly to parent contact numbers collected during admissions.
 */

export function cleanWhatsAppNumber(phone: string): string {
  if (!phone) return '';
  // Remove all non-digits
  let digits = phone.replace(/[^0-9]/g, '');
  
  // Standardize Nigerian numbers
  if (digits.startsWith('0') && digits.length === 11) {
    // 08031234567 -> 2348031234567
    digits = '234' + digits.slice(1);
  } else if (digits.length === 10 && (digits.startsWith('7') || digits.startsWith('8') || digits.startsWith('9'))) {
    // 8031234567 -> 2348031234567
    digits = '234' + digits;
  }
  
  return digits;
}

export function formatPhoneNumberDisplay(phone: string): string {
  const cleaned = cleanWhatsAppNumber(phone);
  if (cleaned.startsWith('234') && cleaned.length === 13) {
    return `+234 ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }
  return phone;
}

export function replaceNoticePlaceholders(
  template: string,
  vars: {
    parentName: string;
    studentName: string;
    gradeLevel: string;
    noticeTitle: string;
    noticeContent: string;
    schoolName?: string;
  }
): string {
  const school = vars.schoolName || 'Stanbax Schools Ibadan';
  return template
    .replace(/\{ParentName\}/g, vars.parentName || 'Parent/Guardian')
    .replace(/\{StudentName\}/g, vars.studentName || 'Student')
    .replace(/\{GradeLevel\}/g, vars.gradeLevel || 'Enrolled Class')
    .replace(/\{NoticeTitle\}/g, vars.noticeTitle || 'Official School Notice')
    .replace(/\{NoticeContent\}/g, vars.noticeContent || '')
    .replace(/\{SchoolName\}/g, school);
}

export function buildWhatsAppLink(phone: string, message: string): string {
  const cleaned = cleanWhatsAppNumber(phone);
  if (!cleaned) return '';
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

export function buildMailtoLink(
  recipients: string[],
  subject: string,
  body: string,
  senderEmail: string = 'info@stanbax.edu.ng'
): string {
  const validEmails = recipients.filter(e => e && e.includes('@'));
  if (validEmails.length === 0) {
    return `mailto:${senderEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
  // Use BCC to safeguard parent privacy across broadcast dispatches
  return `mailto:${senderEmail}?bcc=${encodeURIComponent(validEmails.join(','))}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function generateVCardData(
  parents: Array<{
    parentName: string;
    phone: string;
    email: string;
    studentName: string;
    gradeLevel: string;
  }>
): string {
  let vcard = '';
  parents.forEach(p => {
    const cleaned = cleanWhatsAppNumber(p.phone);
    if (!cleaned) return;
    vcard += 'BEGIN:VCARD\r\n';
    vcard += 'VERSION:3.0\r\n';
    vcard += `FN:Stanbax Parent - ${p.parentName} (${p.studentName})\r\n`;
    vcard += `N:${p.parentName};;;\r\n`;
    vcard += `ORG:Stanbax Schools Parents (${p.gradeLevel})\r\n`;
    vcard += `TEL;TYPE=CELL,VOICE,MSG:+${cleaned}\r\n`;
    if (p.email) {
      vcard += `EMAIL;TYPE=INTERNET:${p.email}\r\n`;
    }
    vcard += `NOTE:Parent of ${p.studentName} (${p.gradeLevel}) - Registered during Stanbax Admissions\r\n`;
    vcard += 'END:VCARD\r\n';
  });
  return vcard;
}
