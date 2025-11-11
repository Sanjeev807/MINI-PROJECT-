export const formatPrice = price => {
  return `₹${Number(price).toLocaleString('en-IN')}`;
};

export const calculateDiscount = (originalPrice, discountedPrice) => {
  const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
  return Math.round(discount);
};

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const validateEmail = email => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = password => {
  return password.length >= 6;
};

export const formatDate = dateString => {
  const date = new Date(dateString);
  const options = {year: 'numeric', month: 'short', day: 'numeric'};
  return date.toLocaleDateString('en-IN', options);
};

export const getAverageRating = reviews => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return (sum / reviews.length).toFixed(1);
};

export const generateOrderId = () => {
  return 'ORD' + Date.now() + Math.floor(Math.random() * 1000);
};
