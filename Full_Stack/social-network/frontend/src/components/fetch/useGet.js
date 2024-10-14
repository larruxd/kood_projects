import { useState, useEffect } from 'react';

const useGet = (url, method, bodyData = null) => {
  const [data, setData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const options = {
          method: method,
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        };

        if (bodyData) {
          options.body = JSON.stringify(bodyData);
        }

        const response = await fetch(`http://localhost:8080${url}`, options);

        if (!response.ok) {
          throw new Error(response.statusText || 'Server response not OK');
        }

        const responseData = await response.json();
        setData(responseData);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchData();
  }, [url, method, bodyData]);

  return { data, isLoaded, error };
};

export default useGet;
