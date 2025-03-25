// client/src/services/stripeService.js
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

// Initialize Stripe
let stripePromise;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
  }
  return stripePromise;
};

const stripeService = {
  /**
   * Create a payment intent for wallet deposit
   * @param {number} amount - Amount to deposit
   * @returns {Promise<Object>} - Payment intent data
   */
  createWalletDeposit: async (amount) => {
    try {
      const response = await axios.post(
        '/api/stripe/wallet/deposit',
        { amount },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token')
          }
        }
      );
      
      return response.data.data;
    } catch (error) {
      console.error('Error creating wallet deposit:', error);
      throw error;
    }
  },
  
  /**
   * Process a payment with the Stripe Elements API
   * @param {string} clientSecret - Client secret from payment intent
   * @returns {Promise<Object>} - Payment result
   */
  processPayment: async (clientSecret) => {
    try {
      const stripe = await getStripe();
      
      const result = await stripe.confirmCardPayment(clientSecret);
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      if (result.paymentIntent.status === 'succeeded') {
        return {
          success: true,
          paymentIntentId: result.paymentIntent.id,
          status: result.paymentIntent.status
        };
      } else {
        throw new Error(`Payment status: ${result.paymentIntent.status}`);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  },
  
  /**
   * Create a reader Connect account and get onboarding link
   * @returns {Promise<Object>} - Account data with onboarding link
   */
  createReaderAccount: async () => {
    try {
      const response = await axios.post(
        '/api/stripe/reader/account',
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token')
          }
        }
      );
      
      return response.data.data;
    } catch (error) {
      console.error('Error creating reader account:', error);
      throw error;
    }
  },
  
  /**
   * Get reader account details
   * @param {string} userId - User ID (optional)
   * @returns {Promise<Object>} - Account details
   */
  getReaderAccountDetails: async (userId = null) => {
    try {
      const url = userId 
        ? `/api/stripe/reader/account/${userId}`
        : '/api/stripe/reader/account';
        
      const response = await axios.get(
        url,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token')
          }
        }
      );
      
      return response.data.data;
    } catch (error) {
      console.error('Error getting reader account details:', error);
      throw error;
    }
  },
  
  /**
   * Create a reader payout (transfer)
   * @param {number} amount - Amount to payout
   * @param {string} readerId - Reader ID (optional)
   * @returns {Promise<Object>} - Payout result
   */
  createReaderPayout: async (amount, readerId = null) => {
    try {
      const url = readerId 
        ? `/api/stripe/reader/payout/${readerId}`
        : '/api/stripe/reader/payout';
        
      const response = await axios.post(
        url,
        { amount },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token')
          }
        }
      );
      
      return response.data.data;
    } catch (error) {
      console.error('Error creating reader payout:', error);
      throw error;
    }
  },
  
  /**
   * Create a checkout session for a product
   * @param {string} productId - Product ID
   * @param {string} successUrl - URL to redirect on success
   * @param {string} cancelUrl - URL to redirect on cancel
   * @returns {Promise<Object>} - Checkout session data
   */
  createCheckoutSession: async (productId, successUrl, cancelUrl) => {
    try {
      const response = await axios.post(
        '/api/stripe/checkout',
        { productId, successUrl, cancelUrl },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token')
          }
        }
      );
      
      return response.data.data;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  },
  
  /**
   * Redirect to Stripe Checkout
   * @param {string} sessionId - Checkout session ID
   * @returns {Promise<void>}
   */
  redirectToCheckout: async (sessionId) => {
    try {
      const stripe = await getStripe();
      const result = await stripe.redirectToCheckout({ sessionId });
      
      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Error redirecting to checkout:', error);
      throw error;
    }
  },
  
  /**
   * Get login link for a Connect account
   * @param {string} userId - User ID (optional)
   * @returns {Promise<Object>} - Login link data
   */
  getLoginLink: async (userId = null) => {
    try {
      const url = userId 
        ? `/api/stripe/reader/login/${userId}`
        : '/api/stripe/reader/login';
        
      const response = await axios.get(
        url,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token')
          }
        }
      );
      
      return response.data.data;
    } catch (error) {
      console.error('Error getting login link:', error);
      throw error;
    }
  },
  
  /**
   * Create a payment method
   * @param {object} cardElement - Stripe CardElement
   * @returns {Promise<Object>} - Payment method data
   */
  createPaymentMethod: async (cardElement) => {
    try {
      const stripe = await getStripe();
      
      // Create payment method
      const result = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement
      });
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      // Attach payment method to customer
      const response = await axios.post(
        '/api/stripe/payment-methods',
        { paymentMethodId: result.paymentMethod.id },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token')
          }
        }
      );
      
      return {
        ...result.paymentMethod,
        ...response.data.data
      };
    } catch (error) {
      console.error('Error creating payment method:', error);
      throw error;
    }
  },
  
  /**
   * Get payment methods
   * @returns {Promise<Array>} - List of payment methods
   */
  getPaymentMethods: async () => {
    try {
      const response = await axios.get(
        '/api/stripe/payment-methods',
        {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token')
          }
        }
      );
      
      return response.data.data;
    } catch (error) {
      console.error('Error getting payment methods:', error);
      throw error;
    }
  },
  
  /**
   * Delete payment method
   * @param {string} paymentMethodId - Payment method ID
   * @returns {Promise<Object>} - Deletion result
   */
  deletePaymentMethod: async (paymentMethodId) => {
    try {
      const response = await axios.delete(
        `/api/stripe/payment-methods/${paymentMethodId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token')
          }
        }
      );
      
      return response.data.data;
    } catch (error) {
      console.error('Error deleting payment method:', error);
      throw error;
    }
  }
};

export default stripeService;
