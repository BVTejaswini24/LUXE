import {
  CheckoutForm,
  CheckoutErrors,
} from "@/components/checkout-page/checkout.types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s\-+()]{7,15}$/;
const CARD_REGEX = /^[\d\s]{13,19}$/;
const CVV_REGEX = /^\d{3,4}$/;
const EXPIRY_REGEX = /^(0[1-9]|1[0-2])\/\d{2}$/;
const UPI_REGEX = /^[\w.\-]+@[\w]+$/;

export function validateCheckoutForm(
  form: CheckoutForm
): { valid: boolean; errors: CheckoutErrors } {
  const errors: CheckoutErrors = {
    contact: {},
    shipping: {},
    card: {},
    upi: {},
  };

  // Contact validation
  if (!form.contact.email.trim()) {
    errors.contact.email = "Email is required";
  } else if (!EMAIL_REGEX.test(form.contact.email)) {
    errors.contact.email = "Please enter a valid email address";
  }

  if (!form.contact.phone.trim()) {
    errors.contact.phone = "Phone number is required";
  } else if (!PHONE_REGEX.test(form.contact.phone)) {
    errors.contact.phone = "Please enter a valid phone number";
  }

  // Shipping validation
  if (!form.shipping.firstName.trim()) {
    errors.shipping.firstName = "First name is required";
  }
  if (!form.shipping.lastName.trim()) {
    errors.shipping.lastName = "Last name is required";
  }
  if (!form.shipping.address.trim()) {
    errors.shipping.address = "Address is required";
  }
  if (!form.shipping.city.trim()) {
    errors.shipping.city = "City is required";
  }
  if (!form.shipping.state.trim()) {
    errors.shipping.state = "State is required";
  }
  if (!form.shipping.pinCode.trim()) {
    errors.shipping.pinCode = "PIN/ZIP code is required";
  }
  if (!form.shipping.country.trim()) {
    errors.shipping.country = "Country is required";
  }

  // Payment validation
  if (form.paymentMethod === "card") {
    if (!form.card.holderName.trim()) {
      errors.card.holderName = "Cardholder name is required";
    }
    if (!form.card.number.trim()) {
      errors.card.number = "Card number is required";
    } else if (!CARD_REGEX.test(form.card.number.replace(/\s/g, ""))) {
      errors.card.number = "Please enter a valid card number";
    }
    if (!form.card.expiry.trim()) {
      errors.card.expiry = "Expiry date is required";
    } else if (!EXPIRY_REGEX.test(form.card.expiry)) {
      errors.card.expiry = "Use MM/YY format";
    } else {
      const [monthStr, yearStr] = form.card.expiry.split("/");
      const expMonth = parseInt(monthStr, 10);
      const expYear = parseInt(yearStr, 10) + 2000;
      const now = new Date();
      const curMonth = now.getMonth() + 1;
      const curYear = now.getFullYear();
      if (expYear < curYear || (expYear === curYear && expMonth < curMonth)) {
        errors.card.expiry = "Card has expired";
      }
    }
    if (!form.card.cvv.trim()) {
      errors.card.cvv = "CVV is required";
    } else if (!CVV_REGEX.test(form.card.cvv)) {
      errors.card.cvv = "CVV must be 3-4 digits";
    }
  }

  if (form.paymentMethod === "upi") {
    if (!form.upi.upiId.trim()) {
      errors.upi.upiId = "UPI ID is required";
    } else if (!UPI_REGEX.test(form.upi.upiId)) {
      errors.upi.upiId = "Please enter a valid UPI ID (e.g., name@upi)";
    }
  }

  const valid =
    Object.keys(errors.contact).length === 0 &&
    Object.keys(errors.shipping).length === 0 &&
    (form.paymentMethod !== "card" || Object.keys(errors.card).length === 0) &&
    (form.paymentMethod !== "upi" || Object.keys(errors.upi).length === 0);

  return { valid, errors };
}

export function hasErrors(errors: CheckoutErrors): boolean {
  return (
    Object.keys(errors.contact).length > 0 ||
    Object.keys(errors.shipping).length > 0 ||
    Object.keys(errors.card).length > 0 ||
    Object.keys(errors.upi).length > 0
  );
}
