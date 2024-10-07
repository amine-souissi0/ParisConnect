import { useState } from 'react';

export default function AddressForm({ onAddressSubmit }) {
  const [address, setAddress] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    onAddressSubmit(address);
  };

  return (
    <form onSubmit={handleSubmit}>
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
  );
}
