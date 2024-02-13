import FuseScrollbars from '@fuse/core/FuseScrollbars';
import FuseUtils from '@fuse/utils';
import _ from '@lodash';
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import FuseLoading from '@fuse/core/FuseLoading';
import CustomersStatus from '../customer/CustomersStatus';
import { selectCustomers, getCustomers } from '../store/customersSlice';
import { selectOrders, getOrders } from '../store/ordersSlice';
import CustomersTableHead from './CustomersTableHead';

function CustomersTable(props) {
  const dispatch = useDispatch();
  const customers = useSelector(selectCustomers);
  const orders = useSelector(selectOrders);
  const searchText = useSelector(({ eCommerceApp }) => eCommerceApp.customers.searchText);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState(customers);
  const [orderData, setOrderData] = useState(orders);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [customer, setCustomer] = useState({
    direction: 'asc',
    id: null,
  });

  useEffect(() => {
    dispatch(getOrders()).then((res) => setOrderData(res.payload));
    dispatch(getCustomers()).then(() => setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    if (searchText.length !== 0) {
      setData(FuseUtils.filterArrayByString(customers, searchText));
      setPage(0);
    } else {
      setData(customers);
    }
  }, [customers, searchText]);

  function findOrdersById(idArray){
    let ordersByIdTemp=[];
    idArray.forEach((oId)=>{
      let obj = orderData.find(o => o.id == oId);
      ordersByIdTemp.push(obj);
    })
    console.log(ordersByIdTemp)
    let ordersById = [
      ...new Map(ordersByIdTemp.map((item) =>([item["id"], item]))).values(),
  ];
  // findEarliestOrder(ordersById)
  // return calculateTotal(ordersById)
  return ordersById

  }

  function calculateTotal(orderArr){
    let total=0;
    orderArr.map((val)=>{
      total+=parseFloat(val.total)
      
    })
    return Math.round(total * 100) / 100;
  }

  function findEarliestOrder(orderArr){
    let sortedArr=orderArr.reduce((prev, curr) => prev.id < curr.id ? prev : curr);
    return sortedArr.date
  }

  function handleRequestSort(event, property) {
    const id = property;
    let direction = 'desc';

    if (customer.id === property && customer.direction === 'desc') {
      direction = 'asc';
    }

    setCustomer({
      direction,
      id,
    });
  }

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      setSelected(data.map((n) => n.id));
      return;
    }
    setSelected([]);
  }

  function handleDeselect() {
    setSelected([]);
  }

  function handleClick(item) {
    props.history.push(`/apps/e-commerce/customers/${item.id}`);
  }

  function handleCheck(event, id) {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  }

  function handleChangePage(event, value) {
    setPage(value);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
  }

  if (loading) {
    return <FuseLoading />;
  }

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center h-full"
      >
        <Typography color="textSecondary" variant="h5">
          There are no customers!
        </Typography>
      </motion.div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <FuseScrollbars className="flex-grow overflow-x-auto">
        <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
          <CustomersTableHead
            selectedCustomerIds={selected}
            customer={customer}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={data.length}
            onMenuItemClick={handleDeselect}
          />

          <TableBody>
            {_.orderBy(
              data,
              [
                (o) => {
                  switch (customer.id) {
                    case 'id': {
                      return parseInt(o.id, 10);
                    }
                    case 'customer': {
                      return o.firstName;
                    }
                    case 'payment': {
                      return o.payment;
                    }
                    case 'status': {
                      return o.status[0].name;
                    }
                    case 'lifetime-value': {
                      return calculateTotal(o.orderIds.length>0?(findOrdersById(o.orderIds)):null);
                    }
                    case 'date': {
                      return findEarliestOrder(o.orderIds.length>0?(findOrdersById(o.orderIds)):null);
                    }
                    default: {
                      return o[customer.id];
                    }
                  }
                },
              ],
              [customer.direction]
            )
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((n) => {
                const isSelected = selected.indexOf(n.id) !== -1;
                return (
                  <TableRow
                    className="h-72 cursor-pointer"
                    hover
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={-1}
                    key={n.id}
                    selected={isSelected}
                    onClick={(event) => handleClick(n)}
                  >
                    <TableCell className="w-40 md:w-64 text-center" padding="none">
                      <Checkbox
                        checked={isSelected}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => handleCheck(event, n.id)}
                      />
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {n.id}
                    </TableCell>

                    {/* <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {n.reference}
                    </TableCell> */}

                    <TableCell className="p-4 md:p-16 truncate" component="th" scope="row">
                      {`${n.firstName} ${n.lastName}`}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                      <span>₹</span>
                      {calculateTotal(n.orderIds.length>0?(findOrdersById(n.orderIds)):null)}
                    </TableCell>

                    {/* <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {n.payment.method}
                    </TableCell> */}

                    {/* <TableCell className="p-4 md:p-16" component="th" scope="row">
                      <CustomersStatus name={n.status[0].name} />
                    </TableCell> */}

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {findEarliestOrder(n.orderIds.length>0?(findOrdersById(n.orderIds)):null)}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </FuseScrollbars>

      <TablePagination
        className="flex-shrink-0 border-t-1"
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        backIconButtonProps={{
          'aria-label': 'Previous Page',
        }}
        nextIconButtonProps={{
          'aria-label': 'Next Page',
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}

export default withRouter(CustomersTable);
