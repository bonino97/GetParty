import React, { useEffect, useState, memo } from 'react';
import _ from '@lodash';
import clsx from 'clsx';
import { motion } from 'framer-motion';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';

import FusePageCarded from '@fuse/core/FusePageCarded';

const orderStatuses = [
  {
    id: 1,
    name: 'Awaiting check payment',
    color: 'bg-blue text-white',
  },
  {
    id: 2,
    name: 'Payment accepted',
    color: 'bg-green text-white',
  },
  {
    id: 3,
    name: 'Preparing the order',
    color: 'bg-orange text-black',
  },
  {
    id: 4,
    name: 'Shipped',
    color: 'bg-purple text-white',
  },
  {
    id: 5,
    name: 'Delivered',
    color: 'bg-green-700 text-white',
  },
  {
    id: 6,
    name: 'Canceled',
    color: 'bg-pink text-white',
  },
  {
    id: 7,
    name: 'Refunded',
    color: 'bg-red text-white',
  },
  {
    id: 8,
    name: 'Payment error',
    color: 'bg-red-700 text-white',
  },
  {
    id: 9,
    name: 'On pre-order (paid)',
    color: 'bg-purple-300 text-white',
  },
  {
    id: 10,
    name: 'Awaiting bank wire payment',
    color: 'bg-blue text-white',
  },
  {
    id: 11,
    name: 'Awaiting PayPal payment',
    color: 'bg-blue-700 text-white',
  },
  {
    id: 12,
    name: 'Remote payment accepted',
    color: 'bg-green-800 text-white',
  },
  {
    id: 13,
    name: 'On pre-order (not paid)',
    color: 'bg-purple-700 text-white',
  },
  {
    id: 14,
    name: 'Awaiting Cash-on-delivery payment',
    color: 'bg-blue-800 text-white',
  },
];

