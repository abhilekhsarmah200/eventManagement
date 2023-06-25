import { Button } from '@mui/material';
import React from 'react';

export default function Admin() {
  return (
    <div>
      <>
        <Button variant='outlined'>
          <a href='/admin/view-users'>View Users</a>
        </Button>
      </>
    </div>
  );
}
