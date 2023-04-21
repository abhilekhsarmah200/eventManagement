import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import PreviewIcon from '@mui/icons-material/Preview';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

export default function SideBar() {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

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
      text: 'Add Vanue',
      icon: <AccountCircleIcon style={{ fill: 'white' }} />,
      to: '/create',
    },
    {
      text: 'View Bookings',
      // icon: <AddBoxTwoToneIcon style={{ fill: 'white' }} />,
      to: '/add-todo',
    },
    {
      text: 'View Artist',
      // icon: <AddBoxTwoToneIcon style={{ fill: 'white' }} />,
      to: '/add-todo',
    },
    {
      text: 'Profile',
      icon: <AccountCircleIcon style={{ fill: 'white' }} />,
      to: '/add-todo',
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
              <ListItemIcon>{text.icon}</ListItemIcon>
              <a href={text.to}>
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
          <Button onClick={toggleDrawer(anchor, true)}>
            {
              <MenuOpenIcon
                style={{
                  fontSize: '2.5rem',
                  color: 'black',
                  borderRadius: '25px',
                }}
              />
            }
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
