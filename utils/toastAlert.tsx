import React from 'react';
import { toast } from 'react-toastify';

const toastAlert = ({
  message,
  type,
  options = {
    position: 'top-center',
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'light'
  }
}: {
  message: string;
  type: string;
  options?: any;
}) => {
  if (type === 'error') {
    toast.error(message, { ...options });
  } else if (type === 'success') {
    toast.success(message, { ...options });
  }
};

export default toastAlert;
