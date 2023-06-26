import React from 'react';
import ViewUsers from '../CustomComponents/ViewUsers';

import AdminProfile from '../Admin/components/Admin/AdminProfile';
import DashboardOrganisers from '../Organisers/components/Users/Dashboard';
import ArtistsDashboard from '../Artists/Dashboard';

export default function index({ logindataRole, logindata }) {
  return (
    <div>
      {logindataRole === 'USER' ? (
        <ViewUsers />
      ) : logindataRole === 'ADMIN' ? (
        <AdminProfile logindata={logindata} />
      ) : logindataRole === 'ORGANISER' ? (
        <DashboardOrganisers logindata={logindata} />
      ) : (
        <ArtistsDashboard logindata={logindata} />
      )}
    </div>
  );
}
