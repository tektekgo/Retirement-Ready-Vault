import jsPDF from 'jspdf';
import Papa from 'papaparse';
import html2canvas from 'html2canvas';
import { RetirementData, RetirementAnalysis } from '../types';

export const exportToPDF = (data: RetirementData, analysis: RetirementAnalysis): void => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('Retirement Ready Vault', 20, 20);
  doc.setFontSize(12);
  doc.text('Retirement Analysis Report', 20, 30);
  
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 40);
  
  let yPos = 50;
  
  doc.setFontSize(14);
  doc.text('Personal Information', 20, yPos);
  yPos += 10;
  doc.setFontSize(10);
  doc.text(`Current Age: ${data.personalInfo.age}`, 20, yPos);
  yPos += 6;
  if (data.personalInfo.spouseAge) {
    doc.text(`Spouse Age: ${data.personalInfo.spouseAge}`, 20, yPos);
    yPos += 6;
  }
  doc.text(`Target Retirement Age: ${data.personalInfo.targetRetirementAge}`, 20, yPos);
  yPos += 6;
  doc.text(`Risk Tolerance: ${data.personalInfo.riskTolerance}/10`, 20, yPos);
  yPos += 12;
  
  doc.setFontSize(14);
  doc.text('Monthly Expenses', 20, yPos);
  yPos += 10;
  doc.setFontSize(10);
  const totalEssential = Object.values(data.expenses.essential).reduce((a, b) => a + b, 0);
  const totalDiscretionary = Object.values(data.expenses.discretionary).reduce((a, b) => a + b, 0);
  doc.text(`Essential Expenses: $${totalEssential.toFixed(2)}`, 20, yPos);
  yPos += 6;
  doc.text(`Discretionary Expenses: $${totalDiscretionary.toFixed(2)}`, 20, yPos);
  yPos += 6;
  doc.text(`Total Monthly: $${(totalEssential + totalDiscretionary).toFixed(2)}`, 20, yPos);
  yPos += 12;
  
  doc.setFontSize(14);
  doc.text('Assets', 20, yPos);
  yPos += 10;
  doc.setFontSize(10);
  const totalAssets = Object.values(data.assets).reduce((a, b) => a + b, 0);
  doc.text(`Total Assets: $${totalAssets.toFixed(2)}`, 20, yPos);
  yPos += 6;
  doc.text(`401(k): $${data.assets.retirement401k.toFixed(2)}`, 20, yPos);
  yPos += 6;
  doc.text(`Traditional IRA: $${data.assets.iraTraditional.toFixed(2)}`, 20, yPos);
  yPos += 6;
  doc.text(`Roth IRA: $${data.assets.iraRoth.toFixed(2)}`, 20, yPos);
  yPos += 12;
  
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }
  
  doc.setFontSize(14);
  doc.text('Retirement Analysis', 20, yPos);
  yPos += 10;
  doc.setFontSize(10);
  doc.text(`Analysis Method: ${analysis.method.toUpperCase()}`, 20, yPos);
  yPos += 6;
  doc.text(`Readiness Score: ${analysis.readinessScore.toFixed(1)}%`, 20, yPos);
  yPos += 6;
  doc.text(`Projected Monthly Income: $${analysis.projectedMonthlyIncome.toFixed(2)}`, 20, yPos);
  yPos += 6;
  doc.text(`Required Monthly Income: $${analysis.requiredMonthlyIncome.toFixed(2)}`, 20, yPos);
  yPos += 6;
  doc.text(`Gap: $${analysis.gap.toFixed(2)}`, 20, yPos);
  yPos += 12;
  
  doc.setFontSize(14);
  doc.text('Recommendations', 20, yPos);
  yPos += 10;
  doc.setFontSize(10);
  analysis.recommendations.forEach((rec, index) => {
    const lines = doc.splitTextToSize(`${index + 1}. ${rec}`, 170);
    lines.forEach((line: string) => {
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(line, 20, yPos);
      yPos += 6;
    });
  });
  
  doc.save('retirement-analysis.pdf');
};

