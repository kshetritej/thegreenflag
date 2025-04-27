import { EmailTemplate } from '../../../components/email-template';
import { Resend } from 'resend';
import * as React from 'react';
import { NextRequest } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("body", body)
  try {
    const { data, error } = await resend.emails.send({
      from: 'The GreenFlagPlatform <noreply@kshetritej.com.np>',
      to: body.email,
      subject: "Verification Message from The Green Flag Platform",
      react: EmailTemplate({ token: body.token }) as React.ReactElement,
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}