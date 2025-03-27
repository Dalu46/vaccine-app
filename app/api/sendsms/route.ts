// app/api/send-sms/route.ts
import { NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
const authToken = process.env.TWILIO_AUTH_TOKEN as string;

const client = twilio(accountSid, authToken);

export async function POST(req: Request) {
  try {
    const { to, body }: { to?: string; body?: string } = await req.json();

    if (!to || !body) {
      return NextResponse.json({ error: "Missing 'to' or 'body' field" }, { status: 400 });
    }

    const message = await client.messages.create({
      body,
      from: "+447897028913",
      to,
    });

    return NextResponse.json({ success: true, messageId: message.sid }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
