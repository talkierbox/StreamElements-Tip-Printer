import * as printKit from 'pdf-to-printer';
import { Donation } from './EventEmitter';
import * as Downloader from 'image-downloader';
import fs from 'fs';
import path from 'path';
import PDFKit from 'pdfkit';
const isImageURL = require(`image-url-validator`).default;

export class DonoPrinter {
    tempFilesPath: string;
    printingEnabled: boolean;

    constructor(tempFilesPath = `./temp`, printingEnabled = false) {
        this.tempFilesPath = tempFilesPath;
        printKit.getDefaultPrinter().then(data => {
            console.log(`[PRINTER] Using Printer: ${data.name} - This is your device default printer!`);
            console.log(`[PRINTER] Allow Printing Setting: ${printingEnabled}`);
        });

        // Purge PDFs and Images
        this.purgePDFs();
        this.purgeImages();

        if (printingEnabled) this.printingEnabled = true;
        else this.printingEnabled = false;
    }

    private async downloadImage(url, donoID): Promise<Downloader.DownloadResult> {
        if (await isImageURL(url)) {
                let img = await Downloader.image({
                    url: url,
                    dest: `../../${this.tempFilesPath}/img/${donoID}`,
                    extractFilename: false
                });
                return img;
        }
        else {
            return {filename: ``};
        }
    }

    public async printDonation(dono: Donation): Promise<void> {
        let filePathsToDel = [];

        // First download the image
        let donationMessageSplitter = dono.message.replace(`\n`, ` `).split(` `);
        let donoURL = null;

        let donoMessage = ``;

        for (let i = 0; i < donationMessageSplitter.length; i++) {
            let element = donationMessageSplitter[i].toLowerCase();
            if (element.includes(`.png`) || element.includes(`.jpg`) || element.includes(`.jpeg`) || await isImageURL(donationMessageSplitter[i])) {
                donoURL = donationMessageSplitter[i];
            }
            else {
                donoMessage += donationMessageSplitter[i] + ` `;
            }
        }

        let doc = new PDFKit();
        doc.pipe(fs.createWriteStream(`${this.tempFilesPath}/printables/donation_${dono.id}.pdf`));
        filePathsToDel.push(`${this.tempFilesPath}/printables/donation_${dono.id}.pdf`);

        // Add the username
        doc.font(`./fonts/Lato-Bold.ttf`).fontSize(17)
        .text(`${dono.username} - $${dono.amount}`, 100, 50, {
          align: `center`,
          valign: `center`
        });

        if (donoMessage) {
            // Add the Donation Message
            doc.font(`./fonts/Lato-Regular.ttf`).fontSize(23)
            .text(donoMessage, 100, 100);
        }

        if (donoURL) {
            await this.downloadImage(donoURL, dono.id).then(async (data) => {
                if (data.filename) {
                    await doc.image(data.filename, {
                        fit: [400, 400],
                        align: `center`,
                        valign: `center`,
                        y: 300
                    });

                    await doc.end();
                    if (this.printingEnabled) printKit.print(`${this.tempFilesPath}/printables/donation_${dono.id}.pdf`);

                    filePathsToDel.push(data.filename);
                } else {
                    await doc.end();
                    if (this.printingEnabled) printKit.print(`${this.tempFilesPath}/printables/donation_${dono.id}.pdf`);
                }
            });
        }
        else {
            await doc.end();
            if (this.printingEnabled) printKit.print(`${this.tempFilesPath}/printables/donation_${dono.id}.pdf`);
        }

        // Delete the files
        setTimeout(async () => {
            filePathsToDel.forEach(async (path) => {
                if (fs.existsSync(path)) fs.unlinkSync(path);
            });
        }, 10 * 1000);
    }

    async purgePDFs(): Promise<void> {
        fs.readdir(`${this.tempFilesPath}/printables`, (err, files) => {
            if (err) throw err;
            for (const file of files) {
                if (file.endsWith(`.txt`)) continue;
            fs.unlink(path.join(`${this.tempFilesPath}/printables`, file), err => {
                if (err) throw err;
            });
            }
        });
        console.log(`[PRINTER] Purged All PDFs!`);
    }

    async purgeImages(): Promise<void> {
        fs.readdir(`${this.tempFilesPath}/img`, (err, files) => {
            if (err) throw err;

            for (const file of files) {
                if (file.endsWith(`.txt`)) continue;
            fs.unlink(path.join(`${this.tempFilesPath}/img`, file), err => {
                if (err) throw err;
            });
            }
        });
        console.log(`[PRINTER] Purged All Images!`);
    }
}