export const exportDashboardToPDF = async (dashboardElementId: string = 'dashboard-content'): Promise<void> => {
  const element = document.getElementById(dashboardElementId);
  if (!element) {
    console.error('Dashboard element not found');
    return;
  }

  try {
    // Show loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.id = 'pdf-export-loading';
    loadingIndicator.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      color: white;
      font-size: 18px;
    `;
    loadingIndicator.textContent = 'Generating PDF...';
    document.body.appendChild(loadingIndicator);

    // Capture the dashboard as an image
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      useCORS: true,
      logging: false,
      backgroundColor: '#f0f4f8', // Match the dashboard background
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    // Remove loading indicator
    document.body.removeChild(loadingIndicator);

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    const doc = new jsPDF('p', 'mm', 'a4');
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    doc.save('retirement-dashboard.pdf');
  } catch (error) {
    console.error('Error exporting dashboard to PDF:', error);
    alert('Failed to export dashboard. Please try again.');
  }
};

export const exportToCSV = (data: RetirementData, analysis: RetirementAnalysis): void => {
  const csvData = [
    ['Section', 'Field', 'Value'],
    ['Personal Info', 'Age', data.personalInfo.age],
    ['Personal Info', 'Spouse Age', data.personalInfo.spouseAge || 'N/A'],
    ['Personal Info', 'Target Retirement Age', data.personalInfo.targetRetirementAge],
    ['Personal Info', 'Risk Tolerance', data.personalInfo.riskTolerance],
    ['', '', ''],
    ['Essential Expenses', 'Housing', data.expenses.essential.housing],
    ['Essential Expenses', 'Utilities', data.expenses.essential.utilities],
    ['Essential Expenses', 'Food', data.expenses.essential.food],
    ['Essential Expenses', 'Healthcare', data.expenses.essential.healthcare],
    ['Essential Expenses', 'Insurance', data.expenses.essential.insurance],
    ['Essential Expenses', 'Debt Payments', data.expenses.essential.debtPayments],
    ['', '', ''],
    ['Discretionary Expenses', 'Entertainment', data.expenses.discretionary.entertainment],
    ['Discretionary Expenses', 'Travel', data.expenses.discretionary.travel],
    ['Discretionary Expenses', 'Dining', data.expenses.discretionary.dining],
    ['Discretionary Expenses', 'Hobbies', data.expenses.discretionary.hobbies],
    ['Discretionary Expenses', 'Other', data.expenses.discretionary.other],
    ['', '', ''],
    ['Assets', '401(k)', data.assets.retirement401k],
    ['Assets', 'Traditional IRA', data.assets.iraTraditional],
    ['Assets', 'Roth IRA', data.assets.iraRoth],
    ['Assets', 'Brokerage', data.assets.brokerage],
    ['Assets', 'Savings', data.assets.savings],
    ['Assets', 'Real Estate', data.assets.realEstate],
    ['Assets', 'Other', data.assets.other],
    ['', '', ''],
    ['Income Sources', 'Current Salary', data.incomeSources.currentSalary],
    ['Income Sources', 'Spouse Salary', data.incomeSources.spouseSalary || 'N/A'],
    ['Income Sources', 'Social Security (Self) Age', data.incomeSources.socialSecuritySelf.age],
    ['Income Sources', 'Social Security (Self) Benefit', data.incomeSources.socialSecuritySelf.monthlyBenefit],
    ['Income Sources', 'Social Security (Spouse) Age', data.incomeSources.socialSecuritySpouse?.age || 'N/A'],
    ['Income Sources', 'Social Security (Spouse) Benefit', data.incomeSources.socialSecuritySpouse?.monthlyBenefit || 'N/A'],
    ['Income Sources', 'Pension', data.incomeSources.pension || 'N/A'],
    ['Income Sources', 'Rental Income', data.incomeSources.rentalIncome || 'N/A'],
    ['Income Sources', 'Other Income', data.incomeSources.otherIncome || 'N/A'],
    ['', '', ''],
    ['Analysis', 'Method', analysis.method],
    ['Analysis', 'Readiness Score', `${analysis.readinessScore.toFixed(1)}%`],
    ['Analysis', 'Projected Monthly Income', `$${analysis.projectedMonthlyIncome.toFixed(2)}`],
    ['Analysis', 'Required Monthly Income', `$${analysis.requiredMonthlyIncome.toFixed(2)}`],
    ['Analysis', 'Gap', `$${analysis.gap.toFixed(2)}`],
    ['', '', ''],
    ['Recommendations', '', ''],
    ...analysis.recommendations.map((rec, index) => ['Recommendation', `${index + 1}`, rec]),
  ];
  
  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'retirement-data.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
