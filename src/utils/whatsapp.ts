import { Booking } from '../types';
import { formatDateTime } from './dates';

// Mensagem para o CLIENTE
export function generateWhatsAppMessage(booking: Booking): string {
  const services = booking.services.map(s => s.name).join(', ');
  const dateTime = formatDateTime(booking.date, booking.time);
  
  let extraChargesText = '';
  if (booking.extraCharges.fleaCharge > 0) {
    extraChargesText += `\n• Flea Fee: $${booking.extraCharges.fleaCharge.toFixed(2)}`;
  }
  if (booking.extraCharges.tangledCharge > 0) {
    extraChargesText += `\n• Tangled Fur Fee: $${booking.extraCharges.tangledCharge.toFixed(2)}`;
  }
  if (booking.extraCharges.aggressiveCharge > 0) {
    extraChargesText += `\n• Aggressive Pet Fee: $${booking.extraCharges.aggressiveCharge.toFixed(2)}`;
  }
  
  return `Hello ${booking.customer.name}! Your booking has been confirmed:

📅 Date and Time: ${dateTime}
🐕 Pet: ${booking.pet.name} (${booking.pet.breed})
✨ Services: ${services}
💰 Total: $${booking.totalPrice.toFixed(2)}${extraChargesText}

⚠️ IMPORTANT: The stated value is approximate. Your pet will undergo evaluation upon arrival and the final value will be confirmed.

📍 Address: 123 Main Street, Pet City, PC 12345
📞 Contact: (12) 98174-6615
🕒 Hours: Monday to Saturday, 8 AM to 6 PM (Lunch: 12:30 PM - 1:30 PM)

Please arrive 10 minutes before your scheduled time.

We look forward to seeing you and your pet!

PetBookin
_Automated message from the booking system_`;
}

// Mensagem para o DONO DO PET SHOP
export function generateOwnerNotification(booking: Booking): string {
  const services = booking.services.map(s => s.name).join(', ');
  const dateTime = formatDateTime(booking.date, booking.time);
  
  let extraInfo = '';
  if (booking.extraCharges.fleas) extraInfo += '\n⚠️ Pet com PULGAS';
  if (booking.extraCharges.tangled) extraInfo += '\n⚠️ Pet com PELOS EMBOLADOS';
  if (booking.extraCharges.aggressive) extraInfo += '\n⚠️ Pet BRAVO';
  
  return `🔔 NEW BOOKING - PetBooking

📅 Date and Time: ${dateTime}

👤 CUSTOMER:
• Name: ${booking.customer.name}
• Phone: ${booking.customer.phone}
• CPF: ${booking.customer.cpf}
• Email: ${booking.customer.email || 'Not provided'}

🐕 PET:
• Name: ${booking.pet.name}
• Breed: ${booking.pet.breed}
• Size: ${booking.pet.size}

✨ SERVICES: ${services}

⚠️ NOTES:${extraInfo}

💰 TOTAL VALUE: $${booking.totalPrice.toFixed(2)}

Status: Pending

Online Booking System`;
}

// Função para enviar notificação para o CLIENTE
export function sendCustomerNotification(booking: Booking) {
  const message = generateWhatsAppMessage(booking);
  const customerPhone = booking.customer.phone.replace(/\D/g, ''); // Remove caracteres não numéricos
  const formattedPhone = customerPhone.startsWith('55') ? customerPhone : `55${customerPhone}`;
  
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
  
  // Abre WhatsApp para enviar para o cliente
  window.open(whatsappUrl, '_blank');
}

// Função para enviar notificação para o DONO DO PET SHOP
export function sendOwnerNotification(booking: Booking) {
  const message = generateOwnerNotification(booking);
  const ownerPhone = '5512981746615'; // Número do pet shop
  
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${ownerPhone}?text=${encodedMessage}`;
  
  // Abre WhatsApp para enviar para o dono
  window.open(whatsappUrl, '_blank');
}

// Função principal que envia AMBAS as notificações
export function sendAllNotifications(booking: Booking) {
  // Envia para o cliente
  sendCustomerNotification(booking);
  
  // Aguarda um pouco e envia para o dono
  setTimeout(() => {
    sendOwnerNotification(booking);
  }, 1000);
}