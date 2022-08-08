// StreamElements Tip Printer
// GPL-3.0

import settings from './settings.json';
import { Client, Donation, createFakeDonation } from './modules/EventEmitter';
import {DonoPrinter} from './modules/DocumentPrinter';

let donationPrinter = new DonoPrinter(`./temp`, settings.enablePrinting);

console.log("[STARTUP] Connecting to StreamElements...");

Client.on("ready", async (data) => {
    console.log(`[TIP-PRINTER] Signed into StreamElements Account ${data.username} [ID: ${data._id}]`);
    console.log("------------------");
});

Client.on("donation", async (donationData: Donation) => {
    if(settings.minimumDonationAmount > donationData.amount) return;
    console.log(`[TIP-PRINTER] ${donationData.username} has donated ${donationData.amount}!`);
    await donationPrinter.printDonation(donationData);
});

setTimeout(function(){
    // Create fake donations here!
    //  amount, message, username
    // createFakeDonation(10, "Hello There! https://fake.web/test/omg.jpg", "Ur Mum");
    // createFakeDonation(10, "Hello There! https://picsum.photos/200/300", "Ur Dad");
}, 5 * 1000); // Sends the messages 5 later