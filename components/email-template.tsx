import * as React from 'react';

interface EmailTemplateProps {
  token: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  token,
}) => (
  process.env.NODE_ENV !== "development" ?
    <div>
      <h1>Click to verify your email: <a href={`${process.env.PROD_URL}/api/verify/${token}`}>Verify email.</a></h1>
    </div>
    :
  <div>
    <h1>Click to verify your email: <a href={`${process.env.DEV_URL}/api/verify/${token}`}>Verify email.</a></h1>
  </div>
);