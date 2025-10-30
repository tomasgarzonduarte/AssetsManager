const API_URL = 'http://localhost:3000';

async function getAllAssets() {
  try {
    const response = await fetch(`${API_URL}/assets`);
    if (!response.ok) {
      // This helps catch server errors like 404 or 500
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch assets:", error);
    return []; // **THE FIX: Always return an empty array on error.**
  }
}

async function addAsset(formData) {
  try {
    const response = await fetch(`${API_URL}/assets`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to add asset:", error);
    return null;
  }
}

async function deleteAsset(id) {
  try {
    const response = await fetch(`${API_URL}/assets/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true; // Success
  } catch (error) {
    console.error("Failed to delete asset:", error);
    return false; // Failure
  }
}

export { getAllAssets, addAsset, deleteAsset };