const nodemailer = require('nodemailer');

async function sendTestEmail() {
  try {
    console.log('🚀 Sending test email...');
    
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'thumboard@gmail.com',
        pass: 'idoi ptef xggm luck',
      },
    });

    // Test email content
    const mailOptions = {
      from: 'thumboard@gmail.com',
      to: 'jadhav.mihir5@gmail.com',
      subject: 'Welcome to Thumboard Waitlist! 🚀',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Thumboard</title>
          <style>
            /* Reset and base styles */
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
              line-height: 1.6;
              color: #000000;
              background-color: #ffffff;
              margin: 0;
              padding: 20px;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border: 1px solid #eaeaea;
              border-radius: 8px;
              overflow: hidden;
            }
            
            .header {
              padding: 32px 32px 24px;
              text-align: center;
              background-color: #ffffff;
              border-bottom: 1px solid #eaeaea;
            }
            
            .logo-container {
              margin-bottom: 16px;
            }
            
            .logo-light {
              width: 180px;
              height: auto;
              max-width: 100%;
              display: block;
            }

            .logo-dark {
              width: 180px;
              height: auto;
              max-width: 100%;
              display: none;
            }
            
            .header-text {
              font-size: 24px;
              font-weight: 600;
              color: #000000;
              margin-bottom: 8px;
              letter-spacing: -0.025em;
            }
            
            .header-subtitle {
              font-size: 16px;
              color: #666666;
              font-weight: 400;
            }
            
            .content {
              padding: 32px;
              background-color: #ffffff;
            }
            
            .greeting {
              font-size: 16px;
              color: #000000;
              margin-bottom: 24px;
              line-height: 1.5;
            }
            
            .info-section {
              background-color: #fafafa;
              border: 1px solid #eaeaea;
              border-radius: 6px;
              padding: 20px;
              margin: 20px 0;
            }
            
            .info-section h3 {
              font-size: 16px;
              font-weight: 600;
              color: #000000;
              margin-bottom: 8px;
              letter-spacing: -0.025em;
            }
            
            .info-section p {
              font-size: 14px;
              color: #666666;
              line-height: 1.5;
              margin: 0;
            }
            
            .cta-container {
              text-align: center;
              margin: 32px 0 24px;
            }
            
            .cta-button {
              display: inline-block;
              background-color: #000000;
              color: #ffffff;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 500;
              font-size: 14px;
              letter-spacing: -0.025em;
              transition: background-color 0.2s ease;
            }
            
            .footer {
              padding: 24px 32px;
              background-color: #fafafa;
              border-top: 1px solid #eaeaea;
              text-align: center;
            }
            
            .footer-text {
              font-size: 14px;
              color: #666666;
              margin-bottom: 12px;
            }

            .footer-link {
              color: #000000;
              text-decoration: none;
              font-weight: 600;
            }

            .footer-link:hover {
              text-decoration: underline;
            }

            .footer-links {
              font-size: 14px;
            }

            .footer-links a {
              color: #0070f3;
              text-decoration: none;
              margin: 0 8px;
            }

            .footer-links a:hover {
              text-decoration: underline;
            }
            
            /* Dark mode support */
            @media (prefers-color-scheme: dark) {
              body {
                background-color: #000000;
                color: #ffffff;
              }
              
              .email-container {
                background-color: #111111;
                border-color: #333333;
              }
              
              .header {
                background-color: #111111;
                border-bottom-color: #333333;
              }
              
              .header-text {
                color: #ffffff;
              }
              
              .header-subtitle {
                color: #888888;
              }

              .logo-light {
                display: none !important;
              }

              .logo-dark {
                display: block !important;
              }

              .content {
                background-color: #111111;
              }
              
              .greeting {
                color: #ffffff;
              }
              
              .info-section {
                background-color: #1a1a1a;
                border-color: #333333;
              }
              
              .info-section h3 {
                color: #ffffff;
              }
              
              .info-section p {
                color: #888888;
              }
              
              .cta-button {
                background-color: #ffffff;
                color: #000000;
              }
              
              .footer {
                background-color: #1a1a1a;
                border-top-color: #333333;
              }
              
              .footer-text {
                color: #888888;
              }

              .footer-link {
                color: #ffffff;
              }
            }
            
            /* Mobile responsiveness */
            @media only screen and (max-width: 600px) {
              body {
                padding: 10px;
              }
              
              .header,
              .content,
              .footer {
                padding: 24px 20px;
              }
              
              .logo {
                width: 150px;
              }
              
              .header-text {
                font-size: 20px;
              }
              
              .header-subtitle {
                font-size: 14px;
              }
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <div class="logo-container">
                <!-- Light mode logo (default) -->
                <img src="https://pub-98daee8ec10b4919b1ef774ced6f87b3.r2.dev/Full%20logo%20light.svg"
                     alt="Thumboard"
                     class="logo-light"
                     style="display: block; margin: 0 auto; width: 180px; height: auto; max-width: 100%;" />
                <!-- Dark mode logo (hidden by default, shown in dark mode) -->
                <img src="https://pub-98daee8ec10b4919b1ef774ced6f87b3.r2.dev/Full%20logo%20dark.svg"
                     alt="Thumboard"
                     class="logo-dark"
                     style="display: none; margin: 0 auto; width: 180px; height: auto; max-width: 100%;" />
              </div>
              <h1 class="header-text">Welcome to Thumboard!</h1>
              <p class="header-subtitle">You're on the waitlist</p>
            </div>
            
            <div class="content">
              <p class="greeting">
                Hi there! 👋<br><br>
                Thank you for joining the Thumboard waitlist. We're excited to have you on board as we build the future of visual content discovery.
              </p>
              
              <div class="info-section">
                <h3>What's Next?</h3>
                <p>We'll notify you as soon as we launch our AI-powered visual content discovery platform. You'll be among the first to experience Thumboard's intelligent search and discovery features.</p>
              </div>
              
              <div class="cta-container">
                <a href="https://thumboard.in" class="cta-button">
                  Visit Thumboard
                </a>
              </div>
            </div>
            
            <div class="footer">
              <div class="footer-text">
                Built by <a href="https://linkedin.com/in/mihir-jadhav" target="_blank" class="footer-link"><strong>Mihir</strong></a> & <a href="https://twitter.com/deb" target="_blank" class="footer-link"><strong>Deb</strong></a>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Welcome to Thumboard! 🚀

Hi there! 👋

Thank you for joining the Thumboard waitlist. We're excited to have you on board as we build the future of visual content discovery.

What's Next?
We'll notify you as soon as we launch our AI-powered visual content discovery platform. You'll be among the first to experience Thumboard's intelligent search and discovery features.

Visit Thumboard: https://thumboard.in

---
Built by Mihir (https://linkedin.com/in/mihir-jadhav) & Deb (https://twitter.com/deb)
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent successfully to jadhav.mihir5@gmail.com');

  } catch (error) {
    console.error('❌ Error sending test email:', error);
  }
}

sendTestEmail();
