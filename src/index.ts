/* eslint-disable @typescript-eslint/no-unused-vars */
// StreamElements Tip Printer
// GPL-3.0
import settings from './settings.json';
// eslint-disable-next-line no-unused-vars
import { Client, Donation, createFakeDonation } from './modules/EventEmitter';
import {DonoPrinter} from './modules/DocumentPrinter';

let donationPrinter = new DonoPrinter(`./temp`, settings.enablePrinting);

console.log(`[STARTUP] Connecting to StreamElements...`);

Client.on(`ready`, async (data) => {
    console.log(`[TIP-PRINTER] Signed into StreamElements Account ${data.username} [ID: ${data._id}]`);
    console.log(`------------------`);
});

Client.on(`donation`, async (donationData: Donation) => {
    if (settings.minimumDonationAmount > donationData.amount) return;
    console.log(`[TIP-PRINTER] ${donationData.username} has donated ${donationData.amount}!`);
    try {
        await donationPrinter.printDonation(donationData);
    } catch (err) {
        console.log(`[ERROR] Error! Program should continue working as usual, but report this!`);
        console.dir(err);
    }
});

setTimeout(()=> {
    // Create fake donations here!
    //  amount, message, username
    // createFakeDonation(10, `Thanks!`, `talkierbox`);
    // createFakeDonation(10, `Hello There!`, `Ur Dad`);
}, 5 * 1000); // Sends the messages 5 later
