import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import GoogleMap from 'google-map-react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomersStatus from '../CustomersStatus';
import { selectOrders, getOrders } from '../../store/ordersSlice';


function Marker(props) {
  return (
    <Tooltip title={props.text} placement="top">
      <Icon className="text-red">place</Icon>
    </Tooltip>
  );
}

function CustomerDetailsTab() {

  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const [orderData, setOrderData] = useState(orders);

  const customer = useSelector(({ eCommerceApp }) => eCommerceApp.customer);
  // console.log(customer)
  const [map, setMap] = useState('shipping');

  useEffect(() => {
    dispatch(getOrders()).then((res) => setOrderData(res.payload));
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

  const customerOrders=findOrdersById(customer.orderIds)
  return (
    <div>
      <div className="pb-48">
        <div className="pb-16 flex items-center">
          <Icon color="action">account_circle</Icon>
          <Typography className="h2 mx-12 font-medium" color="textSecondary">
            Customer
          </Typography>
        </div>

        <div className="mb-24">
          <div className="table-responsive mb-48">
            <table className="simple">
              <thead>
                <tr>
                  <th>
                    <Typography className="font-semibold">Name</Typography>
                  </th>
                  <th>
                    <Typography className="font-semibold">Lifetime Value</Typography>
                  </th>
                  <th>
                    <Typography className="font-semibold">Email</Typography>
                  </th>
                  <th>
                    <Typography className="font-semibold">Phone</Typography>
                  </th>
                  <th>
                    <Typography className="font-semibold">Company</Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="flex items-center">
                      <Avatar src={customer.avatar} />
                      <Typography className="truncate mx-8">
                        {`${customer.firstName} ${customer.lastName}`}
                      </Typography>
                    </div>
                  </td>
                  <td>
                    <Typography className="truncate">{calculateTotal(customerOrders)}</Typography>
                  </td>
                  <td>
                    <Typography className="truncate">{customer.email}</Typography>
                  </td>
                  <td>
                    <Typography className="truncate">{customer.phone}</Typography>
                  </td>
                  <td>
                    <span className="truncate">{customer.company}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* <Accordion
            className="border-0 shadow-0 overflow-hidden"
            expanded={map === 'shipping'}
            onChange={() => setMap(map !== 'shipping' ? 'shipping' : false)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              classes={{ root: 'border border-solid rounded-16 mb-16' }}
            >
              <Typography className="font-semibold">Shipping Address</Typography>
            </AccordionSummary>
            <AccordionDetails className="flex flex-col md:flex-row -mx-8">
              <Typography className="w-full md:max-w-256 mb-16 md:mb-0 mx-8 text-16">
                {customer.shippingAddress.address}
              </Typography>
              <div className="w-full h-320 rounded-16 overflow-hidden mx-8">
                <GoogleMap
                  bootstrapURLKeys={{
                    key: process.env.REACT_APP_MAP_KEY,
                  }}
                  defaultZoom={15}
                  defaultCenter={[
                    customer.shippingAddress.lat,
                    customer.shippingAddress.lng,
                  ]}
                >
                  <Marker
                    text={customer.shippingAddress.address}
                    lat={customer.shippingAddress.lat}
                    lng={customer.shippingAddress.lng}
                  />
                </GoogleMap>
              </div>
            </AccordionDetails>
          </Accordion>

          <Accordion
            className="shadow-0 border-0 overflow-hidden"
            expanded={map === 'invoice'}
            onChange={() => setMap(map !== 'invoice' ? 'invoice' : false)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              classes={{ root: 'border border-solid rounded-16 mb-16' }}
            >
              <Typography className="font-semibold">Invoice Address</Typography>
            </AccordionSummary>
            <AccordionDetails className="flex flex-col md:flex-row -mx-8">
              <Typography className="w-full md:max-w-256 mb-16 md:mb-0 mx-8 text-16">
                {customer.invoiceAddress.address}
              </Typography>
              <div className="w-full h-320 rounded-16 overflow-hidden mx-8">
                <GoogleMap
                  bootstrapURLKeys={{
                    key: process.env.REACT_APP_MAP_KEY,
                  }}
                  defaultZoom={15}
                  defaultCenter={[
                    customer.invoiceAddress.lat,
                    customer.invoiceAddress.lng,
                  ]}
                >
                  <Marker
                    text={customer.invoiceAddress.address}
                    lat={customer.invoiceAddress.lat}
                    lng={customer.invoiceAddress.lng}
                  />
                </GoogleMap>
              </div>
            </AccordionDetails>
          </Accordion> */}
        </div>
      </div>

      {/* <div className="pb-48">
        <div className="pb-16 flex items-center">
          <Icon color="action">access_time</Icon>
          <Typography className="h2 mx-12 font-medium" color="textSecondary">
            Customer Status
          </Typography>
        </div>

        <div className="table-responsive">
          <table className="simple">
            <thead>
              <tr>
                <th>
                  <Typography className="font-semibold">Status</Typography>
                </th>
                <th>
                  <Typography className="font-semibold">Updated On</Typography>
                </th>
              </tr>
            </thead>
            <tbody>
              {customer.status.map((status) => (
                <tr key={status.id}>
                  <td>
                    <CustomersStatus name={status.name} />
                  </td>
                  <td>{status.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}

      {/* <div className="pb-48">
        <div className="pb-16 flex items-center">
          <Icon color="action">attach_money</Icon>
          <Typography className="h2 mx-12 font-medium" color="textSecondary">
            Payment
          </Typography>
        </div>

        <div className="table-responsive">
          <table className="simple">
            <thead>
              <tr>
                <th>
                  <Typography className="font-semibold">TransactionID</Typography>
                </th>
                <th>
                  <Typography className="font-semibold">Payment Method</Typography>
                </th>
                <th>
                  <Typography className="font-semibold">Amount</Typography>
                </th>
                <th>
                  <Typography className="font-semibold">Date</Typography>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span className="truncate">{customer.payment.transactionId}</span>
                </td>
                <td>
                  <span className="truncate">{customer.payment.method}</span>
                </td>
                <td>
                  <span className="truncate">{customer.payment.amount}</span>
                </td>
                <td>
                  <span className="truncate">{customer.payment.date}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div> */}

      {/* <div className="pb-48">
        <div className="pb-16 flex items-center">
          <Icon color="action">local_shipping</Icon>
          <Typography className="h2 mx-12 font-medium" color="textSecondary">
            Shipping
          </Typography>
        </div>

        <div className="table-responsive">
          <table className="simple">
            <thead>
              <tr>
                <th>
                  <Typography className="font-semibold">Tracking Code</Typography>
                </th>
                <th>
                  <Typography className="font-semibold">Carrier</Typography>
                </th>
                <th>
                  <Typography className="font-semibold">Weight</Typography>
                </th>
                <th>
                  <Typography className="font-semibold">Fee</Typography>
                </th>
                <th>
                  <Typography className="font-semibold">Date</Typography>
                </th>
              </tr>
            </thead>
            <tbody>
              {customer.shippingDetails.map((shipping) => (
                <tr key={shipping.date}>
                  <td>
                    <span className="truncate">{shipping.tracking}</span>
                  </td>
                  <td>
                    <span className="truncate">{shipping.carrier}</span>
                  </td>
                  <td>
                    <span className="truncate">{shipping.weight}</span>
                  </td>
                  <td>
                    <span className="truncate">{shipping.fee}</span>
                  </td>
                  <td>
                    <span className="truncate">{shipping.date}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  );
}

export default CustomerDetailsTab;
