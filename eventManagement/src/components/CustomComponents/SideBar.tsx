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

type Anchor = 'top' | 'left' | 'bottom' | 'right';

export default function SideBar() {
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
    <div className='mt-5'>
      {(['left'] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <Button
            variant='outlined'
            style={{ color: 'white' }}
            onClick={toggleDrawer(anchor, true)}
          >
            Event Partners
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
