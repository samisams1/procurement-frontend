import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface MapProps {
  latitude: number;
  longitude: number;
}

const GoogleMapComponent: React.FC<MapProps> = ({ latitude, longitude }) => {
  const containerStyle = {
    width: '100%',
    height: '400px'
  };

  const center = {
    lat: latitude,
    lng: longitude
  };

  return (
    <LoadScript googleMapsApiKey="YOUR_API_KEY">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;