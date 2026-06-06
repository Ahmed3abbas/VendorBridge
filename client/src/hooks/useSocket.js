import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import useAuthStore from '../store/authStore';
import useNotificationStore from '../store/notificationStore';

const EVENTS = {
  'rfq:created':           (d) => ({ title: 'New RFQ', message: `RFQ "${d.rfq_title}" created`, link: `/rfq/${d.rfq_id}` }),
  'quotation:submitted':   (d) => ({ title: 'Quotation Received', message: `New quote for "${d.rfq_title}"`, link: `/rfq/${d.rfq_id}/compare` }),
  'approval:new':          (d) => ({ title: 'Approval Needed', message: `Quotation for "${d.rfq_title}" awaits approval`, link: '/approvals' }),
  'approval:approved':     (d) => ({ title: 'Approved!', message: `PO ${d.po_number} generated`, link: '/purchase-orders' }),
  'approval:rejected':     ()  => ({ title: 'Quotation Rejected', message: 'Your quotation was rejected', link: '/rfq' }),
};

export function useSocket() {
  const { accessToken, isAuthenticated } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;

    const socket = io('/', {
      auth: { token: accessToken },
      transports: ['websocket'],
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    Object.entries(EVENTS).forEach(([event, builder]) => {
      socket.on(event, (data) => {
        addNotification(builder(data));
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, accessToken, addNotification]);

  return socketRef;
}
