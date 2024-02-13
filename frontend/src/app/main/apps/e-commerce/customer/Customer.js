import FusePageCarded from '@fuse/core/FusePageCarded';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { useTheme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import withReducer from 'app/store/withReducer';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import reducer from '../store';
import { resetCustomer, getCustomer } from '../store/customerSlice';
import InvoiceTab from './tabs/InvoiceTab';
import CustomerDetailsTab from './tabs/CustomerDetailsTab';
import ProductsTab from './tabs/ProductsTab';

function Customer(props) {
  const dispatch = useDispatch();
  const customer = useSelector(({ eCommerceApp }) => eCommerceApp.customer);
  const theme = useTheme();

  const routeParams = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [noCustomer, setNoCustomer] = useState(false);

  useDeepCompareEffect(() => {
    dispatch(getCustomer(routeParams)).then((action) => {
      if (!action.payload) {
        setNoCustomer(true);
        console.log(action)
      }      
    });
  }, [dispatch, routeParams]);

  useEffect(() => {
    return () => {
      dispatch(resetCustomer());
      setNoCustomer(false);
    };
  }, [dispatch]);

  function handleChangeTab(event, value) {
    setTabValue(value);
  }

  if (noCustomer) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="textSecondary" variant="h5">
          There is no such customer!
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to="/apps/e-commerce/customers"
          color="inherit"
        >
          Go to Customers Page
        </Button>
      </motion.div>
    );
  }

  return (
    <FusePageCarded
      classes={{
        content: 'flex',
        header: 'min-h-72 h-72 sm:h-136 sm:min-h-136',
      }}
      header={
        customer && (
          <div className="flex flex-1 w-full items-center justify-between">
            <div className="flex flex-1 flex-col items-center sm:items-start">
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
              >
                <Typography
                  className="flex items-center sm:mb-12"
                  component={Link}
                  role="button"
                  to="/apps/e-commerce/customers"
                  color="inherit"
                >
                  <Icon className="text-20">
                    {theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
                  </Icon>
                  <span className="mx-4 font-medium">Customers</span>
                </Typography>
              </motion.div>

              <div className="flex flex-col min-w-0 items-center sm:items-start">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
                >
                  <Typography className="text-16 sm:text-20 truncate font-semibold">
                  {`${customer.firstName} ${customer.lastName}`}
                  </Typography>                  
                </motion.div>
              </div>
            </div>
          </div>
        )
      }
      contentToolbar={
        <Tabs
          value={tabValue}
          onChange={handleChangeTab}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          classes={{ root: 'w-full h-64' }}
        >
          <Tab className="h-64" label="Customer Details" />
          <Tab className="h-64" label="Recent Orders" />
          {/* <Tab className="h-64" label="Invoice" /> */}
        </Tabs>
      }
      content={
        customer && (
          <div className="p-16 sm:p-24 w-full">
            {tabValue === 0 && <CustomerDetailsTab />}
            {tabValue === 1 && <ProductsTab props={props} />}
            {/* {tabValue === 2 && <InvoiceTab customer={customer} />} */}
          </div>
        )
      }
      innerScroll
    />
  );
}

export default withReducer('eCommerceApp', reducer)(Customer);
