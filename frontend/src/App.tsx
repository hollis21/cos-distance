import React, { useEffect, useState } from 'react';
import './App.css';
import { IPoI, PoIService } from './services/poi.service';
import { ComboBox, IComboBox, IComboBoxOption, Label, MessageBar, MessageBarType, Spinner, Stack } from '@fluentui/react';
import { calculateDistance } from './helpers/distanceCalculator';

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

  const fromOnChange = React.useCallback(
    (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string): void => {
      setFromLocation(option?.key?.toString() || null);
    },
    []
  );
  const toOnChange = React.useCallback(
    (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string): void => {
      setToLocation(option?.key?.toString() || null);
    },
    []
  );

  const distance = calculateDistance(fromLocation, toLocation, pois);
  return (
    <>
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
            onChange={fromOnChange}
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
            onChange={toOnChange}
            allowFreeInput
            autoComplete="on" />
        </Stack>
      }
    </>
  );
}

export default App;

