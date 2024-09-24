import { useRef, useState, useEffect, useCallback } from "react";
import Places from "./components/Places.jsx";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import AvailablePlaces from "./components/AvailablePlaces.jsx";
import UserSelectedPlaces from "./components/userSelectedPlaces.jsx";
import { putProduct, fetchUserPlaces } from "./http.js";
import ErrorPage from "./components/Error.jsx";

function App() {
  
  const selectedPlace = useRef();
  const [userPlaces, setUserPlaces] = useState([]);
  const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isFetching, setFetching] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchUserPlace() {
      setFetching(true);
      try {
        const userPlaces = await fetchUserPlaces();
        setUserPlaces(userPlaces);
        setFetching(false);
      } catch (error) {
        setError({
          message: error.message || "Cannot get the products, try again",
        });
        setFetching(false);
      }
    }

    fetchUserPlace();
  }, []);

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  async function handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });

    const updatedData = [selectedPlace, ...userPlaces];
    try {
      await putProduct(updatedData);
    } catch (error) {
      setUserPlaces(userPlaces);
      setErrorUpdatingPlaces({
        message: error.message || "Failed to update places",
      });
    }
  }

  const handleRemovePlace = useCallback(async function handleRemovePlace() {
    setUserPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current.id)
    );

    const user = userPlaces.filter((place) => place.id !== selectedPlace.current.id);
    console.log("user s: ", user);
    try {
      await putProduct(user);
    } catch (error) {
      setUserPlaces(userPlaces);
      setErrorUpdatingPlaces({
        message: error.message || "Failed to update places",
      });
    }

    setModalIsOpen(false);
  }, [userPlaces]);

  function handleError() {
    setErrorUpdatingPlaces(null);
  }

  return (
    <>
      <Modal open={errorUpdatingPlaces} onClose={handleError}>
        {errorUpdatingPlaces && (
          <ErrorPage error="ERROR" message={errorUpdatingPlaces.message} onConfirm={handleError} />
        )}
      </Modal>

      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation onCancel={handleStopRemovePlace} onConfirm={handleRemovePlace} />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>Create your personal collection of places you would like to visit or you have visited.</p>
      </header>
      <main>
        <UserSelectedPlaces
          onSelectPlace={handleStartRemovePlace}
          initialPlaces={userPlaces}
          isFetching={isFetching}
          error={error}
        />
        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
