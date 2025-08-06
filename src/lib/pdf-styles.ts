// Helper function to create modern PDF styling utilities
export class ModernPDFStyles {
  static addGradient(pdf: any, x: number, y: number, width: number, height: number, startColor: [number, number, number], endColor: [number, number, number]) {
    // Simulate gradient with multiple rectangles
    const steps = 8;
    for (let i = 0; i < steps; i++) {
      const ratio = i / (steps - 1);
      const r = Math.round(startColor[0] + (endColor[0] - startColor[0]) * ratio);
      const g = Math.round(startColor[1] + (endColor[1] - startColor[1]) * ratio);
      const b = Math.round(startColor[2] + (endColor[2] - startColor[2]) * ratio);
      
      pdf.setFillColor(r, g, b);
      pdf.rect(x, y + (height * i / steps), width, height / steps, 'F');
    }
  }

  static addRoundedRect(pdf: any, x: number, y: number, width: number, height: number, radius: number = 3) {
    // Simulate rounded corners with multiple shapes
    pdf.rect(x + radius, y, width - 2 * radius, height, 'F');
    pdf.rect(x, y + radius, width, height - 2 * radius, 'F');
    
    // Corner circles (smaller radius for better performance)
    pdf.circle(x + radius, y + radius, radius, 'F');
    pdf.circle(x + width - radius, y + radius, radius, 'F');
    pdf.circle(x + radius, y + height - radius, radius, 'F');
    pdf.circle(x + width - radius, y + height - radius, radius, 'F');
  }

  static addShadow(pdf: any, x: number, y: number, width: number, height: number, offsetX: number = 1, offsetY: number = 1) {
    pdf.setFillColor(0, 0, 0);
    // Create opacity effect by using gray colors instead of transparency
    pdf.setFillColor(200, 200, 200);
    pdf.rect(x + offsetX, y + offsetY, width, height, 'F');
  }

  static addPattern(pdf: any, patternType: 'dots' | 'lines' | 'grid' = 'dots') {
    pdf.setFillColor(59, 130, 246);
    
    switch (patternType) {
      case 'dots':
        for (let i = 20; i < 200; i += 25) {
          for (let j = 20; j < 280; j += 25) {
            if ((i + j) % 50 === 0) {
              pdf.circle(i, j, 0.8, 'F');
            }
          }
        }
        break;
      
      case 'lines':
        pdf.setLineWidth(0.1);
        pdf.setDrawColor(59, 130, 246);
        for (let i = 0; i < 210; i += 30) {
          pdf.line(i, 0, i + 40, 297);
        }
        break;
      
      case 'grid':
        pdf.setLineWidth(0.1);
        pdf.setDrawColor(59, 130, 246);
        for (let i = 0; i < 210; i += 40) {
          pdf.line(i, 0, i, 297);
        }
        for (let j = 0; j < 297; j += 40) {
          pdf.line(0, j, 210, j);
        }
        break;
    }
  }
}
