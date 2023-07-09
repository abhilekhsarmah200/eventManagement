import React, { useEffect, useState } from 'react';
import SimpleDataTableBookings from './ArtistsTable/DataTable';

export default function ViewArtistsList({ logindata }) {
  const [userData, setUserData] = useState([]);

  const viewDetails = async () => {
    const res = await fetch(`http://localhost:8010/getAllArtistsList`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    setUserData(data);
    console.log({ data });
  };

  useEffect(() => {
    viewDetails();
  }, []);

  console.log({ userData });
  return (
    <div>
      <SimpleDataTableBookings users={userData} />
    </div>
  );
}
