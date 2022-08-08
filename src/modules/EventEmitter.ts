/* eslint-disable @typescript-eslint/no-explicit-any */
import events from 'events';
import settings from '../settings.json';
import {Wrapper} from './Wrapper';

let randomstring = require(`randomstring`);


export let StreamElements = new Wrapper(settings.jwtToken, settings.accountID);
export let Client = new events.EventEmitter();

export interface Donation {
    id: string,
    username: string,
    amount: number,
    message: string,
    currency: string,
    approved: string
}

export function createFakeDonation(amount: number, message: string, username: string): void {
    let fakeObj: Donation = {
        "id": randomstring.generate(8),
        "username": username,
        "amount": amount,
        "message": message,
        "currency": `USD`,
        "approved": `approved`
    };

    Client.emit(`donation`, fakeObj);
}


// Launch the ready event
StreamElements.getChannel().then(async (data) => {
    Client.emit(`ready`, data);
});

// Donations Map Constantly Updating
let donoIDSet = new Set();

StreamElements.getRecentTips().then(async (data: any) => {
    data.recent.forEach(async (dataPiece) => {
        donoIDSet.add(dataPiece[`_id`]);
        if(dataPiece[`status`] != `success`) return;
    });
});

// Constantly check for new Donations
setInterval(async () => {
    let recentTips: any = await StreamElements.getRecentTips();
    recentTips.recent.forEach(async (dataPiece) => {
        // Skip donos that are already present
        if(donoIDSet.has(dataPiece[`_id`])) return;

        // Skip bad donos
        if(dataPiece[`status`] != `success`) return;

        // Trigger the event
        donoIDSet.add(dataPiece[`_id`]); // Add the dono ID to the seen dono ID set

        let donationdata = dataPiece[`donation`];

        let donoInfoObj: Donation = {
            id: dataPiece[`_id`],
            username: donationdata.user.username,
            amount: donationdata.amount,
            message: donationdata.message,
            currency: donationdata.currency,
            approved: dataPiece[`approved`]
        };

        Client.emit(`donation`, donoInfoObj);
    });

}, 10 * 1000);