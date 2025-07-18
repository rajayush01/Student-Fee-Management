import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('paymentUpdate', (updatedStudent) => {
      setStudents(prev => 
        prev.map(student => 
          student._id === updatedStudent.studentId
            ? { ...student, feesPaid: updatedStudent.feesPaid }
            : student
        )
      );
    });

    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={{ socket, students, setStudents }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