const useStyles = makeStyles((theme) => ({
  header: {
    background: `linear-gradient(to right, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
    color: theme.palette.getContrastText(theme.palette.primary.main),
  },
  headerIcon: {
    position: 'absolute',
    top: -64,
    left: 0,
    opacity: 0.04,
    fontSize: 512,
    width: 512,
    height: 512,
    pointerEvents: 'none',
  },
}));

const OrdersStatus = (props) => {
  return (
    <div
      className={clsx(
        'inline text-12 font-semibold py-4 px-12 rounded-full truncate',
        _.find(orderStatuses, { name: props.name }).color
      )}
    >
      {props.name}
    </div>
  );
};

const Marker = (props) => {
  return (
    <Tooltip title={props.text} placement='top'>
      <Icon className='text-red'>place</Icon>
    </Tooltip>
  );
};

const Party = (props) => {
  const [map, setMap] = useState('shipping');

  const classes = useStyles(props);

  useEffect(() => {
    setMap('shipping');

    return () => {
      false;
    };
  }, []);

  return (
    <FusePageCarded
      classes={{
        content: 'flex',
        header: 'min-h-72 h-72 sm:h-136 sm:min-h-136',
      }}
      header={
        <div
          className={clsx(
            classes.header,
            'relative overflow-hidden flex flex-shrink-0 items-center justify-center h-100 sm:h-168'
          )}
        >
          <div className='flex flex-col max-w-2xl mx-auto w-full p-24 sm:p-32'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0 } }}
            >
              <Typography
                color='inherit'
                className='text-24 sm:text-44 font-bold tracking-tight'
              >
                Parties near Corral de Bustos!
              </Typography>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.3 } }}
            >
              <Typography
                color='inherit'
                className='text-12 sm:text-14 mt-8 sm:mt-16 opacity-75 leading-tight sm:leading-loose'
              ></Typography>
            </motion.div>
          </div>

          <Icon className={classes.headerIcon}> audiotrack </Icon>
        </div>
      }
      content={
        <div className='p-16 sm:p-24 max-w-2xl w-full'>
          <div className='pb-48'>
            <div className='pb-16 flex items-center'>
              <Icon color='action'>account_circle</Icon>
              <Typography
                className='h2 mx-12 font-medium'
                color='textSecondary'
              >
                Customer
              </Typography>
            </div>

            <div className='mb-24'>
              <div className='table-responsive mb-48'>
                <table className='simple'>
                  <thead>
                    <tr>
                      <th>
                        <Typography className='font-semibold'>Name</Typography>
                      </th>
                      <th>
                        <Typography className='font-semibold'>Email</Typography>
                      </th>
                      <th>
                        <Typography className='font-semibold'>Phone</Typography>
                      </th>
                      <th>
                        <Typography className='font-semibold'>
                          Company
                        </Typography>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className='flex items-center'>
                          {/* <Avatar src={order.customer.avatar} /> */}
                          <Typography className='truncate mx-8'>
                            Juan Cruz Lombardo Bonino
                          </Typography>
                        </div>
                      </td>
                      <td>
                        <Typography className='truncate'>
                          juanbonino97@gmail.com
                        </Typography>
                      </td>
                      <td>
                        <Typography className='truncate'>
                          +543468518855
                        </Typography>
                      </td>
                      <td>Get Party Company. A pelatelli</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <Accordion
                className='border-0 shadow-0 overflow-hidden'
                expanded={map === 'shipping'}
                onChange={() => setMap(map !== 'shipping' ? 'shipping' : false)}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  classes={{ root: 'border border-solid rounded-16 mb-16' }}
                >
                  <Typography className='font-semibold'>
                    Shipping Address
                  </Typography>
                </AccordionSummary>
                <AccordionDetails className='flex flex-col md:flex-row -mx-8'>
                  <Typography className='w-full md:max-w-256 mb-16 md:mb-0 mx-8 text-16'>
                    San Luis 724
                  </Typography>
                  <div className='w-full h-320 rounded-16 overflow-hidden mx-8'>
                    {/* <GoogleMap
                bootstrapURLKeys={{
                  key: process.env.REACT_APP_MAP_KEY,
                }}
                defaultZoom={15}
                defaultCenter={[
                  order.customer.shippingAddress.lat,
                  order.customer.shippingAddress.lng,
                ]}
              >
                <Marker
                  text={order.customer.shippingAddress.address}
                  lat={order.customer.shippingAddress.lat}
                  lng={order.customer.shippingAddress.lng}
                />
              </GoogleMap> */}
                  </div>
                </AccordionDetails>
              </Accordion>

              <Accordion
                className='shadow-0 border-0 overflow-hidden'
                expanded={map === 'invoice'}
                onChange={() => setMap(map !== 'invoice' ? 'invoice' : false)}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  classes={{ root: 'border border-solid rounded-16 mb-16' }}
                >
                  <Typography className='font-semibold'>
                    Invoice Address
                  </Typography>
                </AccordionSummary>
                <AccordionDetails className='flex flex-col md:flex-row -mx-8'>
                  <Typography className='w-full md:max-w-256 mb-16 md:mb-0 mx-8 text-16'>
                    San Luis 724
                  </Typography>
                  <div className='w-full h-320 rounded-16 overflow-hidden mx-8'>
                    {/* <GoogleMap
                bootstrapURLKeys={{
                  key: process.env.REACT_APP_MAP_KEY,
                }}
                defaultZoom={15}
                defaultCenter={[
                  order.customer.invoiceAddress.lat,
                  order.customer.invoiceAddress.lng,
                ]}
              >
                <Marker
                  text={order.customer.invoiceAddress.address}
                  lat={order.customer.invoiceAddress.lat}
                  lng={order.customer.invoiceAddress.lng}
                />
              </GoogleMap> */}
                  </div>
                </AccordionDetails>
              </Accordion>
            </div>
          </div>

          <div className='pb-48'>
            <div className='pb-16 flex items-center'>
              <Icon color='action'>access_time</Icon>
              <Typography
                className='h2 mx-12 font-medium'
                color='textSecondary'
              >
                Order Status
              </Typography>
            </div>

            <div className='table-responsive'>
              <table className='simple'>
                <thead>
                  <tr>
                    <th>
                      <Typography className='font-semibold'>Status</Typography>
                    </th>
                    <th>
                      <Typography className='font-semibold'>
                        Updated On
                      </Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr key={1}>
                    <td>
                      <OrdersStatus name='Awaiting check payment' />
                    </td>
                    <td>20/10/1991</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className='pb-48'>
            <div className='pb-16 flex items-center'>
              <Icon color='action'>attach_money</Icon>
              <Typography
                className='h2 mx-12 font-medium'
                color='textSecondary'
              >
                Payment
              </Typography>
            </div>

            <div className='table-responsive'>
              <table className='simple'>
                <thead>
                  <tr>
                    <th>
                      <Typography className='font-semibold'>
                        TransactionID
                      </Typography>
                    </th>
                    <th>
                      <Typography className='font-semibold'>
                        Payment Method
                      </Typography>
                    </th>
                    <th>
                      <Typography className='font-semibold'>Amount</Typography>
                    </th>
                    <th>
                      <Typography className='font-semibold'>Date</Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <span className='truncate'>
                        12398127848712478128747812
                      </span>
                    </td>
                    <td>
                      <span className='truncate'>Debit card</span>
                    </td>
                    <td>
                      <span className='truncate'>$1500.50</span>
                    </td>
                    <td>
                      <span className='truncate'>20/10/2045 10:45pm</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className='pb-48'>
            <div className='pb-16 flex items-center'>
              <Icon color='action'>local_shipping</Icon>
              <Typography
                className='h2 mx-12 font-medium'
                color='textSecondary'
              >
                Shipping
              </Typography>
            </div>

            <div className='table-responsive'>
              <table className='simple'>
                <thead>
                  <tr>
                    <th>
                      <Typography className='font-semibold'>
                        Tracking Code
                      </Typography>
                    </th>
                    <th>
                      <Typography className='font-semibold'>Carrier</Typography>
                    </th>
                    <th>
                      <Typography className='font-semibold'>Weight</Typography>
                    </th>
                    <th>
                      <Typography className='font-semibold'>Fee</Typography>
                    </th>
                    <th>
                      <Typography className='font-semibold'>Date</Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr key={1}>
                    <td>
                      <span className='truncate'>Tracking</span>
                    </td>
                    <td>
                      <span className='truncate'>Carrier</span>
                    </td>
                    <td>
                      <span className='truncate'>Weight</span>
                    </td>
                    <td>
                      <span className='truncate'>Fee</span>
                    </td>
                    <td>
                      <span className='truncate'>Date/Date/Date</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }
      innerScroll
    />
  );
};

export default memo(Party);
