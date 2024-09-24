import { useEffect, useState, Error } from "react";
import Places from "./Places.jsx";
import ErrorPage from "../components/Error.jsx";
import { sortPlacesByDistance } from "../loc.js";
import fetchProduct from "../http.js";

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setFetching] = useState(false);
  const [availablePlaces, SetavailablePlaces] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchPlaces() {
      setFetching(true);
      try {
        const places = await fetchProduct();

        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            places,
            position.coords.latitude,
            position.coords.longitude
          );
          SetavailablePlaces(sortedPlaces);
        });

        setFetching(false);
      } catch (error) {
        setError({
          message: error.message || "Can not Get the products, try again",
        });
        setFetching(false);
      }
    }

    fetchPlaces();
  }, []);

  // console.log(` availPlaces : ${JSON.stringify(availablePlaces)}`);

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
