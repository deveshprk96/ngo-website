import jsPDF from 'jspdf';
import QRCode from 'qrcode';

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
    const pdf = new jsPDF();

    // Header
    pdf.setFillColor(37, 99, 235);
    pdf.rect(0, 0, 210, 35, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.setFont('helvetica', 'bold');
    pdf.text('HOPE FOUNDATION', 105, 18, { align: 'center' });
    pdf.setFontSize(14);
    pdf.text('DONATION RECEIPT', 105, 28, { align: 'center' });

    // Receipt details
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(11);
    pdf.text(`Receipt No: ${donation._id.substring(0, 8).toUpperCase()}`, 20, 50);
    pdf.text(`Date: ${donation.createdAt.toLocaleDateString('en-IN')}`, 150, 50);

    // Donor details
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('Donor Details:', 20, 70);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(`Name: ${donation.donorName}`, 20, 80);
    pdf.text(`Email: ${donation.donorEmail}`, 20, 87);
    pdf.text(`Phone: ${donation.donorPhone}`, 20, 94);

    // Donation details table
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('Donation Details:', 20, 115);

    // Table headers
    pdf.setFillColor(240, 240, 240);
    pdf.rect(20, 125, 170, 8, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text('Description', 25, 131);
    pdf.text('Type', 80, 131);
    pdf.text('Payment Method', 120, 131);
    pdf.text('Amount (₹)', 160, 131);

    // Table content
    pdf.setFont('helvetica', 'normal');
    pdf.text('General Donation', 25, 142);
    pdf.text(donation.donationType, 80, 142);
    pdf.text(donation.paymentMethod, 120, 142);
    pdf.text(donation.amount.toLocaleString('en-IN'), 165, 142);

    // Transaction details
    if (donation.transactionId) {
      pdf.text(`Transaction ID: ${donation.transactionId}`, 20, 155);
    }
    pdf.text(`Status: ${donation.status}`, 20, 162);

    // Total amount box
    pdf.setFillColor(37, 99, 235);
    pdf.rect(120, 175, 70, 15, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text(`Total: ₹${donation.amount.toLocaleString('en-IN')}`, 155, 185, { align: 'center' });

    // Thank you message
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    const thankYouText = [
      'Thank you for your generous donation to Hope Foundation.',
      'Your contribution will help us continue our mission of creating positive social impact.',
      'This receipt serves as proof of your donation for tax purposes under Section 80G.',
      '',
      'With gratitude,',
      'Hope Foundation Team'
    ];

    let yPos = 210;
    thankYouText.forEach(line => {
      pdf.text(line, 20, yPos);
      yPos += 7;
    });

    // QR code for verification
    const qrData = JSON.stringify({
      receiptId: donation._id.substring(0, 8).toUpperCase(),
      amount: donation.amount,
      date: donation.createdAt.toISOString().split('T')[0],
      donor: donation.donorName
    });

    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      width: 80,
      margin: 1
    });

    pdf.addImage(qrCodeDataURL, 'PNG', 150, 200, 25, 25);

    // Footer
    pdf.setFillColor(37, 99, 235);
    pdf.rect(0, 270, 210, 25, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8);
    pdf.text('Hope Foundation | Registered under Section 12A & 80G | PAN: XXXXX0000X', 105, 282, { align: 'center' });

    return Buffer.from(pdf.output('arraybuffer'));
  } catch (error) {
    console.error('Error generating donation receipt:', error);
    throw new Error('Failed to generate donation receipt');
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
