import * as React from 'react';

interface EmailTemplateProps {
  token: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  token,
}) => (
  <div>
    <h1>Click to verify your email: <a href={`${process.env.DEV_URL}/api/verify/${token}`}>Verify email.</a></h1>
  </div>
);