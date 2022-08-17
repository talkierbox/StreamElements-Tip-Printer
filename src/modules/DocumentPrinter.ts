import * as printKit from 'pdf-to-printer';
import { Donation } from './EventEmitter';
import download from 'image-download';
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

        this.printingEnabled = printingEnabled;
    }

    private async downloadImage(url: string, dono: Donation, callback: any): Promise<null> {
        try {
            // await download(url, `../../${this.tempFilesPath}/img/${dono.id}`);
            download(url).then(async (buffer) => {
                !buffer ? await callback() : fs.writeFile( `./${this.tempFilesPath}/img/${dono.id}.jpg`, buffer, async (err) => {
                    if (err) {
                        console.log(`Non-fatal error! Report this, but no need to panic. The program will still run  :)`);
                        console.dir(err);
                    } else {
                        await callback();
                    }
                });
            });
        }
        catch (err) {
            console.log(`DocPrinter Error! ${err.toString() || null}`);
            return;
        }
    }

    public async printDonation(dono: Donation): Promise<void> {
        let filePathsToDel = [];

        // First download the image
        let donationMessageSplitter = dono.message.replace(`\n`, ` `).split(` `);
        let donoURL = null;

        let donoMessage = ``;

        for (let i = 0; i < donationMessageSplitter.length; i++) {
            (await isImageURL(donationMessageSplitter[i])) ? donoURL = donationMessageSplitter[i] : donoMessage += donationMessageSplitter[i] + ` `;
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
            doc.font(`./fonts/Lato-Regular.ttf`).fontSize(23).text(donoMessage, 100, 100);
        }

        if (donoURL) {
            let tempURL = this.tempFilesPath;
            await this.downloadImage(donoURL, dono, async () => {
                if (fs.existsSync(`./${tempURL}/img/${dono.id}.jpg`)) {
                    await doc.image(`./${tempURL}/img/${dono.id}.jpg`, {
                        fit: [400, 400],
                        align: `center`,
                        valign: `center`,
                        y: 300
                    });

                    await doc.end();
                    if (this.printingEnabled) printKit.print(`${tempURL}/printables/donation_${dono.id}.pdf`);

                    filePathsToDel.push(`./${tempURL}/img/${dono.id}.jpg`);
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
        }, 30 * 1000); // Delete the files after 30 seconds
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