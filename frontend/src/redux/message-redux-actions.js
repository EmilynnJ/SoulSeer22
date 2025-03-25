// client/src/redux/actions/messageActions.js
import axios from 'axios';
import {
  FETCH_MESSAGES_REQUEST,
  FETCH_MESSAGES_SUCCESS,
  FETCH_MESSAGES_FAILURE,
  SEND_MESSAGE_REQUEST,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_FAILURE,
  PROCESS_PAYMENT_REQUEST,
  PROCESS_PAYMENT_SUCCESS,
  PROCESS_PAYMENT_FAILURE,
  CONFIRM_PAYMENT_REQUEST,
  CONFIRM_PAYMENT_SUCCESS,
  CONFIRM_PAYMENT_FAILURE,
  UPDATE_MESSAGE_SETTINGS_REQUEST,
  UPDATE_MESSAGE_SETTINGS_SUCCESS,
  UPDATE_MESSAGE_SETTINGS_FAILURE
} from './types';
import { setError } from './errorActions';
import { getNewAuthToken } from './authActions';
import { loadStripe } from '@stripe/stripe-js';

// Fetch messages for a conversation
export const fetchMessages = (conversationId) => async (dispatch, getState) => {
  try {
    dispatch({ type: FETCH_MESSAGES_REQUEST });
    
    const { token } = getState().auth;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      }
    };
    
    const res = await axios.get(`/api/messages/conversation/${conversationId}`, config);
    
    dispatch({
      type: FETCH_MESSAGES_SUCCESS,
      payload: res.data.data
    });
  } catch (err) {
    // Handle token expiration
    if (err.response && err.response.status === 401) {
      try {
        await dispatch(getNewAuthToken());
        // Retry the request with the new token
        return dispatch(fetchMessages(conversationId));
      } catch (refreshErr) {
        dispatch(setError('Your session has expired. Please log in again.'));
      }
    }
    
    dispatch({
      type: FETCH_MESSAGES_FAILURE,
      payload: err.response?.data?.message || 'Error fetching messages'
    });
    
    dispatch(setError(err.response?.data?.message || 'Error fetching messages'));
  }
};

// Send a message
export const sendMessage = (messageData) => async (dispatch, getState) => {
  try {
    dispatch({ type: SEND_MESSAGE_REQUEST });
    
    const { token } = getState().auth;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      }
    };
    
    const res = await axios.post('/api/messages', messageData, config);
    
    dispatch({
      type: SEND_MESSAGE_SUCCESS,
      payload: res.data.data
    });
  } catch (err) {
    // Handle token expiration
    if (err.response && err.response.status === 401) {
      try {
        await dispatch(getNewAuthToken());
        // Retry the request with the new token
        return dispatch(sendMessage(messageData));
      } catch (refreshErr) {
        dispatch(setError('Your session has expired. Please log in again.'));
      }
    }
    
    dispatch({
      type: SEND_MESSAGE_FAILURE,
      payload: err.response?.data?.message || 'Error sending message'
    });
    
    dispatch(setError(err.response?.data?.message || 'Error sending message'));
  }
};

// Process payment for a message
export const processMessagePayment = (messageId, paymentMethod) => async (dispatch, getState) => {
  try {
    dispatch({ type: PROCESS_PAYMENT_REQUEST });
    
    const { token } = getState().auth;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      }
    };
    
    const paymentData = {
      messageId,
      paymentMethod
    };
    
    const res = await axios.post('/api/messages/payment', paymentData, config);
    
    // Handle Stripe payment if necessary
    if (paymentMethod === 'stripe' && res.data.data.clientSecret) {
      const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
      
      // Confirm the payment with Stripe
      const result = await stripe.confirmCardPayment(res.data.data.clientSecret);
      
      if (result.error) {
        // Show error to customer
        dispatch({
          type: PROCESS_PAYMENT_FAILURE,
          payload: result.error.message
        });
        
        dispatch(setError(result.error.message));
        return;
      }
      
      if (result.paymentIntent.status === 'succeeded') {
        // Payment succeeded, confirm with backend
        await dispatch(confirmPayment(result.paymentIntent.id));
      }
    }
    
    dispatch({
      type: PROCESS_PAYMENT_SUCCESS,
      payload: res.data.data
    });
  } catch (err) {
    // Handle token expiration
    if (err.response && err.response.status === 401) {
      try {
        await dispatch(getNewAuthToken());
        // Retry the request with the new token
        return dispatch(processMessagePayment(messageId, paymentMethod));
      } catch (refreshErr) {
        dispatch(setError('Your session has expired. Please log in again.'));
      }
    }
    
    dispatch({
      type: PROCESS_PAYMENT_FAILURE,
      payload: err.response?.data?.message || 'Error processing payment'
    });
    
    dispatch(setError(err.response?.data?.message || 'Error processing payment'));
  }
};

// Confirm Stripe payment
export const confirmPayment = (paymentIntentId) => async (dispatch, getState) => {
  try {
    dispatch({ type: CONFIRM_PAYMENT_REQUEST });
    
    const { token } = getState().auth;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      }
    };
    
    const paymentData = {
      paymentIntentId
    };
    
    const res = await axios.post('/api/messages/payment/confirm', paymentData, config);
    
    dispatch({
      type: CONFIRM_PAYMENT_SUCCESS,
      payload: res.data.data
    });
  } catch (err) {
    // Handle token expiration
    if (err.response && err.response.status === 401) {
      try {
        await dispatch(getNewAuthToken());
        // Retry the request with the new token
        return dispatch(confirmPayment(paymentIntentId));
      } catch (refreshErr) {
        dispatch(setError('Your session has expired. Please log in again.'));
      }
    }
    
    dispatch({
      type: CONFIRM_PAYMENT_FAILURE,
      payload: err.response?.data?.message || 'Error confirming payment'
    });
    
    dispatch(setError(err.response?.data?.message || 'Error confirming payment'));
  }
};

// Update message settings (paid/free)
export const updateMessageSettings = (messageId, settings) => async (dispatch, getState) => {
  try {
    dispatch({ type: UPDATE_MESSAGE_SETTINGS_REQUEST });
    
    const { token } = getState().auth;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      }
    };
    
    const res = await axios.put(`/api/messages/${messageId}/settings`, settings, config);
    
    dispatch({
      type: UPDATE_MESSAGE_SETTINGS_SUCCESS,
      payload: res.data.data
    });
  } catch (err) {
    // Handle token expiration
    if (err.response && err.response.status === 401) {
      try {
        await dispatch(getNewAuthToken());
        // Retry the request with the new token
        return dispatch(updateMessageSettings(messageId, settings));
      } catch (refreshErr) {
        dispatch(setError('Your session has expired. Please log in again.'));
      }
    }
    
    dispatch({
      type: UPDATE_MESSAGE_SETTINGS_FAILURE,
      payload: err.response?.data?.message || 'Error updating message settings'
    });
    
    dispatch(setError(err.response?.data?.message || 'Error updating message settings'));
  }
};
