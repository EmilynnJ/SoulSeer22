// client/src/redux/actions/productActions.js
import axios from 'axios';
import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  FETCH_PRODUCT_REQUEST,
  FETCH_PRODUCT_SUCCESS,
  FETCH_PRODUCT_FAILURE,
  FETCH_FEATURED_PRODUCTS_REQUEST,
  FETCH_FEATURED_PRODUCTS_SUCCESS,
  FETCH_FEATURED_PRODUCTS_FAILURE,
  FETCH_CATEGORIES_REQUEST,
  FETCH_CATEGORIES_SUCCESS,
  FETCH_CATEGORIES_FAILURE,
  FETCH_AUTHOR_PRODUCTS_REQUEST,
  FETCH_AUTHOR_PRODUCTS_SUCCESS,
  FETCH_AUTHOR_PRODUCTS_FAILURE,
  FETCH_RELATED_PRODUCTS_REQUEST,
  FETCH_RELATED_PRODUCTS_SUCCESS,
  FETCH_RELATED_PRODUCTS_FAILURE,
  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_FAILURE,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAILURE,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAILURE,
  TOGGLE_FEATURED_REQUEST,
  TOGGLE_FEATURED_SUCCESS,
  TOGGLE_FEATURED_FAILURE
} from './types';
import { setError } from './errorActions';
import { getNewAuthToken } from './authActions';

// Fetch products with filters
export const fetchProducts = (filters = {}, reset = true) => async (dispatch, getState) => {
  try {
    if (reset) {
      dispatch({ type: FETCH_PRODUCTS_REQUEST });
    }
    
    // Build query string from filters
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const res = await axios.get(`/api/products?${queryParams.toString()}`);
    
    dispatch({
      type: FETCH_PRODUCTS_SUCCESS,
      payload: res.data,
      append: !reset
    });
    
    return res.data;
  } catch (err) {
    dispatch({
      type: FETCH_PRODUCTS_FAILURE,
      payload: err.response?.data?.message || 'Error fetching products'
    });
    
    dispatch(setError(err.response?.data?.message || 'Error fetching products'));
    throw err;
  }
};

// Fetch product by ID
export const fetchProductById = (productId) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_PRODUCT_REQUEST });
    
    const res = await axios.get(`/api/products/${productId}`);
    
    dispatch({
      type: FETCH_PRODUCT_SUCCESS,
      payload: res.data.data
    });
    
    return res.data.data;
  } catch (err) {
    dispatch({
      type: FETCH_PRODUCT_FAILURE,
      payload: err.response?.data?.message || 'Error fetching product'
    });
    
    dispatch(setError(err.response?.data?.message || 'Error fetching product'));
    throw err;
  }
};

// Fetch featured products
export const fetchFeaturedProducts = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_FEATURED_PRODUCTS_REQUEST });
    
    const res = await axios.get('/api/products/featured');
    
    dispatch({
      type: FETCH_FEATURED_PRODUCTS_SUCCESS,
      payload: res.data.data
    });
    
    return res.data.data;
  } catch (err) {
    dispatch({
      type: FETCH_FEATURED_PRODUCTS_FAILURE,
      payload: err.response?.data?.message || 'Error fetching featured products'
    });
    
    dispatch(setError(err.response?.data?.message || 'Error fetching featured products'));
    throw err;
  }
};

// Fetch product categories
export const fetchCategories = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_CATEGORIES_REQUEST });
    
    const res = await axios.get('/api/products/categories');
    
    dispatch({
      type: FETCH_CATEGORIES_SUCCESS,
      payload: res.data.data
    });
    
    return res.data.data;
  } catch (err) {
    dispatch({
      type: FETCH_CATEGORIES_FAILURE,
      payload: err.response?.data?.message || 'Error fetching categories'
    });
    
    dispatch(setError(err.response?.data?.message || 'Error fetching categories'));
    throw err;
  }
};

// Fetch products by author
export const fetchAuthorProducts = (authorId, filters = {}) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_AUTHOR_PRODUCTS_REQUEST });
    
    // Build query string from filters
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const res = await axios.get(`/api/products/author/${authorId}?${queryParams.toString()}`);
    
    dispatch({
      type: FETCH_AUTHOR_PRODUCTS_SUCCESS,
      payload: res.data
    });
    
    return res.data;
  } catch (err) {
    dispatch({
      type: FETCH_AUTHOR_PRODUCTS_FAILURE,
      payload: err.response?.data?.message || 'Error fetching author products'
    });
    
    dispatch(setError(err.response?.data?.message || 'Error fetching author products'));
    throw err;
  }
};

