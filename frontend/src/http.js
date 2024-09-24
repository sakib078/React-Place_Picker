export default async function fetchProduct() {
    const res = await fetch("http://localhost:3000/places");
    const json = await res.json();
  
    if (!res.ok) {
      throw new Error("Failed to fetch places");
    }
  
    return json.places;
  }
  
  export async function fetchUserPlaces() {
    const res = await fetch("http://localhost:3000/user-places");
    const json = await res.json();
  
    if (!res.ok) {
      throw new Error("Failed to fetch places");
    }
  
    return json.places;
  }
  
  export async function putProduct(places) {
    try {
      const res = await fetch("http://localhost:3000/user-places", {
        method: "PUT",
        body: JSON.stringify({ places }), // Send the wrapped data
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!res.ok) {
        throw new Error("Failed to update user data");
      }
  
      const json = await res.json();
      return json.message;
    } catch (error) {
      console.error("Error updating places:", error);
      throw error;
    }
  }
  