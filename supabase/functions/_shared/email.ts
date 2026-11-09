import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts'

export async function sendEmail({ to, subject, html, replyTo }: {
  to: string
  subject: string
  html: string
  replyTo?: string
}) {
  const gmailUser = Deno.env.get('GMAIL_USER')!
  const gmailPassword = Deno.env.get('GMAIL_APP_PASSWORD')!

  const client = new SMTPClient({
    connection: {
      hostname: 'smtp.gmail.com',
      port: 465,
      tls: true,
      auth: {
        username: gmailUser,
        password: gmailPassword,
      },
    },
  })

  await client.send({
    from: gmailUser,
    to,
    subject,
    content: 'auto',
    html,
    replyTo,
  })

  await client.close()
}
