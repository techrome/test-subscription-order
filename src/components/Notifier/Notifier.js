import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { useSnackbar } from 'notistack';

import { alertSelectors, alertsActions } from 'src/redux/stores/alerts';

const Notifier = ({ alerts, removeAlert, ...props }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    alerts.forEach(({ key, message, options = {}, dismissed = false }) => {
      if (dismissed) {
        // dismiss snackbar using notistack
        closeSnackbar(key);
        return;
      }

      // display snackbar using notistack
      enqueueSnackbar(message, {
        key,
        action: (myKey) => (
          <IconButton onClick={() => closeSnackbar(myKey)}>
            <CloseIcon fontSize="small" style={{ color: '#fff' }} />
          </IconButton>
        ),
        ...options,
        preventDuplicate: true,
        onClose: (event, reason, myKey) => {
          if (options.onClose) {
            options.onClose(event, reason, myKey);
          }
        },
        onExited: (event, myKey) => {
          // remove this snackbar from redux store
          removeAlert(myKey);
        },
      });
    });
  }, [alerts]);

  return null;
};

const mapState = (state) => ({
  alerts: alertSelectors.alerts(state),
});

const mapDispatch = {
  removeAlert: alertsActions.removeAlert,
};

export default connect(mapState, mapDispatch)(Notifier);
