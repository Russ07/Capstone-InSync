import React, { useEffect } from 'react';

function Authorisation() {
    useEffect(() => {
        window.location.href = 'http://localhost:3000/auth/spotify';
      }, []);

  return (
    <div className="authorisation">
    </div>
  );
}

export default Authorisation;