// Fetch related products
export const fetchRelatedProducts = (productId, type, categories = []) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_RELATED_PRODUCTS_REQUEST });
    
    // Build query for related products (same type and categories)
    const queryParams = new URLSearchParams();
    queryParams.append('type', type);
    
    if (categories.length > 0) {
      queryParams.append('category', categories[0]);
    }
    
    // Limit to 3 related products
    queryParams.append('limit', 3);
    
    const res = await axios.get(`/api/products?${queryParams.toString()}`);
    
    // Filter out the current product
    const relatedProducts = res.data.data.filter(product => product._id !== productId);
    
    dispatch({
      type: FETCH_RELATED_PRODUCTS_SUCCESS,
      payload: relatedProducts
    });
    
    return relatedProducts;
  } catch (err) {
    dispatch({
      type: FETCH_RELATED_PRODUCTS_FAILURE,
      payload: err.response?.data?.message || 'Error fetching related products'
    });
    
    dispatch(setError(err.response?.data?.message || 'Error fetching related products'));
    throw err;
  }
};

// Create product
export const createProduct = (productData) => async (dispatch, getState) => {
  try {
    dispatch({ type: CREATE_PRODUCT_REQUEST });
    
    const { token } = getState().auth;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      }
    };
    
    const res = await axios.post('/api/products', productData, config);
    
    dispatch({
      type: CREATE_PRODUCT_SUCCESS,
      payload: res.data.data
    });
    
    return res.data.data;
  } catch (err) {
    // Handle token expiration
    if (err.response && err.response.status === 401) {
      try {
        await dispatch(getNewAuthToken());
        // Retry with new token
        return dispatch(createProduct(productData));
      } catch (refreshErr) {
        dispatch(setError('Your session has expired. Please log in again.'));
      }
    }
    
    dispatch({
      type: CREATE_PRODUCT_FAILURE,
      payload: err.response?.data?.message || 'Error creating product'
    });
    
    dispatch(setError(err.response?.data?.message || 'Error creating product'));
    throw err;
  }
};

// Update product
export const updateProduct = (productId, productData) => async (dispatch, getState) => {
  try {
    dispatch({ type: UPDATE_PRODUCT_REQUEST });
    
    const { token } = getState().auth;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      }
    };
    
    const res = await axios.put(`/api/products/${productId}`, productData, config);
    
    dispatch({
      type: UPDATE_PRODUCT_SUCCESS,
      payload: res.data.data
    });
    
    return res.data.data;
  } catch (err) {
    // Handle token expiration
    if (err.response && err.response.status === 401) {
      try {
        await dispatch(getNewAuthToken());
        // Retry with new token
        return dispatch(updateProduct(productId, productData));
      } catch (refreshErr) {
        dispatch(setError('Your session has expired. Please log in again.'));
      }
    }
    
    dispatch({
      type: UPDATE_PRODUCT_FAILURE,
      payload: err.response?.data?.message || 'Error updating product'
    });
    
    dispatch(setError(err.response?.data?.message || 'Error updating product'));
    throw err;
  }
};

// Delete product
export const deleteProduct = (productId) => async (dispatch, getState) => {
  try {
    dispatch({ type: DELETE_PRODUCT_REQUEST });
    
    const { token } = getState().auth;
    
    const config = {
      headers: {
        'x-auth-token': token
      }
    };
    
    await axios.delete(`/api/products/${productId}`, config);
    
    dispatch({
      type: DELETE_PRODUCT_SUCCESS,
      payload: productId
    });
    
    return { success: true };
  } catch (err) {
    // Handle token expiration
    if (err.response && err.response.status === 401) {
      try {
        await dispatch(getNewAuthToken());
        // Retry with new token
        return dispatch(deleteProduct(productId));
      } catch (refreshErr) {
        dispatch(setError('Your session has expired. Please log in again.'));
      }
    }
    
    dispatch({
      type: DELETE_PRODUCT_FAILURE,
      payload: err.response?.data?.message || 'Error deleting product'
    });
    
    dispatch(setError(err.response?.data?.message || 'Error deleting product'));
    throw err;
  }
};

// Toggle product featured status (admin only)
export const toggleProductFeatured = (productId) => async (dispatch, getState) => {
  try {
    dispatch({ type: TOGGLE_FEATURED_REQUEST });
    
    const { token } = getState().auth;
    
    const config = {
      headers: {
        'x-auth-token': token
      }
    };
    
    const res = await axios.put(`/api/products/${productId}/featured`, {}, config);
    
    dispatch({
      type: TOGGLE_FEATURED_SUCCESS,
      payload: res.data.data
    });
    
    return res.data.data;
  } catch (err) {
    // Handle token expiration
    if (err.response && err.response.status === 401) {
      try {
        await dispatch(getNewAuthToken());
        // Retry with new token
        return dispatch(toggleProductFeatured(productId));
      } catch (refreshErr) {
        dispatch(setError('Your session has expired. Please log in again.'));
      }
    }
    
    dispatch({
      type: TOGGLE_FEATURED_FAILURE,
      payload: err.response?.data?.message || 'Error toggling featured status'
    });
    
    dispatch(setError(err.response?.data?.message || 'Error toggling featured status'));
    throw err;
  }
};
