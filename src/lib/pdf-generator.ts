import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { Donation } from '@/models/Donation';

// Helper function to convert amount to words (simplified version)
function convertAmountToWords(amount: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 
                'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  if (amount === 0) return 'Zero Only';
  
  let words = '';
  
  // Handle thousands
  if (amount >= 1000) {
    let thousands = Math.floor(amount / 1000);
    if (thousands >= 100) {
      words += ones[Math.floor(thousands / 100)] + ' Hundred ';
      thousands %= 100;
    }
    if (thousands >= 20) {
      words += tens[Math.floor(thousands / 10)] + ' ';
      thousands %= 10;
    }
    if (thousands > 0) {
      words += ones[thousands] + ' ';
    }
    words += 'Thousand ';
    amount %= 1000;
  }
  
  // Handle hundreds
  if (amount >= 100) {
    words += ones[Math.floor(amount / 100)] + ' Hundred ';
    amount %= 100;
  }
  
  // Handle tens and ones
  if (amount >= 20) {
    words += tens[Math.floor(amount / 10)] + ' ';
    amount %= 10;
  }
  
  if (amount > 0) {
    words += ones[amount] + ' ';
  }
  
  return words.trim() + ' Only';
}

export interface MemberIdCardData {
  name: string;
  memberId: string;
  photo?: string;
  joinDate: Date;
  validUntil: Date;
}

export interface DonationReceiptData {
  receiptNumber: string;
  donorName: string;
  amount: number;
  paymentMethod: string;
  purpose: string;
  date: Date;
  transactionId?: string;
}

export interface AppointmentLetterData {
  memberName: string;
  memberId: string;
  position: string;
  appointmentDate: Date;
  validFrom: Date;
  validUntil: Date;
}

interface Member {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  membershipNumber?: string;
  membershipType: string;
  joinedAt: Date;
  photo?: string;
}

interface Donation {
  _id: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  amount: number;
  donationType: string;
  paymentMethod: string;
  transactionId?: string;
  createdAt: Date;
  status: string;
}

