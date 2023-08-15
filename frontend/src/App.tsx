import { useEffect, useState } from 'react';
import './App.css';
import { PoIService } from './services/poi.service';
import { ComboBox, MessageBar, MessageBarType, Spinner } from '@fluentui/react';

async function RetrieveData() {
  console.log(await (new PoIService().getPoIs()));
}

function App() {
  const [pois, setPois] = useState<{ key: string, text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPoIData = async () => {
      try {
        const pois = await (new PoIService()).getPoIs();
        const options = pois.map(poi => ({ key: poi.id, text: poi.name }));
        // Do any normalizing or modifying of data here.
        setPois(options);
      } catch (error) {
        if (error instanceof Error && error.message) {
          setError(error.message);
        } else {
          setError('An error occurred when loading PoIs');
        }
        setPois([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadPoIData();
  }, []);

  return (
    <>
        {isLoading && <Spinner label="I am definitely loading..." />}
        {error &&
          <MessageBar
            messageBarType={MessageBarType.error}>
            {error}
          </MessageBar>}
        {!isLoading && 
          <ComboBox
            label="Coming from:"
            options={pois}
            allowFreeInput
            autoComplete="on" />}
    </>
  );
}

export default App;
