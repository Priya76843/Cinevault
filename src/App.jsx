import { useEffect } from 'react';
import { getMovieById } from './services/omdbApi';

function App() {
  useEffect(() => {
    async function testAPI() {
      try {
        const movie = await getMovieById('tt0816692');

        console.log('OMDb movie:', movie);
      } catch (error) {
        console.error('OMDb error:', error);
      }
    }

    testAPI();
  }, []);

  return (
    <main>
      <h1>CineVault API Test</h1>
    </main>
  );
}

export default App;