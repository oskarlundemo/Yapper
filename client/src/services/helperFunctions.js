import moment from "moment-timezone";
import {supabase} from "./supabaseClient.js";


export const parseLatestTimestamp = (latestMessage) => {
    if (!latestMessage?.created_at) return "";

    const date = moment(latestMessage.created_at).tz("Europe/Stockholm");
    const now = moment().tz("Europe/Stockholm");
    const diffDays = now.diff(date, 'days');

    if (diffDays === 0) return date.format("HH:mm");
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} d`;
};


export const parseLatestMessage = (message) => {
    if (message.hasAttachments) {
        return 'Sent a file'
    } else if(message.content?.includes('giphy.com')) {
        return 'Sent a GIF '
    } else if (message.content?.length > 20 && message.content) {
        const subString = message.content.substring(0, 20);
        const lastSpace = subString.lastIndexOf(' ');
        return message.content.substring(0, lastSpace) + '...';
    }
    return message.content;
}


export const soundEffect = async () => {
    const audio = new Audio('notification.mp3');
    await audio.play(); // Play audio
}


export const subscribeToChannel= (channelName, eventDetails, callback) => {
    const channel = supabase
        .channel(channelName)
        .on('postgres_changes', eventDetails, callback)
        .subscribe();
    return channel;
}