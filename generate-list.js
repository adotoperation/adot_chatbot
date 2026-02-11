import fs from 'fs';
import path from 'path';

const filesDir = path.join(process.cwd(), 'public', 'files');
const manifestPath = path.join(filesDir, 'manifest.json');

console.log('Scanning for PDFs in:', filesDir);

try {
    const files = fs.readdirSync(filesDir);
    const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));

    fs.writeFileSync(manifestPath, JSON.stringify(pdfFiles, null, 2));
    console.log(`Successfully generated manifest.json with ${pdfFiles.length} files.`);
} catch (error) {
    console.error('Error scanning files:', error);
}
