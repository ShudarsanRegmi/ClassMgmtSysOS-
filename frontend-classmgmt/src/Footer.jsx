import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#0d1117',
      color: '#ffffff',
      padding: '1rem',
      textAlign: 'center',
      width: '100%',
      marginTop: 'auto',
      fontSize: '0.9rem',
      boxShadow: '0 -1px 4px rgba(0, 0, 0, 0.2)'
    }}>
      <p>© {new Date().getFullYear()} ClassRoomManagement. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
