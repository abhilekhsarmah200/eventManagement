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
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

export default function SideBar({ logindata, images }) {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  let userId = localStorage.getItem('userId');

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
  const itemListLogin = [
    {
      text: 'Please Login ...',
      icon: <HomeIcon style={{ fill: 'grey' }} />,
      to: `/login`,
    },
  ];

  const itemList = [
    {
      text: 'Home',
      icon: <HomeIcon style={{ fill: 'grey' }} />,
      to: `/`,
    },
    {
      text: 'View Bookings',
      icon: <PreviewIcon style={{ fill: 'grey' }} />,
      to: `/view_bookings/${userId}`,
    },
    {
      text: 'Profile',
      icon: <AccountCircleIcon style={{ fill: 'grey' }} />,
      to: '/profile',
    },
  ];

  const itemList2 = [
    {
      text: 'Home',
      icon: <HomeIcon style={{ fill: 'grey' }} />,
      to: '/admin/profile',
    },
    {
      text: 'View Bookings',
      icon: <PreviewIcon style={{ fill: 'grey' }} />,
      to: '/admin/view-bookings',
    },
    {
      text: 'View Artist',
      icon: <PreviewIcon style={{ fill: 'grey' }} />,
      to: '/admin/artists_list',
    },
    {
      text: 'View Organisers',
      icon: <PreviewIcon style={{ fill: 'grey' }} />,
      to: '/admin/view-users',
    },
    {
      text: 'Profile',
      icon: <AccountCircleIcon style={{ fill: 'grey' }} />,
      to: '/admin/profile',
    },
  ];

  const itemList3 = [
    {
      text: 'Home',
      icon: <HomeIcon style={{ fill: 'grey' }} />,
      to: '/',
    },
    {
      text: images?.length === 0 ? 'Add Venue Photos' : 'View Venue Photos',
      icon: <AddPhotoAlternateIcon style={{ fill: 'grey' }} />,
      to:
        images?.length === 0
          ? `/organiser/add_venue`
          : `/organiser/view_venuePhotos/${userId}`,
    },
    {
      text: 'View Bookings',
      icon: <PreviewIcon style={{ fill: 'grey' }} />,
      to: '/organiser/view-bookings',
    },
    {
      text: 'View Artist Requests',
      icon: <PreviewIcon style={{ fill: 'grey' }} />,
      to: `/organiser/artistsRequest/${userId}`,
    },
    {
      text: 'Profile',
      icon: <AccountCircleIcon style={{ fill: 'grey' }} />,
      to: '/',
    },
  ];
  const itemList4 = [
    {
      text: 'Home',
      icon: <HomeIcon style={{ fill: 'grey' }} />,
      to: '/',
    },
    {
      text: 'Join with Venues',
      icon: <AddBusinessIcon style={{ fill: 'grey' }} />,
      to: '/artists/join_venue',
    },
    {
      text: 'View Bookings',
      icon: <PreviewIcon style={{ fill: 'grey' }} />,
      to: '/artists/view-your-booking/:id',
    },
    {
      text: 'View Artist',
      icon: <PreviewIcon style={{ fill: 'grey' }} />,
      to: '/artists/viewArtists',
    },
    {
      text: 'Profile',
      icon: <AccountCircleIcon style={{ fill: 'grey' }} />,
      to: '/artists/profile',
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
        {logindata ? (
          <>
            {logindata?.ValidUserOne?.role === 'USER' ? (
              <>
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
              </>
            ) : logindata?.ValidUserOne?.role === 'ADMIN' ? (
              <>
                {itemList2.map((text, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemButton>
                      <a className='flex items-center w-full' href={text.to}>
                        <ListItemIcon>{text.icon}</ListItemIcon>
                        <ListItemText primary={text.text} />
                      </a>
                    </ListItemButton>
                  </ListItem>
                ))}
              </>
            ) : logindata?.ValidUserOne?.role === 'ORGANISER' ? (
              <>
                {itemList3.map((text, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemButton>
                      <a className='flex items-center w-full' href={text.to}>
                        <ListItemIcon>{text.icon}</ListItemIcon>
                        <ListItemText primary={text.text} />
                      </a>
                    </ListItemButton>
                  </ListItem>
                ))}
              </>
            ) : (
              <>
                {itemList4.map((text, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemButton>
                      <a className='flex items-center w-full' href={text.to}>
                        <ListItemIcon>{text.icon}</ListItemIcon>
                        <ListItemText primary={text.text} />
                      </a>
                    </ListItemButton>
                  </ListItem>
                ))}
              </>
            )}
          </>
        ) : (
          <>
            {itemListLogin.map((text, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton>
                  <a className='flex items-center w-full' href={text.to}>
                    <ListItemIcon>{text.icon}</ListItemIcon>
                    <ListItemText primary={text.text} />
                  </a>
                </ListItemButton>
              </ListItem>
            ))}
          </>
        )}
      </List>
    </Box>
  );

  return (
    <div>
      {(['left'] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <Button
            variant='outlined'
            style={{ color: 'white' }}
            onClick={toggleDrawer(anchor, true)}
          >
            <MenuIcon className='text-white' />
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
