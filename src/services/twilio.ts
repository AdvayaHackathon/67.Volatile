const TWILIO_ACCOUNT_SID = 'ACbdabab964899f0eb0fb514f8b46f4a53';
const TWILIO_AUTH_TOKEN = '06ab2f981a0600bc294b0b774cb38be4';
const TWILIO_PHONE_NUMBER = '+14155238886';

export const sendSOSMessage = async (toPhoneNumber: string, message: string) => {
  try {
    const response = await fetch('https://api.twilio.com/2010-04-01/Accounts/' + TWILIO_ACCOUNT_SID + '/Messages.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(TWILIO_ACCOUNT_SID + ':' + TWILIO_AUTH_TOKEN)
      },
      body: new URLSearchParams({
        To: `whatsapp:${toPhoneNumber}`,
        From: `whatsapp:${TWILIO_PHONE_NUMBER}`,
        Body: 'Emergency alert! Gautam need help!'
      })
    });

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error sending SOS message:', error);
    return { success: false, error };
  }
};