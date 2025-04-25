import * as React from 'react';
import { Html} from "@react-email/components";

export function Email(props:any) {
  const { email,username,message } = props;

  return (
    <Html lang="en">
      <h1>PORTFOLIO</h1>
      <br></br>
      <br></br>
      <p>Uername- {username}</p>
      <br></br>
      <p>Email- {email}</p>
      <br></br>
      <p>Message- {message}</p>
    </Html>
  );
}

export default Email;