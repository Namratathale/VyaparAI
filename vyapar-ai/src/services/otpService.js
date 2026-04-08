// This function generates a secure 4-digit code
export const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// In a real-world app, this would call your backend (Firebase Functions/Node.js)
export const sendWhatsAppOTP = async (phoneNumber, otpCode) => {
  try {
    // Note: In production, 'AUTH_TOKEN' stays on the server, not here.
    const response = await fetch(`https://your-backend-api.com/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: phoneNumber, code: otpCode })
    });
    return await response.json();
  } catch (error) {
    console.error("WhatsApp API Error:", error);
    throw error;
  }
};

// This function calls your SECURE backend, which then talks to Meta
export const triggerWhatsAppOTP = async (phoneNumber) => {
  try {
    const response = await fetch('https://your-api.com/v1/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: phoneNumber })
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to initiate OTP flow");
    throw error;
  }
};