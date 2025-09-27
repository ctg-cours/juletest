document.addEventListener('DOMContentLoaded', () => {
    const interestForm = document.getElementById('interest-form');
    const resultOutput = document.getElementById('result-output');
    const exportPdfButton = document.getElementById('export-pdf');

    // Interest rates data from the provided image
    // Note: The rate for 2003 (12.75) seems like a typo and has been interpreted as 0.1275.
    const interestRates = [
        { startDate: '1950-01-01', endDate: '1995-12-26', rate: 0.12 },
        { startDate: '1995-12-26', endDate: '1996-08-05', rate: 0.12 },
        { startDate: '1996-08-05', endDate: '1996-08-18', rate: 0.14 },
        { startDate: '1996-08-19', endDate: '1996-10-21', rate: 0.105 },
        { startDate: '1996-10-21', endDate: '1997-12-31', rate: 0.105 },
        { startDate: '1998-01-01', endDate: '1998-12-31', rate: 0.123 },
        { startDate: '1999-01-01', endDate: '1999-12-31', rate: 0.1216 },
        { startDate: '2000-01-01', endDate: '2000-12-31', rate: 0.1326 },
        { startDate: '2001-01-01', endDate: '2001-12-31', rate: 0.123 },
        { startDate: '2002-01-01', endDate: '2002-12-31', rate: 0.1275 },
        { startDate: '2003-01-01', endDate: '2003-12-31', rate: 0.1275 }, // Assuming 0.1275, not 12.75
        { startDate: '2004-01-01', endDate: '2004-12-31', rate: 0.1188 },
        { startDate: '2005-01-01', endDate: '2005-12-31', rate: 0.099 },
        { startDate: '2006-01-01', endDate: '2006-12-31', rate: 0.0975 },
        { startDate: '2007-01-01', endDate: '2007-12-31', rate: 0.099 },
        { startDate: '2008-01-01', endDate: '2008-12-31', rate: 0.1 },
        { startDate: '2009-01-01', endDate: '2009-12-31', rate: 0.1125 },
        { startDate: '2010-01-01', endDate: '2010-12-31', rate: 0.1125 },
        { startDate: '2011-01-01', endDate: '2011-12-31', rate: 0.1125 },
        { startDate: '2012-01-01', endDate: '2012-12-31', rate: 0.105 },
        { startDate: '2013-01-01', endDate: '2013-12-31', rate: 0.097 },
        { startDate: '2014-01-01', endDate: '2014-12-31', rate: 0.087 },
        { startDate: '2015-01-01', endDate: '2015-12-31', rate: 0.0825 },
        { startDate: '2016-01-01', endDate: '2016-12-31', rate: 0.09 },
        { startDate: '2017-01-01', endDate: '2017-12-31', rate: 0.09 },
        { startDate: '2018-01-01', endDate: '2018-12-31', rate: 0.09 },
        { startDate: '2019-01-01', endDate: '2019-12-31', rate: 0.09 },
        { startDate: '2020-01-01', endDate: '2020-12-31', rate: 0.09 },
        { startDate: '2021-01-01', endDate: '2021-12-31', rate: 0.09 },
        { startDate: '2022-01-01', endDate: '2022-12-31', rate: 0.09 },
        { startDate: '2023-01-01', endDate: '2023-12-31', rate: 0.09 },
        { startDate: '2024-01-01', endDate: '2024-12-31', rate: 0.09 },
        { startDate: '2025-01-01', endDate: '2025-12-31', rate: 0.09 },
    ];

    let calculationResults = {};

    interestForm.addEventListener('submit', (e) => {
        e.preventDefault();
        calculateInterest();
    });

    exportPdfButton.addEventListener('click', () => {
        generatePDF();
    });

    function calculateInterest() {
        const principal = parseFloat(document.getElementById('principal').value);
        const debtDate = new Date(document.getElementById('debt-date').value + 'T00:00:00');
        const today = new Date();

        if (isNaN(principal) || isNaN(debtDate.getTime())) {
            resultOutput.innerHTML = '<p>Veuillez entrer des valeurs valides.</p>';
            return;
        }

        let totalInterest = 0;
        let currentCalcDate = new Date(debtDate);
        let detailedReport = '<h3>Détail du calcul :</h3>';

        while (currentCalcDate < today) {
            const rateInfo = getRateForDate(currentCalcDate);
            if (!rateInfo) {
                // If no more rates are available, stop calculation
                break;
            }

            const periodStartDate = new Date(currentCalcDate);
            const periodEndDate = new Date(rateInfo.endDate + 'T23:59:59');
            const finalEndDate = periodEndDate < today ? periodEndDate : today;

            const daysInPeriod = Math.ceil((finalEndDate - periodStartDate) / (1000 * 60 * 60 * 24)) +1;
            const yearFraction = daysInPeriod / (isLeapYear(periodStartDate.getFullYear()) ? 366 : 365);
            const interestForPeriod = principal * rateInfo.rate * yearFraction;

            totalInterest += interestForPeriod;

            detailedReport += `<p>
                Période du ${formatDate(periodStartDate)} au ${formatDate(finalEndDate)} (${daysInPeriod} jours) :<br>
                Taux: ${rateInfo.rate * 100}% | Intérêt: ${interestForPeriod.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} FCFA
            </p>`;

            currentCalcDate = new Date(finalEndDate);
            currentCalcDate.setDate(currentCalcDate.getDate() + 1);
        }

        const totalAmount = principal + totalInterest;

        resultOutput.innerHTML = `
            ${detailedReport}
            <hr>
            <p><strong>Principal HTVA :</strong> ${principal.toLocaleString('fr-FR')} FCFA</p>
            <p><strong>Total des Intérêts :</strong> ${totalInterest.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} FCFA</p>
            <p><strong>Montant Total (Principal + Intérêts) :</strong> ${totalAmount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} FCFA</p>
        `;

        // Store results for PDF export
        calculationResults = {
            docType: document.getElementById('doc-type').value,
            docNum: document.getElementById('doc-num').value,
            docDate: document.getElementById('doc-date').value,
            principal: principal,
            contractor: document.getElementById('contractor').value,
            debtDate: document.getElementById('debt-date').value,
            calculationDate: new Date(),
            detailedReport: resultOutput.innerText, // Use innerText to get clean text for PDF
            totalInterest: totalInterest,
            totalAmount: totalAmount,
        };

        exportPdfButton.style.display = 'block';
    }

    function getRateForDate(date) {
        const dateStr = date.toISOString().split('T')[0];
        return interestRates.find(r => dateStr >= r.startDate && dateStr <= r.endDate);
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    function formatDate(date) {
        return date.toLocaleDateString('fr-FR');
    }

    function generatePDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Rapport de Calcul d'Intérêts", 105, 20, { align: 'center' });

        doc.setFontSize(12);
        doc.text(`Date du rapport : ${formatDate(calculationResults.calculationDate)}`, 105, 30, { align: 'center' });

        doc.line(20, 35, 190, 35); // separator

        doc.text(`Type de document: ${calculationResults.docType}`, 20, 45);
        doc.text(`N° document: ${calculationResults.docNum}`, 20, 52);
        doc.text(`Date document: ${formatDate(new Date(calculationResults.docDate))}`, 20, 59);
        doc.text(`Contractant: ${calculationResults.contractor}`, 20, 66);
        doc.text(`Principal HTVA: ${calculationResults.principal.toLocaleString('fr-FR')} FCFA`, 20, 73);
        doc.text(`Date de la dette: ${formatDate(new Date(calculationResults.debtDate))}`, 20, 80);

        doc.line(20, 88, 190, 88);

        // Split the report text into lines to fit the PDF page
        const reportLines = doc.splitTextToSize(calculationResults.detailedReport, 170);
        doc.text(reportLines, 20, 98);

        doc.save(`Rapport_Interets_${calculationResults.docNum.replace('/', '-')}.pdf`);
    }
});