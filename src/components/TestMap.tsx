import React from "react";
import GoogleMapReact from "google-map-react";

const AnyReactComponent = () => <div>123</div>;

type SimpleMapProps = {
  lat: number;
  lng: number;
};

export default function SimpleMap({ lat, lng }: SimpleMapProps) {
  const defaultProps = {
    center: {
      lat: lat,
      lng: lng,
    },
    zoom: 11,
  };

  return (
    // Important! Always set the container height explicitly
    <div style={{ height: "100vh", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "" }}
        center={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        <AnyReactComponent lat={lat} lng={lng} />
      </GoogleMapReact>
    </div>
  );
}
