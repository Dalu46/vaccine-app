import nodemailer from "nodemailer";

// Mail options interface
interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

// POST method handler
export async function POST(request: Request) {
  const body = await request.json();
  const { to, subject, message } = body as { to: string; subject: string; message: string };

  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Mail options
  const mailOptions: MailOptions = {
    from: "vaxtrack06@gmail.com", // Sender address
    to, // Recipient address
    subject, // Email subject
    html: message, // Email content in HTML
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");

    // Return a success response
    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully!" }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error sending email:", error);

    // Return an error response
    return new Response(
      JSON.stringify({ success: false, message: "Failed to send email.", error: error.message }),
      { status: 500 }
    );
  }
}







// stdebefxxgjyrocz