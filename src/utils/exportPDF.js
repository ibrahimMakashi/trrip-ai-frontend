import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function exportItineraryToPDF(itinerary) {
  const doc = new jsPDF();
  const itineraryData = itinerary.itinerary || itinerary;
  const travelInfo = itinerary.travelInfo || {};

  doc.setFillColor(99, 102, 241);
  doc.rect(0, 0, 210, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(itinerary.tripTitle || itineraryData.tripTitle || 'Travel Itinerary', 20, 25);

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');

  let yPos = 55;

  doc.setFont('helvetica', 'bold');
  doc.text('Destination:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(itinerary.destination || itineraryData.destination || 'N/A', 60, yPos);
  yPos += 10;

  doc.setFont('helvetica', 'bold');
  doc.text('Dates:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(`${itinerary.startDate || 'N/A'} - ${itinerary.endDate || 'N/A'}`, 60, yPos);
  yPos += 10;

  if (itinerary.budget || itineraryData.budget) {
    doc.setFont('helvetica', 'bold');
    doc.text('Budget:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(itinerary.budget || itineraryData.budget, 60, yPos);
    yPos += 15;
  }

  const days = itineraryData.days || [];
  if (days.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Day-by-Day Itinerary', 20, yPos);
    yPos += 5;

    days.forEach((day) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(99, 102, 241);
      doc.text(`Day ${day.day}${day.date ? ` - ${day.date}` : ''}`, 20, yPos + 10);
      yPos += 15;

      doc.setTextColor(30, 41, 59);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);

      if (day.morning) {
        doc.setFont('helvetica', 'bold');
        doc.text('Morning:', 25, yPos);
        doc.setFont('helvetica', 'normal');
        const morningLines = doc.splitTextToSize(day.morning, 150);
        doc.text(morningLines, 50, yPos);
        yPos += morningLines.length * 5 + 3;
      }

      if (day.afternoon) {
        doc.setFont('helvetica', 'bold');
        doc.text('Afternoon:', 25, yPos);
        doc.setFont('helvetica', 'normal');
        const afternoonLines = doc.splitTextToSize(day.afternoon, 145);
        doc.text(afternoonLines, 55, yPos);
        yPos += afternoonLines.length * 5 + 3;
      }

      if (day.evening) {
        doc.setFont('helvetica', 'bold');
        doc.text('Evening:', 25, yPos);
        doc.setFont('helvetica', 'normal');
        const eveningLines = doc.splitTextToSize(day.evening, 150);
        doc.text(eveningLines, 50, yPos);
        yPos += eveningLines.length * 5 + 3;
      }

      if (day.notes) {
        doc.setFont('helvetica', 'italic');
        const noteLines = doc.splitTextToSize(`Note: ${day.notes}`, 160);
        doc.text(noteLines, 25, yPos);
        yPos += noteLines.length * 5 + 5;
      }

      yPos += 5;
    });
  }

  if (travelInfo.flights?.length > 0) {
    if (yPos > 200) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(99, 102, 241);
    doc.text('Flight Information', 20, yPos + 10);
    yPos += 15;

    autoTable(doc, {
      startY: yPos,
      head: [['Flight Details']],
      body: travelInfo.flights.map((f) => [
        typeof f === 'string' ? f : JSON.stringify(f),
      ]),
      theme: 'striped',
      headStyles: { fillColor: [99, 102, 241] },
    });
    yPos = doc.lastAutoTable.finalY + 10;
  }

  if (travelInfo.hotels?.length > 0) {
    if (yPos > 200) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(99, 102, 241);
    doc.text('Hotel Information', 20, yPos + 10);
    yPos += 15;

    autoTable(doc, {
      startY: yPos,
      head: [['Hotel Details']],
      body: travelInfo.hotels.map((h) => [
        typeof h === 'string' ? h : JSON.stringify(h),
      ]),
      theme: 'striped',
      headStyles: { fillColor: [139, 92, 246] },
    });
  }

  const fileName = `${(itinerary.tripTitle || 'itinerary').replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);
}
