import { message } from '@/components/Providers/theme-provider';

/**
 * Copies text to the clipboard and shows a success message
 * @param text The text to copy
 * @param label Optional label for the success message (e.g. "Email")
 */
export const copyToClipboard = async (text: string, label?: string) => {
    try {
        await navigator.clipboard.writeText(text);
        if (message) {
            if (label) {
                message.success(`${label} copied to clipboard!`);
            } else {
                message.success('Copied to clipboard!');
            }
        }
        return true;
    } catch (err) {
        console.error('Failed to copy: ', err);
        if (message) {
            message.error('Failed to copy to clipboard');
        }
        return false;
    }
};
