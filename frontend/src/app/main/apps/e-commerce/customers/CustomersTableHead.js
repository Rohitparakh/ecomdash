import Checkbox from '@material-ui/core/Checkbox';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import clsx from 'clsx';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { removeCustomers } from '../store/customersSlice';

const rows = [
  {
    id: 'id',
    align: 'left',
    disablePadding: false,
    label: 'ID',
    sort: true,
  },
  {
    id: 'customer',
    align: 'left',
    disablePadding: false,
    label: 'Customer',
    sort: true,
  },
  {
    id: 'lifetime-value',
    align: 'left',
    disablePadding: false,
    label: 'Lifetime Value',
    sort: true,
  },
  {
    id: 'date',
    align: 'left',
    disablePadding: false,
    label: 'First Order',
    sort: true,
  },
];

const useStyles = makeStyles((theme) => ({
  actionsButtonWrapper: {
    background: theme.palette.background.paper,
  },
}));

function CustomersTableHead(props) {
  const classes = useStyles(props);
  const { selectedCustomerIds } = props;
  const numSelected = selectedCustomerIds.length;

  const [selectedCustomersMenu, setSelectedCustomersMenu] = useState(null);

  const dispatch = useDispatch();

  const createSortHandler = (property) => (event) => {
    props.onRequestSort(event, property);
  };

  function openSelectedCustomersMenu(event) {
    setSelectedCustomersMenu(event.currentTarget);
  }

  function closeSelectedCustomersMenu() {
    setSelectedCustomersMenu(null);
  }

  // const {onSelectAllClick, customer, customerBy, numSelected, rowCount} = props;
// console.log(rows)
  return (
    <TableHead>
      <TableRow className="h-48 sm:h-64">
        <TableCell padding="none" className="w-40 md:w-64 text-center z-99">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < props.rowCount}
            checked={props.rowCount !== 0 && numSelected === props.rowCount}
            onChange={props.onSelectAllClick}
          />
          {numSelected > 0 && (
            <div
              className={clsx(
                'flex items-center justify-center absolute w-64 top-0 ltr:left-0 rtl:right-0 mx-56 h-64 z-10 border-b-1',
                classes.actionsButtonWrapper
              )}
            >
              <IconButton
                aria-owns={selectedCustomersMenu ? 'selectedCustomersMenu' : null}
                aria-haspopup="true"
                onClick={openSelectedCustomersMenu}
              >
                <Icon>more_horiz</Icon>
              </IconButton>
              <Menu
                id="selectedCustomersMenu"
                anchorEl={selectedCustomersMenu}
                open={Boolean(selectedCustomersMenu)}
                onClose={closeSelectedCustomersMenu}
              >
                <MenuList>
                  <MenuItem
                    onClick={() => {
                      dispatch(removeCustomers(selectedCustomerIds));
                      props.onMenuItemClick();
                      closeSelectedCustomersMenu();
                    }}
                  >
                    <ListItemIcon className="min-w-40">
                      <Icon>delete</Icon>
                    </ListItemIcon>
                    <ListItemText primary="Remove" />
                  </MenuItem>
                </MenuList>
              </Menu>
            </div>
          )}
        </TableCell>
        {rows.map((row) => {
          return (
            <TableCell
              className="p-4 md:p-16"
              key={row.id}
              align={row.align}
              padding={row.disablePadding ? 'none' : 'normal'}
              sortDirection={props.customer.id === row.id ? props.customer.direction : false}
            >
              {row.sort && (
                <Tooltip
                  title="Sort"
                  placement={row.align === 'right' ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={props.customer.id === row.id}
                    direction={props.customer.direction}
                    onClick={createSortHandler(row.id)}
                    className="font-semibold"
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              )}
            </TableCell>
          );
        }, this)}
      </TableRow>
    </TableHead>
  );
}

export default CustomersTableHead;
