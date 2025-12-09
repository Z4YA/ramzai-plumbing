// Vercel Serverless Function - Contact Form Handler
// Uses Resend for email delivery

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }

    // Get form data from request body
    const { name, email, phone, suburb, service, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone) {
        return res.status(400).json({
            success: false,
            message: 'Please fill in all required fields (name, email, phone)'
        });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Please enter a valid email address'
        });
    }

    // Check for Resend API key
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
        console.error('RESEND_API_KEY environment variable is not set');
        return res.status(500).json({
            success: false,
            message: 'Server configuration error. Please try again later.'
        });
    }

    // Format service name for readability
    const serviceNames = {
        'emergency': 'Emergency Plumbing (24/7)',
        'general': 'General Plumbing Repairs',
        'blocked-drains': 'Blocked Drains',
        'hotwater': 'Hot Water System',
        'gas': 'Gas Fitting',
        'leaks': 'Leak Detection & Repair',
        'renovation': 'Bathroom/Kitchen Renovation',
        'other': 'Other Plumbing Service'
    };
    const serviceName = serviceNames[service] || service || 'Not specified';

    // Email content for business owner
    const businessEmailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0066cc, #0052a3); padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">🔧 New Quote Request</h1>
            </div>
            <div style="padding: 30px; background: #f9fafb;">
                <h2 style="color: #1a1a2e; margin-top: 0;">Contact Details</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; width: 120px;">Name:</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Email:</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${email}">${email}</a></td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Phone:</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><a href="tel:${phone}">${phone}</a></td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Suburb:</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${suburb || 'Not specified'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Service:</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${serviceName}</td>
                    </tr>
                </table>

                <h2 style="color: #1a1a2e; margin-top: 30px;">Message</h2>
                <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
                    ${message ? message.replace(/\n/g, '<br>') : '<em>No message provided</em>'}
                </div>

                <div style="margin-top: 30px; padding: 20px; background: #0066cc; border-radius: 8px; text-align: center;">
                    <a href="tel:${phone}" style="color: white; text-decoration: none; font-size: 18px; font-weight: bold;">
                        📞 Call ${name} Now
                    </a>
                </div>
            </div>
            <div style="padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
                <p>This quote request was submitted via the Ramzai Plumbing website.</p>
            </div>
        </div>
    `;

    // Confirmation email for customer
    const customerEmailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0066cc, #0052a3); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0;">🔧 Ramzai Plumbing</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">Professional Plumbing Services Sydney</p>
            </div>
            <div style="padding: 30px; background: #f9fafb;">
                <h2 style="color: #1a1a2e; margin-top: 0;">Thanks for your enquiry, ${name.split(' ')[0]}!</h2>
                <p style="color: #4b5563; line-height: 1.6;">
                    We've received your quote request and one of our licensed plumbers will get back to you shortly.
                </p>
                <p style="color: #4b5563; line-height: 1.6;">
                    <strong>For emergencies</strong>, please call us directly for immediate assistance:
                </p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="tel:0400000000" style="display: inline-block; background: #ff6b35; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-size: 18px; font-weight: bold;">
                        📞 0400 000 000
                    </a>
                </div>

                <h3 style="color: #1a1a2e;">Your Request Summary</h3>
                <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
                    <p style="margin: 5px 0;"><strong>Service:</strong> ${serviceName}</p>
                    <p style="margin: 5px 0;"><strong>Suburb:</strong> ${suburb || 'Not specified'}</p>
                    ${message ? `<p style="margin: 15px 0 5px;"><strong>Your Message:</strong></p><p style="margin: 5px 0; color: #6b7280;">${message}</p>` : ''}
                </div>

                <h3 style="color: #1a1a2e; margin-top: 30px;">Why Choose Ramzai Plumbing?</h3>
                <ul style="color: #4b5563; line-height: 1.8;">
                    <li>✓ Licensed & Insured Plumbers</li>
                    <li>✓ 24/7 Emergency Service</li>
                    <li>✓ Upfront Fixed Pricing</li>
                    <li>✓ Same Day Service Available</li>
                    <li>✓ 10+ Years Experience</li>
                </ul>
            </div>
            <div style="padding: 20px; text-align: center; background: #1a1a2e; color: #9ca3af; font-size: 12px;">
                <p style="margin: 0;">Ramzai Plumbing | Greater Sydney, NSW</p>
                <p style="margin: 5px 0;">
                    <a href="mailto:info@ramzaiplumbing.com.au" style="color: #9ca3af;">info@ramzaiplumbing.com.au</a>
                </p>
            </div>
        </div>
    `;

    try {
        // Send email to business owner
        const businessEmailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Ramzai Plumbing Website <onboarding@resend.dev>',
                to: process.env.BUSINESS_EMAIL || 'info@ramzaiplumbing.com.au',
                reply_to: email,
                subject: `New Quote Request: ${serviceName} - ${name}`,
                html: businessEmailHtml
            })
        });

        if (!businessEmailResponse.ok) {
            const error = await businessEmailResponse.json();
            console.error('Resend API error:', error);
            throw new Error('Failed to send email');
        }

        // Send confirmation email to customer
        await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Ramzai Plumbing <onboarding@resend.dev>',
                to: email,
                subject: 'Thanks for contacting Ramzai Plumbing!',
                html: customerEmailHtml
            })
        });

        // Return success response
        return res.status(200).json({
            success: true,
            message: 'Thank you! Your message has been sent. We\'ll get back to you shortly.'
        });

    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({
            success: false,
            message: 'Sorry, there was an error sending your message. Please call us directly.'
        });
    }
}
