import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [servers, setServers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/status');
        setServers(response.data);
      } catch (error) {
        console.error('Error fetching server data:', error);
      }
    };

    fetchData();
  }, []);

  const checkServerHealth = (index) => {
    axios.get(`http://localhost:8000/check/${index}`)
      .then((response) => {
        if (response.status === 200) {
          const updatedServers = [...servers];
          updatedServers[index].isHealthy = true;
          setServers(updatedServers);
        }
      })
      .catch((error) => {
        console.error('Error checking server health:', error);
      });
  };

  return (
    <div className="App">
      <h1>Load Balancer Frontend</h1>
      <ul>
        {servers.map((server, index) => (
          <li key={index}>
            <p>{server.target} is {server.isHealthy ? 'healthy' : 'unhealthy'}</p>
            <button onClick={() => checkServerHealth(index)}>Check Health</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
