const API_URL = 'http://localhost:3000';

/**
 * Fetches all assets from the backend server.
 */
async function getAllAssets() {
  try {
    const response = await fetch(`${API_URL}/assets`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch assets:", error);
    return []; // Return an empty array on failure
  }
}

/**
 * Adds a new asset by sending it to the backend server.
 * @param {object} asset - The asset object to add.
 */
async function addAsset(asset) {
  try {
    const response = await fetch(`${API_URL}/assets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(asset),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to add asset:", error);
    return null; // Return null on failure
  }
}

// We are exporting the functions directly
export { getAllAssets, addAsset };