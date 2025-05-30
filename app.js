const fileInput = document.getElementById('file-input');
const fileList = document.getElementById('file-list');
const mergeButton = document.getElementById('merge-button');
const downloadLink = document.getElementById('download-link');

let selectedFiles = [];

fileInput.addEventListener('change', (e) => {
    selectedFiles = Array.from(e.target.files);
    fileList.innerHTML = '';
    if (selectedFiles.length > 0) {
        mergeButton.disabled = false;
        selectedFiles.forEach(file => {
            const li = document.createElement('li');
            li.textContent = file.name;
            fileList.appendChild(li);
        });
    } else {
        mergeButton.disabled = true;
    }
    downloadLink.style.display = 'none';
});

mergeButton.addEventListener('click', async () => {
    if (selectedFiles.length < 2) {
        alert('Please select at least two PDF files to merge.');
        return;
    }
    mergeButton.textContent = 'Merging...';
    mergeButton.disabled = true;
    try {
        const mergedPdf = await PDFLib.PDFDocument.create();
        for (const file of selectedFiles) {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }
        const mergedPdfBytes = await mergedPdf.save();
        const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = 'merged.pdf';
        downloadLink.style.display = 'inline-block';
        downloadLink.textContent = 'Download Merged PDF';
    } catch (err) {
        alert('Error merging PDFs: ' + err.message);
    }
    mergeButton.textContent = 'Merge PDFs';
    mergeButton.disabled = false;
});