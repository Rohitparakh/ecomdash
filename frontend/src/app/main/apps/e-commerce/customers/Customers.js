import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import reducer from '../store';
import CustomersHeader from './CustomersHeader';
import CustomersTable from './CustomersTable';

function Customers() {
  return (
    <FusePageCarded
      classes={{
        content: 'flex',
        contentCard: 'overflow-hidden',
        header: 'min-h-72 h-72 sm:h-136 sm:min-h-136',
      }}
      header={<CustomersHeader />}
      content={<CustomersTable />}
      innerScroll
    />
  );
}

export default withReducer('eCommerceApp', reducer)(Customers);
