import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import PreviewIcon from '@mui/icons-material/Preview';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

export default function SideBar({ images }) {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  let organiserId = localStorage.getItem('organiserId');

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const itemList = [
    {
      text: images?.length === 0 ? 'Add Venue Photos' : 'View Venue Photos',
      icon: <AddPhotoAlternateIcon style={{ fill: 'grey' }} />,
      to:
        images?.length === 0
          ? `/organiser/add_venue`
          : `/organiser/view_venuePhotos/${organiserId}`,
    },
    {
      text: 'View Bookings',
      icon: <PreviewIcon style={{ fill: 'grey' }} />,
      to: '/add-todo',
    },
    {
      text: 'View Artist Requests',
      icon: <PreviewIcon style={{ fill: 'grey' }} />,
      to: `/organiser/artistsRequest/${organiserId}`,
    },
    {
      text: 'Profile',
      icon: <AccountCircleIcon style={{ fill: 'grey' }} />,
      to: '/organiser/profile',
    },
  ];

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role='presentation'
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {itemList.map((text, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton>
              <a className='flex items-center w-full' href={text.to}>
                <ListItemIcon>{text.icon}</ListItemIcon>
                <ListItemText primary={text.text} />
              </a>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div className='m-5'>
      {(['left'] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <Button variant='outlined' onClick={toggleDrawer(anchor, true)}>
            <div className='text-white'>Event Organisers' Menu</div>
          </Button>
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  );
}
