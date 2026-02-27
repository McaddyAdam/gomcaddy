import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle } from 'lucide-react';
import { getAuthHeader } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';

const API_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${API_URL}/api`;

export const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    const reference = searchParams.get('reference') || searchParams.get('trxref');
    
    if (!reference) {
      setStatus('error');
      setMessage('Invalid payment reference');
      return;
    }

    try {
      const response = await axios.get(`${API}/payment/verify/${reference}`, {
        headers: getAuthHeader()
      });

      if (response.data.status === 'success') {
        setStatus('success');
        setMessage('Payment successful! Your order has been confirmed.');
        setTimeout(() => {
          navigate('/orders');
        }, 2000);
      } else {
        setStatus('error');
        setMessage('Payment verification failed. Please contact support.');
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
      setStatus('error');
      setMessage('Failed to verify payment. Please contact support.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        {status === 'verifying' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold heading-font mb-2" data-testid="verifying-title">{message}</h2>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle className="h-16 w-16 text-secondary mx-auto mb-6" data-testid="success-icon" />
            <h2 className="text-2xl font-bold heading-font mb-2 text-secondary" data-testid="success-title">
              Payment Successful!
            </h2>
            <p className="text-muted-foreground mb-6">{message}</p>
            <Button onClick={() => navigate('/orders')} className="rounded-full" data-testid="view-orders-button">
              View Orders
            </Button>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle className="h-16 w-16 text-destructive mx-auto mb-6" data-testid="error-icon" />
            <h2 className="text-2xl font-bold heading-font mb-2 text-destructive" data-testid="error-title">
              Payment Failed
            </h2>
            <p className="text-muted-foreground mb-6">{message}</p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => navigate('/')} className="rounded-full" data-testid="home-button">
                Go Home
              </Button>
              <Button onClick={() => navigate('/orders')} className="rounded-full" data-testid="orders-button">
                View Orders
              </Button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};