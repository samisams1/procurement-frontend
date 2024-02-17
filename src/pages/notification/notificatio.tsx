import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface EventData {
  id: number;
  type: string;
  message: string;
  recipientId: number;
  timestamp: string;
  status: string;
  updatedAt: string;
  createdAt: string;
}
const Notification: React.FC = () => {
  useEffect(() => {
    const eventSource = new EventSource('/events'); // Replace with your event source URL

    const handleEvent = (event: Event) => {
      const eventData: EventData = JSON.parse((event as MessageEvent).data);
      console.log('Received ORDER_CREATED event:', eventData);
      showNotification('Order Created!', `Order ID: ${eventData.id}`);
    };

    eventSource.addEventListener('ORDER_CREATED', handleEvent);

    return () => {
      eventSource.removeEventListener('ORDER_CREATED', handleEvent);
    };
  }, []);

  const showNotification = (title: string, message: string) => {
    toast.info(
      <div>
        <h2>{title}</h2>
        <p>{message}</p>
      </div>,
      {
        position: 'top-right', // Specify the position as a string
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
    );
  };

  return (
    <div>
      <ToastContainer />
      {/* Rest of your component */}
    </div>
  );
};

export default Notification;