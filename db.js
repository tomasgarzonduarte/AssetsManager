const API_URL = 'http://localhost:3000';

async function getAllAssets() {
  try {
    const response = await fetch(`${API_URL}/assets`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch assets:", error);
    return [];
  }
}

async function addAsset(asset) {
  try {
    const response = await fetch(`${API_URL}/assets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(asset),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return true; // Success
  } catch (error) {
    console.error("Failed to delete asset:", error);
    return false; // Failure
  }
}

export { getAllAssets, addAsset, deleteAsset };