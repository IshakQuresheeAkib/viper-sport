type SmsPayload = {
  phone: string;
  message: string;
};

type SmsResult = {
  ok: boolean;
  status: number;
};

export function buildRegistrationSms(input: {
  firstName: string;
  lastName: string;
  registrationId: string;
}) {
  return `ViperSport Event: Registration confirmed!
Name: ${input.firstName} ${input.lastName}
ID: ${input.registrationId}
Event: Argentina vs Austria Live Show
Date: 22 June 2026, 9PM
Venue: Shahi Eidgah Maidan, TV Gate, Sylhet
Show this SMS or your QR code at the gate.`;
}

export async function sendSms({ phone, message }: SmsPayload): Promise<SmsResult> {
  const apiKey = process.env.SMS_NET_BD_API_KEY;

  if (!apiKey) {
    return { ok: false, status: 0 };
  }

  const response = await fetch("https://api.sms.net.bd/sendsms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      api_key: apiKey,
      msg: message,
      to: phone
    })
  });

  return {
    ok: response.ok,
    status: response.status
  };
}
