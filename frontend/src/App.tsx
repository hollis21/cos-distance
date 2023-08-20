import { useEffect, useState } from 'react';
import './App.css';
import { IPoI, PoIService } from './services/poi.service';
import { ComboBox, Label, MessageBar, MessageBarType, Spinner, Stack } from '@fluentui/react';
import { calculateDistance } from './helpers/distanceCalculator';
import HexMap from './features/hexmap/hexmap';

function App() {
  const [pois, setPois] = useState<IPoI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromOptions, setFromOptions] = useState<{ key: string, text: string }[]>([]);
  const [toOptions, setToOptions] = useState<{ key: string, text: string }[]>([]);
  const [fromLocation, setFromLocation] = useState<string | null>(null);
  const [toLocation, setToLocation] = useState<string | null>(null);

  useEffect(() => {
    const loadPoIData = async () => {
      try {
        const pois = await (new PoIService()).getPoIs();
        const options = pois.map(poi => ({ key: poi.id, text: poi.name }));

        setPois(pois);
        setFromOptions(options);
        setToOptions(options);
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

  const distance = calculateDistance(fromLocation, toLocation, pois);

  return (
    <>
      <Stack>
        {isLoading && <Spinner label="Loading..." />}
        {error &&
          <MessageBar
            messageBarType={MessageBarType.error}>
            {error}
          </MessageBar>}
        {!isLoading &&
          <Stack
            horizontal
            tokens={{ childrenGap: 25 }}
          >
            <ComboBox
              label="Coming from:"
              options={fromOptions}
              selectedKey={fromLocation}
              onChange={(ev, option) => setFromLocation(option?.key?.toString() || null)}
              allowFreeInput
              autoComplete="on" />
            <Stack styles={{ root: { alignItems: "center" } }}>
              <Label>Distance (in hexes)</Label>
              <Label>{distance}</Label>
            </Stack>
            <ComboBox
              label="Going to:"
              options={toOptions}
              selectedKey={toLocation}
              onChange={(ev, option) => setToLocation(option?.key?.toString() || null)}
              allowFreeInput
              autoComplete="on" />
          </Stack>
        }
        <HexMap />
      </Stack>
    </>
  );
}

export default App;

