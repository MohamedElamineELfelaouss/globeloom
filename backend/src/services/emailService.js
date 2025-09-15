const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(options) {
    try {
      const mailOptions = {
        from: `${process.env.FROM_NAME || "GlobeLoom"} <${
          process.env.FROM_EMAIL || process.env.SMTP_USER
        }>`,
        to: options.email,
        subject: options.subject,
        html: options.html || options.message,
        text: options.text || options.message,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log("Email sent:", info.messageId);
      return info;
    } catch (error) {
      console.error("Email sending failed:", error);
      throw error;
    }
  }

  async sendWelcomeEmail(user) {
    const subject = "Welcome to GlobeLoom! 🌍";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to GlobeLoom!</h1>
        </div>
        
        <div style="padding: 30px; background-color: #f9f9f9;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${
            user.firstName
          }! 👋</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Thank you for joining GlobeLoom, the ultimate travel planning and exploration platform! 
            We're excited to help you discover amazing destinations and plan unforgettable journeys.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Get Started:</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li>🗺️ Explore our interactive country guide</li>
              <li>✈️ Create your first trip itinerary</li>
              <li>👥 Connect with fellow travelers</li>
              <li>🏆 Earn points and unlock achievements</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; padding: 15px 30px; text-decoration: none; 
                      border-radius: 5px; font-weight: bold; display: inline-block;">
              Start Exploring
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
            Happy travels!<br>
            The GlobeLoom Team
          </p>
        </div>
      </div>
    `;

    return this.sendEmail({
      email: user.email,
      subject,
      html,
    });
  }

  async sendTripInvitation(trip, invitedUser, inviterUser) {
    const subject = `You're invited to join "${trip.title}" on GlobeLoom! ✈️`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Trip Invitation</h1>
        </div>
        
        <div style="padding: 30px; background-color: #f9f9f9;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${
            invitedUser.firstName
          }! 👋</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            <strong>${inviterUser.firstName} ${
      inviterUser.lastName
    }</strong> has invited you to collaborate 
            on their trip: <strong>"${trip.title}"</strong>
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Trip Details:</h3>
            <p style="color: #666; margin: 5px 0;"><strong>Destination:</strong> ${
              trip.destination
            }</p>
            <p style="color: #666; margin: 5px 0;"><strong>Duration:</strong> ${new Date(
              trip.startDate
            ).toLocaleDateString()} - ${new Date(
      trip.endDate
    ).toLocaleDateString()}</p>
            ${
              trip.description
                ? `<p style="color: #666; margin: 15px 0 5px 0;"><strong>Description:</strong></p><p style="color: #666; margin: 5px 0;">${trip.description}</p>`
                : ""
            }
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${
              process.env.FRONTEND_URL || "http://localhost:3000"
            }/trips/${trip._id}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; padding: 15px 30px; text-decoration: none; 
                      border-radius: 5px; font-weight: bold; display: inline-block;">
              View Trip
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
            Happy planning!<br>
            The GlobeLoom Team
          </p>
        </div>
      </div>
    `;

    return this.sendEmail({
      email: invitedUser.email,
      subject,
      html,
    });
  }

  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/reset-password?token=${resetToken}`;

    const subject = "Password Reset Request - GlobeLoom";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Password Reset</h1>
        </div>
        
        <div style="padding: 30px; background-color: #f9f9f9;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${user.firstName}! 👋</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            You requested a password reset for your GlobeLoom account. Click the button below to reset your password.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; padding: 15px 30px; text-decoration: none; 
                      border-radius: 5px; font-weight: bold; display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; font-size: 14px;">
            If you didn't request this password reset, please ignore this email. 
            This link will expire in 15 minutes for security reasons.
          </p>
          
          <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
            Stay secure!<br>
            The GlobeLoom Team
          </p>
        </div>
      </div>
    `;

    return this.sendEmail({
      email: user.email,
      subject,
      html,
    });
  }

  async sendTripUpdate(trip, message, recipients) {
    const subject = `Update on "${trip.title}" - GlobeLoom`;

    for (const recipient of recipients) {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Trip Update</h1>
          </div>
          
          <div style="padding: 30px; background-color: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${
              recipient.firstName
            }! 👋</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              There's been an update to your trip: <strong>"${
                trip.title
              }"</strong>
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #666; line-height: 1.6;">${message}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${
                process.env.FRONTEND_URL || "http://localhost:3000"
              }/trips/${trip._id}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; padding: 15px 30px; text-decoration: none; 
                        border-radius: 5px; font-weight: bold; display: inline-block;">
                View Trip
              </a>
            </div>
            
            <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
              Happy travels!<br>
              The GlobeLoom Team
            </p>
          </div>
        </div>
      `;

      await this.sendEmail({
        email: recipient.email,
        subject,
        html,
      });
    }
  }
}

module.exports = new EmailService();
