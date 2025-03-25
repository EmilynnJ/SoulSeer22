// client/src/redux/reducers/messageReducer.js
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
} from '../actions/types';

const initialState = {
  messages: [],
  loading: false,
  paymentProcessing: false,
  error: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_MESSAGES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case FETCH_MESSAGES_SUCCESS:
      return {
        ...state,
        messages: action.payload,
        loading: false,
        error: null
      };
    
    case FETCH_MESSAGES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    case SEND_MESSAGE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case SEND_MESSAGE_SUCCESS:
      return {
        ...state,
        messages: [...state.messages, action.payload],
        loading: false,
        error: null
      };
    
    case SEND_MESSAGE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    case PROCESS_PAYMENT_REQUEST:
    case CONFIRM_PAYMENT_REQUEST:
      return {
        ...state,
        paymentProcessing: true,
        error: null
      };
    
    case PROCESS_PAYMENT_SUCCESS:
      // Payment initiated successfully, may not be completed yet if using Stripe
      return {
        ...state,
        paymentProcessing: action.payload.payment?.status !== 'completed',
        error: null
      };
    
    case CONFIRM_PAYMENT_SUCCESS:
      // Update the message in the messages array
      return {
        ...state,
        messages: state.messages.map(message => 
          message._id === action.payload.message._id 
            ? { ...message, ...action.payload.message } 
            : message
        ),
        paymentProcessing: false,
        error: null
      };
    
    case PROCESS_PAYMENT_FAILURE:
    case CONFIRM_PAYMENT_FAILURE:
      return {
        ...state,
        paymentProcessing: false,
        error: action.payload
      };
    
    case UPDATE_MESSAGE_SETTINGS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case UPDATE_MESSAGE_SETTINGS_SUCCESS:
      // Update the message in the messages array
      return {
        ...state,
        messages: state.messages.map(message => 
          message._id === action.payload._id 
            ? { ...message, ...action.payload } 
            : message
        ),
        loading: false,
        error: null
      };
    
    case UPDATE_MESSAGE_SETTINGS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    default:
      return state;
  }
}