export async function generateIdCard(member: Member): Promise<Buffer> {
  try {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [85.6, 53.98] // Standard ID card size
    });

    // Set background color
    pdf.setFillColor(240, 248, 255);
    pdf.rect(0, 0, 85.6, 53.98, 'F');

    // Header
    pdf.setFillColor(37, 99, 235);
    pdf.rect(0, 0, 85.6, 12, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text('HOPE FOUNDATION', 5, 6);
    pdf.text('MEMBER ID CARD', 5, 9);

    // Member photo placeholder (if no photo, show initials)
    pdf.setFillColor(200, 200, 200);
    pdf.rect(5, 15, 15, 18, 'F');
    
    if (member.photo) {
      // In a real implementation, you would load and add the actual photo
      // pdf.addImage(member.photo, 'JPEG', 5, 15, 15, 18);
    } else {
      // Display initials
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      const initials = `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`;
      pdf.text(initials, 12.5, 25, { align: 'center' });
    }

    // Member details
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${member.firstName} ${member.lastName}`, 22, 18);
    
    pdf.setFont('helvetica', 'normal');
    pdf.text(`ID: ${member.membershipNumber || 'N/A'}`, 22, 22);
    pdf.text(`Type: ${member.membershipType}`, 22, 26);
    pdf.text(`Phone: ${member.phone}`, 22, 30);
    pdf.text(`Joined: ${member.joinedAt.toLocaleDateString('en-IN')}`, 22, 34);

    // Generate QR code
    const qrData = JSON.stringify({
      id: member._id,
      name: `${member.firstName} ${member.lastName}`,
      membershipNumber: member.membershipNumber,
      type: member.membershipType
    });

    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      width: 60,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Add QR code to PDF
    pdf.addImage(qrCodeDataURL, 'PNG', 60, 15, 20, 20);

    // Footer
    pdf.setFillColor(37, 99, 235);
    pdf.rect(0, 40, 85.6, 13.98, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(5);
    pdf.text('www.hopefoundation.org', 5, 44);
    pdf.text('Valid for official identification', 5, 47);
    pdf.text(`Issue Date: ${new Date().toLocaleDateString('en-IN')}`, 5, 50);

    return Buffer.from(pdf.output('arraybuffer'));
  } catch (error) {
    console.error('Error generating ID card:', error);
    throw new Error('Failed to generate ID card');
  }
}

export async function generateAppointmentLetter(member: Member): Promise<Buffer> {
  try {
    const pdf = new jsPDF();

    // Header
    pdf.setFillColor(37, 99, 235);
    pdf.rect(0, 0, 210, 30, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('HOPE FOUNDATION', 105, 15, { align: 'center' });
    pdf.setFontSize(12);
    pdf.text('Appointment Letter', 105, 22, { align: 'center' });

    // Date and Letter No
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    pdf.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 20, 45);
    pdf.text(`Letter No: AL/${member.membershipNumber}/${new Date().getFullYear()}`, 20, 50);

    // Recipient details
    pdf.setFontSize(12);
    pdf.text(`To,`, 20, 65);
    pdf.text(`${member.firstName} ${member.lastName}`, 20, 72);
    pdf.text(`${member.address.street}`, 20, 79);
    pdf.text(`${member.address.city}, ${member.address.state} - ${member.address.pincode}`, 20, 86);

    // Subject
    pdf.setFont('helvetica', 'bold');
    pdf.text('Subject: Appointment as Member of Hope Foundation', 20, 105);

    // Content
    pdf.setFont('helvetica', 'normal');
    const content = [
      'Dear Member,',
      '',
      'We are pleased to inform you that you have been appointed as a member of Hope Foundation.',
      'Your membership details are as follows:',
      '',
      `Membership Number: ${member.membershipNumber}`,
      `Membership Type: ${member.membershipType}`,
      `Date of Joining: ${member.joinedAt.toLocaleDateString('en-IN')}`,
      '',
      'As a member of Hope Foundation, you are entitled to:',
      '• Participate in all foundation activities and events',
      '• Access to member-only resources and programs',
      '• Receive regular updates about our initiatives',
      '• Download official ID card and certificates',
      '',
      'We look forward to your active participation in our mission to create positive social impact.',
      '',
      'Welcome to the Hope Foundation family!',
      '',
      'Best regards,',
      '',
      'Dr. Amita Patel',
      'Founder & President',
      'Hope Foundation'
    ];

    let yPosition = 120;
    content.forEach(line => {
      pdf.text(line, 20, yPosition);
      yPosition += 6;
    });

    // Footer
    pdf.setFillColor(37, 99, 235);
    pdf.rect(0, 270, 210, 25, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8);
    pdf.text('Hope Foundation | www.hopefoundation.org | info@hopefoundation.org', 105, 282, { align: 'center' });

    return Buffer.from(pdf.output('arraybuffer'));
  } catch (error) {
    console.error('Error generating appointment letter:', error);
    throw new Error('Failed to generate appointment letter');
  }
}

export async function generateDonationReceipt(donation: Donation): Promise<Buffer> {
  try {
    console.log('Starting PDF generation for donation:', donation._id);
    
    // Validate donation data
    if (!donation || !donation._id) {
      throw new Error('Invalid donation data provided');
    }
    
    const pdf = new jsPDF();

    // White background
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, 210, 297, 'F');

    // Add watermark logo in background
    try {
      // Very light watermark in center - using light colors instead of opacity
      pdf.addImage('/logo-watermark.svg', 'SVG', 60, 80, 90, 120, undefined, 'NONE');
    } catch (logoError) {
      console.warn('Failed to add logo watermark:', logoError);
      // Fallback to light text watermark
      pdf.setTextColor(240, 240, 250);
      pdf.setFontSize(40);
      pdf.setFont('helvetica', 'bold');
      pdf.text('BSS', 105, 150, { 
        align: 'center', 
        angle: 45 
      });
    }

    // Modern header with organization branding
    pdf.setFillColor(59, 130, 246); // Blue header
    pdf.rect(0, 0, 210, 55, 'F');
    
    // Header content
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('BAWALIYA SEVA SANSTHAN', 105, 20, { align: 'center' });
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text('His Divine Grace A.C. Bhaktivedanta Swami Prabhupada', 105, 30, { align: 'center' });
    
    // Pink "Donation Receipt" badge
    pdf.setFillColor(236, 72, 153); // Pink
    pdf.rect(140, 35, 60, 15, 'F');
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Donation Receipt', 170, 44, { align: 'center' });

    // Receipt details section (yellow background)
    pdf.setFillColor(254, 249, 195); // Light yellow
    pdf.rect(10, 60, 190, 25, 'F');
    pdf.setDrawColor(251, 191, 36);
    pdf.setLineWidth(1);
    pdf.rect(10, 60, 190, 25, 'S');
    
    const receiptNumber = donation._id.toString().substring(0, 12).toUpperCase();
    const donationDate = donation.createdAt ? new Date(donation.createdAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN');
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text('BSS, Community Area, Your City, State, 123456', 15, 70);
    pdf.text('400049', 15, 77);
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('Donation Receipt No.', 130, 70);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`BSS-${receiptNumber}`, 130, 77);

    // Donor Details section (light purple background)
    pdf.setFillColor(243, 232, 255); // Light purple
    pdf.rect(10, 90, 120, 60, 'F');
    pdf.setDrawColor(168, 85, 247);
    pdf.setLineWidth(1);
    pdf.rect(10, 90, 120, 60, 'S');
    
    pdf.setFillColor(168, 85, 247); // Purple header
    pdf.rect(10, 90, 120, 15, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text('Donor Details', 70, 100, { align: 'center' });
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text(`Date: ${donationDate}`, 15, 115);
    pdf.text(`Name: ${donation.donorName || 'Anonymous Donor'}`, 15, 125);
    pdf.text('Donor PAN No: Not Available', 15, 135);
    pdf.text(`Mobile: ${donation.donorPhone || 'Not provided'}`, 15, 145);

    // Mode of Payment section (light purple background)
    pdf.setFillColor(243, 232, 255); // Light purple
    pdf.rect(135, 90, 65, 60, 'F');
    pdf.setDrawColor(168, 85, 247);
    pdf.setLineWidth(1);
    pdf.rect(135, 90, 65, 60, 'S');
    
    pdf.setFillColor(168, 85, 247); // Purple header
    pdf.rect(135, 90, 65, 15, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text('Mode of Payment', 167.5, 100, { align: 'center' });
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    const paymentMethod = donation.paymentMethod || 'Online';
    pdf.text(paymentMethod, 167.5, 125, { align: 'center' });

    // Payment Details section (light purple background)
    pdf.setFillColor(243, 232, 255); // Light purple
    pdf.rect(135, 155, 65, 35, 'F');
    pdf.setDrawColor(168, 85, 247);
    pdf.setLineWidth(1);
    pdf.rect(135, 155, 65, 35, 'S');
    
    pdf.setFillColor(168, 85, 247); // Purple header
    pdf.rect(135, 155, 65, 12, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.text('Payment Details', 167.5, 163, { align: 'center' });
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    const transactionId = donation.transactionId || `AUTO${receiptNumber.substring(0, 8)}`;
    pdf.text(transactionId, 167.5, 180, { align: 'center' });

    // Purpose of Donation section (light purple background)
    pdf.setFillColor(243, 232, 255); // Light purple
    pdf.rect(10, 155, 120, 35, 'F');
    pdf.setDrawColor(168, 85, 247);
    pdf.setLineWidth(1);
    pdf.rect(10, 155, 120, 35, 'S');
    
    pdf.setFillColor(168, 85, 247); // Purple header
    pdf.rect(10, 155, 120, 12, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.text('Purpose of Donation (Corpus / General / Others)', 70, 163, { align: 'center' });
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    const purpose = donation.donationType || 'General Donation';
    pdf.text(purpose, 70, 180, { align: 'center' });

    // Donation Amount section (light background)
    pdf.setFillColor(243, 232, 255); // Light purple
    pdf.rect(10, 195, 120, 25, 'F');
    pdf.setDrawColor(168, 85, 247);
    pdf.setLineWidth(1);
    pdf.rect(10, 195, 120, 25, 'S');
    
    pdf.setFillColor(168, 85, 247); // Purple header
    pdf.rect(10, 195, 120, 10, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.text('Donation Amount in Rupees', 70, 202, { align: 'center' });
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    const amount = Number(donation.amount) || 0;
    const amountInWords = convertAmountToWords(amount);
    pdf.text(amountInWords, 70, 215, { align: 'center' });

    // Amount in numbers (pink box)
    pdf.setFillColor(236, 72, 153); // Pink
    pdf.rect(135, 195, 65, 25, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.text('Rupees', 167.5, 202, { align: 'center' });
    pdf.setFontSize(16);
    pdf.text(`₹ ${amount.toLocaleString('en-IN')}/-`, 167.5, 215, { align: 'center' });

    // Registration details (yellow background)
    pdf.setFillColor(254, 249, 195); // Light yellow
    pdf.rect(10, 225, 190, 30, 'F');
    pdf.setDrawColor(251, 191, 36);
    pdf.setLineWidth(1);
    pdf.rect(10, 225, 190, 30, 'S');
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.text('Registered Office: Community Area, Your City - 400 049. Registered under Public Trust Act 1950,', 15, 235);
    pdf.text('vide Regn. No.: BSS-2179 (Bom). Unique Regn. No. (80G): AAATB0017PF20219', 15, 243);

    // Terms and Conditions section
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text('Please note Terms and Conditions (T&C):', 15, 265);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.text('• This donation receipt is an acknowledgement only and not for the purpose of claiming 80G deduction.', 15, 272);
    pdf.text('• Form No. 10BE, i.e., Certificate of donation under clause (ix) of sub-section (5) of section 80G of the', 15, 278);
    pdf.text('  Income Tax Act, 1961, will be issued to you as per provisions of Income-tax Act, 1961.', 15, 284);
    pdf.text('• For all types of donations, full legal name and address with PAN are required.', 15, 290);

    console.log('Converting PDF to buffer...');
    const pdfOutput = pdf.output('arraybuffer');
    const buffer = Buffer.from(pdfOutput);
    console.log('PDF buffer created, length:', buffer.length);
    
    if (buffer.length === 0) {
      throw new Error('PDF buffer is empty');
    }
    
    return buffer;
  } catch (error) {
    console.error('Error generating donation receipt:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      donationId: donation?._id?.toString() || 'No donation ID'
    });
    throw new Error(`Failed to generate donation receipt: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export class PDFGenerator {
  static async generateMemberIdCard(data: MemberIdCardData): Promise<ArrayBuffer> {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [85.6, 53.98] // Credit card size
    });

    // Background
    pdf.setFillColor(41, 128, 185);
    pdf.rect(0, 0, 85.6, 53.98, 'F');

    // NGO Name
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('HOPE FOUNDATION', 42.8, 8, { align: 'center' });

    // Member Photo placeholder (if provided)
    if (data.photo) {
      // Add photo logic here
      pdf.setFillColor(255, 255, 255);
      pdf.rect(5, 12, 20, 25, 'F');
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(6);
      pdf.text('PHOTO', 15, 25, { align: 'center' });
    }

    // Member details
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Name: ${data.name}`, 28, 18);
    pdf.text(`ID: ${data.memberId}`, 28, 23);
    pdf.text(`Joined: ${data.joinDate.toLocaleDateString()}`, 28, 28);
    pdf.text(`Valid Until: ${data.validUntil.toLocaleDateString()}`, 28, 33);

    // QR Code
    try {
      const qrCodeDataURL = await QRCode.toDataURL(
        `NGO_MEMBER:${data.memberId}:${data.name}`,
        { width: 60, margin: 1 }
      );
      pdf.addImage(qrCodeDataURL, 'PNG', 60, 12, 20, 20);
    } catch (error) {
      console.error('QR Code generation error:', error);
    }

    // Footer
    pdf.setFontSize(6);
    pdf.text('Authorized Member ID Card', 42.8, 48, { align: 'center' });

    return pdf.output('arraybuffer');
  }

  static async generateDonationReceipt(data: DonationReceiptData): Promise<ArrayBuffer> {
    const pdf = new jsPDF();

    // Header
    pdf.setFillColor(41, 128, 185);
    pdf.rect(0, 0, 210, 30, 'F');

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('HOPE FOUNDATION', 105, 15, { align: 'center' });
    pdf.setFontSize(12);
    pdf.text('Donation Receipt', 105, 22, { align: 'center' });

    // Receipt details
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DONATION RECEIPT', 105, 45, { align: 'center' });

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    const startY = 60;
    const lineHeight = 8;
    
    pdf.text(`Receipt Number: ${data.receiptNumber}`, 20, startY);
    pdf.text(`Date: ${data.date.toLocaleDateString()}`, 20, startY + lineHeight);
    pdf.text(`Donor Name: ${data.donorName}`, 20, startY + lineHeight * 2);
    pdf.text(`Amount: ₹${data.amount.toLocaleString()}`, 20, startY + lineHeight * 3);
    pdf.text(`Payment Method: ${data.paymentMethod}`, 20, startY + lineHeight * 4);
    pdf.text(`Purpose: ${data.purpose}`, 20, startY + lineHeight * 5);
    
    if (data.transactionId) {
      pdf.text(`Transaction ID: ${data.transactionId}`, 20, startY + lineHeight * 6);
    }

    // Amount in words (simplified)
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Amount in Words: ${this.numberToWords(data.amount)} Rupees Only`, 20, startY + lineHeight * 8);

    // Thank you note
    pdf.setFont('helvetica', 'italic');
    pdf.text('Thank you for your generous donation!', 105, startY + lineHeight * 12, { align: 'center' });

    // Footer
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.text('This is a computer generated receipt and does not require signature.', 105, 270, { align: 'center' });
    pdf.text('Hope Foundation | Reg. No: REG/2024/NGO/001', 105, 280, { align: 'center' });

    return pdf.output('arraybuffer');
  }

  static async generateAppointmentLetter(data: AppointmentLetterData): Promise<ArrayBuffer> {
    const pdf = new jsPDF();

    // Header
    pdf.setFillColor(41, 128, 185);
    pdf.rect(0, 0, 210, 40, 'F');

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('HOPE FOUNDATION', 105, 20, { align: 'center' });
    pdf.setFontSize(12);
    pdf.text('Making a Difference Together', 105, 30, { align: 'center' });

    // Letter content
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('APPOINTMENT LETTER', 105, 60, { align: 'center' });

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    const content = `
Date: ${data.appointmentDate.toLocaleDateString()}

Dear ${data.memberName},

We are pleased to inform you that you have been appointed as a member of Hope Foundation with the following details:

Member ID: ${data.memberId}
Position: ${data.position}
Appointment Date: ${data.appointmentDate.toLocaleDateString()}
Valid From: ${data.validFrom.toLocaleDateString()}
Valid Until: ${data.validUntil.toLocaleDateString()}

As a member of our organization, you are expected to:
• Participate actively in our programs and initiatives
• Uphold the values and mission of Hope Foundation
• Contribute to the betterment of society through your actions
• Maintain the dignity and reputation of the organization

We welcome you to our team and look forward to your valuable contributions to our cause.

Best regards,

Secretary
Hope Foundation`;

    const lines = content.split('\n');
    let yPosition = 80;
    
    lines.forEach(line => {
      if (line.trim() === '') {
        yPosition += 4;
      } else {
        pdf.text(line, 20, yPosition);
        yPosition += 6;
      }
    });

    // Signature section
    pdf.setFont('helvetica', 'bold');
    pdf.text('Authorized Signatory', 150, 250);
    pdf.line(150, 260, 190, 260);

    return pdf.output('arraybuffer');
  }

  private static numberToWords(num: number): string {
    // Simplified number to words conversion
    if (num === 0) return 'Zero';
    
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
    if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + this.numberToWords(num % 100) : '');
    if (num < 100000) return this.numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + this.numberToWords(num % 1000) : '');
    
    return num.toLocaleString();
  }
}
