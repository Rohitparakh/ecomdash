import FuseScrollbars from '@fuse/core/FuseScrollbars';
import FuseUtils from '@fuse/utils';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { selectOrders, getOrders } from '../../store/ordersSlice';
import FuseLoading from '@fuse/core/FuseLoading';
import { Link } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import OrdersStatus from '../../order/OrdersStatus';
import OrdersTableHead from './OrdersTableHead';
function ProductsTab({props}) {
  const dispatch = useDispatch();
  const searchText = useSelector(({ eCommerceApp }) => eCommerceApp.orders.searchText);
  const [loading, setLoading] = useState(false);
  const orderData = useSelector(selectOrders);
  const customer = useSelector(({ eCommerceApp }) => eCommerceApp.customer);
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState(orderData);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState({
    direction: 'asc',
    id: null,
  });

  console.log(props)

  if (loading) {
    return <FuseLoading />;
  }
  useEffect(() => {
    if (searchText.length !== 0) {
      setData(FuseUtils.filterArrayByString(orders, searchText));
      setPage(0);
    } else {
      setData(orderData);
    }
  }, [orderData, searchText]);

  function handleRequestSort(event, property) {
    const id = property;
    let direction = 'desc';

    if (order.id === property && order.direction === 'desc') {
      direction = 'asc';
    }

    setOrder({
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
    props.history.push(`/apps/e-commerce/orders/${item.id}`);
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
  useEffect(() => {
    dispatch(getOrders()).then(() => setLoading(false));
  }, [dispatch]);

  function findOrdersById(idArray){
    let ordersByIdTemp=[];
    idArray.forEach((oId)=>{
      let obj = orderData.find(o => o.id == oId);
      ordersByIdTemp.push(obj);
    })
    let ordersById = [
      ...new Map(ordersByIdTemp.map((item) => [item["id"], item])).values(),
  ];
  // findEarliestOrder(ordersById)
  // return calculateTotal(ordersById)  
  return ordersById;
  }

  const customerOrders=findOrdersById(customer.orderIds)
  console.log(customerOrders)
  return (
    <div className="w-full flex flex-col flex-container">
      <FuseScrollbars className="flex-grow overflow-x-auto">
        <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
          <OrdersTableHead
            selectedOrderIds={selected}
            order={order}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={data.length}
            onMenuItemClick={handleDeselect}
          />

          <TableBody>
            {_.orderBy(
              customerOrders,
              [
                (o) => {
                  switch (order.id) {
                    case 'id': {
                      return parseInt(o.id, 10);
                    }
                    case 'customer': {
                      return o.customer.firstName;
                    }
                    case 'payment': {
                      return o.payment.method;
                    }
                    case 'status': {
                      return o.status[0].name;
                    }
                    default: {
                      return o[order.id];
                    }
                  }
                },
              ],
              [order.direction]
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
                    {/* <TableCell className="w-40 md:w-64 text-center" padding="none">
                      <Checkbox
                        checked={isSelected}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => handleCheck(event, n.id)}
                      />
                    </TableCell> */}

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {n.id}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {n.reference}
                    </TableCell>

                    {/* <TableCell className="p-4 md:p-16 truncate" component="th" scope="row">
                      {`${n.customer.firstName} ${n.customer.lastName}`}
                    </TableCell> */}

                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="right">
                      <span>₹</span>
                      {n.total}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {n.payment.method}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      <OrdersStatus name={n.status[0].name} />
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {n.date}
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
        count={customerOrders.length}
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

    // <div className="table-responsive">
    //   <table className="simple">
    //     <thead>
    //       <tr>
    //         <th>
    //           <Typography className="font-semibold">Order ID</Typography>
    //         </th>
    //         {/* <th>
    //           <Typography className="font-semibold"></Typography>
    //         </th> */}
    //         <th>
    //           <Typography className="font-semibold">Order Status</Typography>
    //         </th>
    //         <th>
    //           <Typography className="font-semibold">Order Total</Typography>
    //         </th>
    //         <th>
    //           <Typography className="font-semibold">Order Date</Typography>
    //         </th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {customerOrders.map((order) => (
    //         <tr key={order.id}>
    //           <td className="w-64">{order.id}</td>
    //           {/* <td className="w-80">
    //             <img className="product-image" src={order.image} alt="product" />
    //           </td> */}
    //           <td>
    //             <Typography
    //               component={Link}
    //               to={`/apps/e-commerce/orders/${order.id}`}
    //               className="truncate"
    //               style={{
    //                 color: 'inherit',
    //                 textDecoration: 'underline',
    //               }}
    //             >
    //               {order.status[0].name}
    //             </Typography>
    //           </td>
    //           <td className="w-64 text-right">
    //             <span className="truncate">&#8377;{order.total}</span>
    //           </td>
    //           <td className="w-64 text-right">
    //             <span className="truncate">{order.date}</span>
    //           </td>
    //         </tr>
    //       ))}
    //     </tbody>
    //   </table>
    // </div>
  );
}

export default ProductsTab;
