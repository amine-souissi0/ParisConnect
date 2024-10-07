"use client"; // Add this at the top

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Note: next/navigation for Next.js 13+

export default function AddressPage() {
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate the address using the API
      const isValid = await validateAddress(address);
      if (isValid) {
        alert('Address is valid and within 50 km of Paris.');
        // Redirect to timeline after successful validation
        router.push('/timeline');
      } else {
        setError('Address is too far from Paris. Please enter a valid address.');
      }
    } catch (error) {
      setError('Failed to validate address. Please try again.');
    }
  };

  return (
    <div className="address-form">
      <form onSubmit={handleAddressSubmit}>
        <label htmlFor="address">Please enter your address:</label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <button type="submit">Validate Address</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

// Function to validate the address
async function validateAddress(address) {
  const parisLatitude = 48.8566;
  const parisLongitude = 2.3522;

  try {
    const { latitude, longitude } = await getCoordinates(address);
    const distance = calculateDistance(latitude, longitude, parisLatitude, parisLongitude);
    return distance <= 50; // If within 50 km of Paris
  } catch (error) {
    console.error('Failed to validate address:');
    return false;
  }
}

// Function to fetch coordinates from the API
async function getCoordinates(address) {
  const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(address)}`);
  const data = await response.json();

  if (data.features.length === 0) {
    throw new Error('Address not found.');
  }

  const [longitude, latitude] = data.features[0].geometry.coordinates;
  return { latitude, longitude };
}

// Function to calculate the distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}
