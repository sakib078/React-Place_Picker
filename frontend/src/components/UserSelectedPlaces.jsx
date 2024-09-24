import { useEffect, useState } from "react";
import Places from "./Places.jsx";
import ErrorPage from "./Error.jsx";

export default function UserSelectedPlaces({ onSelectPlace, initialPlaces, isFetching, error }) {
  const [availablePlaces, setAvailablePlaces] = useState(initialPlaces);

  useEffect(() => {
    setAvailablePlaces(initialPlaces);
  }, [initialPlaces]);

  if (error) {
    return <ErrorPage message={error.message} />;
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      LoadingText="Fetching the data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
