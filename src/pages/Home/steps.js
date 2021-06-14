import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import {
  Stepper,
  Step,
  StepLabel,
  useMediaQuery,
  Grid,
  Typography,
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from '@material-ui/icons';
import isEmpty from 'lodash/isEmpty';
import CreditCardInput from 'react-credit-card-input';

import * as c from 'src/constants';
import { modalNames } from 'src/config';
import { Button } from 'src/components/Button';
import { SpinnerOverlay } from 'src/components/SpinnerOverlay';
import { Select, Radio, Input, Checkbox, Label } from 'src/components/Fields';
import { orderSelectors, orderActions } from 'src/redux/stores/order';
import { alertsActions } from 'src/redux/stores/alerts';
import { modalActions } from 'src/redux/stores/modal';
import {
  validateSubscription,
  validateConfirmation,
  convertValidations,
} from 'src/helpers/validate';
import { roundMoney } from 'src/helpers/money';

const useStyles = makeStyles((theme) => ({
  main: {
    marginTop: theme.spacing(2),
  },
}));

const useStylesStep2 = makeStyles((theme) => ({
  cardFieldsWrapper: {
    '&& .is-invalid': {
      borderColor: theme.palette.error.main,
    },
    '&& .danger-text': {
      color: theme.palette.error.main,
    },
  },
}));

const amountOptions = [
  { title: '5 GB', value: '5' },
  { title: '10 GB', value: '10' },
  { title: '50 GB', value: '50' },
];

const upfrontOptions = [
  {
    title: 'Yes (10% discount)',
    value: 'yes',
  },
  {
    title: 'No',
    value: 'no',
  },
];

const Step1 = ({
  stepsData,
  currentStepIndex,
  subscriptionPlansLoading,
  subscriptionPlans,
  durationOptions,
  orderRequesting,

  setStepsData,
  setCurrentStepIndex,
  loadSubscriptionPlans,
  resetSubscriptionPlans,
  sendOrder,
  resetOrder,
  addAlert,
  ...props
}) => {
  const [values, setValues] = useState(
    isEmpty(stepsData[0])
      ? {
          [c.duration]: null,
          [c.amount]: '5',
          [c.upfront]: 'no',
        }
      : stepsData[0],
  );

  const [errors, setErrors] = useState({
    [c.duration]: '',
    [c.amount]: '',
    [c.upfront]: '',
  });

  const onValueChange = (field, value) => {
    setValues({
      ...values,
      [field]: value,
    });
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: '',
      });
    }
  };

  const onNext = () => {
    const validations = validateSubscription(values);
    if (validations) {
      setErrors({
        ...errors,
        ...convertValidations(validations),
      });
      return;
    }

    setStepsData(values, 0);
    setCurrentStepIndex(1);
  };

  useEffect(() => {
    if (subscriptionPlans.length > 0) {
      setValues({ ...values, [c.duration]: 12 });
    }
  }, [subscriptionPlans]);

  const finalPrice = useMemo(() => {
    if (
      subscriptionPlans.length > 0 &&
      Object.values(values).every((el) => !!el)
    ) {
      const discountMultiplier = values[c.upfront] === 'yes' ? 0.9 : 1;
      return roundMoney(
        subscriptionPlans.find(
          (el) => el[c.duration_months] === values[c.duration],
        )[c.price_usd_per_gb] *
          Number(values[c.amount]) *
          discountMultiplier,
      ).toFixed(2);
    } else {
      return 0;
    }
  }, [subscriptionPlans, values]);

  const pricePerGB = useMemo(() => {
    if (subscriptionPlans.length > 0 && values[c.duration]) {
      return roundMoney(
        subscriptionPlans.find(
          (el) => el[c.duration_months] === values[c.duration],
        )[c.price_usd_per_gb],
      ).toFixed(2);
    } else {
      return 0;
    }
  }, [subscriptionPlans, values]);

  return (
    <Grid container spacing={2}>
      {!!finalPrice && !!pricePerGB && (
        <Grid item xs={12}>
          <Typography variant="body2">
            Total price: <strong>${finalPrice} / month</strong>
          </Typography>
          <Typography variant="body2">
            Price per GB: <strong>${pricePerGB}</strong>
          </Typography>
        </Grid>
      )}
      <Grid item xs={12}>
        <Select
          placeholder="Subscription duration"
          options={durationOptions}
          value={values[c.duration]}
          onChange={(val) => onValueChange(c.duration, val)}
          error={errors[c.duration]}
        />
      </Grid>
      <Grid item xs={12}>
        <Select
          placeholder="Amount of gigabytes in a cloud"
          options={amountOptions}
          value={values[c.amount]}
          onChange={(val) => onValueChange(c.amount, val)}
          error={errors[c.amount]}
        />
      </Grid>
      <Grid item xs={12}>
        <Radio
          label="Upfront payment"
          options={upfrontOptions}
          value={values[c.upfront]}
          onChange={(val) => onValueChange(c.upfront, val)}
          error={errors[c.upfront]}
          row
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          onClick={onNext}
          endIcon={<ArrowForwardIcon />}
        >
          Next
        </Button>
      </Grid>
    </Grid>
  );
};

const Step2 = ({
  stepsData,
  currentStepIndex,
  subscriptionPlansLoading,
  subscriptionPlans,
  durationOptions,
  orderRequesting,

  setStepsData,
  setCurrentStepIndex,
  loadSubscriptionPlans,
  resetSubscriptionPlans,
  sendOrder,
  resetOrder,
  addAlert,
  ...props
}) => {
  const cls = useStylesStep2();

  const [values, setValues] = useState(
    isEmpty(stepsData[1])
      ? {
          [c.card_number]: '',
          [c.card_exp_date]: '',
          [c.card_security_code]: '',
        }
      : stepsData[1],
  );

  const [errors, setErrors] = useState(
    isEmpty(stepsData[1])
      ? {
          [c.card_number]: 'has error',
          [c.card_exp_date]: 'has error',
          [c.card_security_code]: 'has error',
        }
      : {
          [c.card_number]: '',
          [c.card_exp_date]: '',
          [c.card_security_code]: '',
        },
  );

  const onValueChange = (field, value) => {
    setValues({
      ...values,
      [field]: value,
    });
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: '',
      });
    }
  };

  const addError = (field) => {
    setErrors({
      ...errors,
      [field]: 'has error',
    });
  };

  const onNext = () => {
    if (Object.values(errors).some((el) => !!el)) {
      addAlert({
        message: 'Invalid credit card info provided',
        options: { variant: 'error' },
      });
      return;
    }

    setStepsData(values, 1);
    setCurrentStepIndex(2);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <div className={cls.cardFieldsWrapper}>
          <Label>Credit card info</Label>
          <CreditCardInput
            cardNumberInputProps={{
              value: values[c.card_number],
              onChange: (e) => {
                onValueChange(c.card_number, e.target.value);
              },
              onError: () => {
                addError(c.card_number);
              },
            }}
            cardExpiryInputProps={{
              value: values[c.card_exp_date],
              onChange: (e) => {
                onValueChange(c.card_exp_date, e.target.value);
              },
              onError: () => {
                addError(c.card_exp_date);
              },
            }}
            cardCVCInputProps={{
              value: values[c.card_security_code],
              onChange: (e) => {
                onValueChange(c.card_security_code, e.target.value);
              },
              onError: () => {
                addError(c.card_security_code);
              },
            }}
            dangerTextClassName="danger-text"
          />
        </div>
      </Grid>
      <Grid item xs={6}>
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={() => {
            setCurrentStepIndex(0);
          }}
          startIcon={<ArrowBackIcon />}
        >
          Back
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          onClick={onNext}
          endIcon={<ArrowForwardIcon />}
        >
          Next
        </Button>
      </Grid>
    </Grid>
  );
};

const Step3 = ({
  stepsData,
  currentStepIndex,
  subscriptionPlansLoading,
  subscriptionPlans,
  durationOptions,
  orderRequesting,

  setStepsData,
  setCurrentStepIndex,
  loadSubscriptionPlans,
  resetSubscriptionPlans,
  sendOrder,
  resetOrder,
  addAlert,
  setModalInfo,
  resetModal,
  ...props
}) => {
  const [values, setValues] = useState(
    isEmpty(stepsData[2])
      ? {
          [c.email]: '',
          [c.terms]: false,
        }
      : stepsData[2],
  );

  const [errors, setErrors] = useState({
    [c.email]: '',
    [c.terms]: '',
  });

  const onValueChange = (field, value) => {
    setValues({
      ...values,
      [field]: value,
    });
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: '',
      });
    }
  };

  const onFinish = () => {
    const validations = validateConfirmation(values);
    if (validations) {
      setErrors({
        ...errors,
        ...convertValidations(validations),
      });
      return;
    }

    const fullPayload = {
      ...stepsData.reduce((acc, cur) => ({ ...acc, ...cur })),
      ...values,
    };
    sendOrder(fullPayload, (res) => {
      if (
        window.confirm(
          `Order complete! JSON data: ${JSON.stringify(
            res.json,
            0,
            2,
          )} \n Would you like to order again?`,
        )
      ) {
        resetOrder();
      }
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Input
          placeholder="Email"
          value={values[c.email]}
          onChange={(val) => onValueChange(c.email, val)}
          error={errors[c.email]}
        />
      </Grid>
      <Grid item xs={12}>
        <Checkbox
          label={
            <div>
              I agree to the{' '}
              <a
                href="#"
                onClick={() => {
                  setModalInfo({
                    type: modalNames.TERMS,
                    isOpen: true,
                    props: {
                      onClose: resetModal,
                      onConfirm: () => {
                        setValues((prev) => ({
                          ...prev,
                          [c.terms]: true,
                        }));
                      },
                    },
                  });
                }}
              >
                Terms and conditions
              </a>
            </div>
          }
          value={values[c.terms]}
          onChange={(val) => onValueChange(c.terms, val)}
          error={errors[c.terms]}
        />
      </Grid>
      <Grid item xs={6}>
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={() => {
            setCurrentStepIndex(1);
          }}
          startIcon={<ArrowBackIcon />}
          disabled={orderRequesting}
        >
          Back
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          onClick={onFinish}
          loading={orderRequesting}
        >
          Finish
        </Button>
      </Grid>
    </Grid>
  );
};

const allSteps = [
  { component: Step1, title: 'Choose a subscription plan' },
  { component: Step2, title: 'Payment information' },
  { component: Step3, title: 'Confirmation' },
];

const StepHandler = ({
  stepsData,
  currentStepIndex,
  subscriptionPlansLoading,
  subscriptionPlans,
  durationOptions,
  orderRequesting,

  setStepsData,
  setCurrentStepIndex,
  loadSubscriptionPlans,
  resetSubscriptionPlans,
  sendOrder,
  resetOrder,
  addAlert,
  setModalInfo,
  resetModal,
  ...props
}) => {
  const cls = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const CurrentStep = allSteps[currentStepIndex].component;

  const stepProps = {
    stepsData,
    currentStepIndex,
    subscriptionPlansLoading,
    subscriptionPlans,
    durationOptions,
    orderRequesting,

    setStepsData,
    setCurrentStepIndex,
    loadSubscriptionPlans,
    resetSubscriptionPlans,
    sendOrder,
    resetOrder,
    addAlert,
    setModalInfo,
    resetModal,
  };

  useEffect(() => {
    loadSubscriptionPlans();
    return () => {
      resetSubscriptionPlans();
    };
  }, []);

  const finalPrice = useMemo(() => {
    const values = stepsData[0];

    if (subscriptionPlans.length > 0 && !isEmpty(values)) {
      const discountMultiplier = values[c.upfront] === 'yes' ? 0.9 : 1;
      return roundMoney(
        subscriptionPlans.find(
          (el) => el[c.duration_months] === values[c.duration],
        )[c.price_usd_per_gb] *
          Number(values[c.amount]) *
          discountMultiplier,
      ).toFixed(2);
    } else {
      return 0;
    }
  }, [subscriptionPlans, stepsData]);

  const pricePerGB = useMemo(() => {
    const values = stepsData[0];

    if (subscriptionPlans.length > 0 && values[c.duration]) {
      return roundMoney(
        subscriptionPlans.find(
          (el) => el[c.duration_months] === values[c.duration],
        )[c.price_usd_per_gb],
      ).toFixed(2);
    } else {
      return 0;
    }
  }, [subscriptionPlans, stepsData]);

  return (
    <div className={cls.main}>
      <SpinnerOverlay
        visible={subscriptionPlansLoading}
        text="Loading subscriptions information..."
      >
        <Stepper
          activeStep={currentStepIndex}
          alternativeLabel={isDesktop}
          orientation={isDesktop ? 'horizontal' : 'vertical'}
        >
          {allSteps.map(({ title }, index) => {
            return (
              <Step key={index}>
                <StepLabel>{title}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <Grid container spacing={2}>
          {!isEmpty(stepsData[0]) &&
            currentStepIndex > 0 &&
            !!finalPrice &&
            !!pricePerGB && (
              <>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    Current subscription info
                  </Typography>
                  <Typography variant="body2">
                    Duration:{' '}
                    <strong>
                      {
                        durationOptions.find(
                          (el) => el.value === stepsData[0][c.duration],
                        )?.title
                      }
                    </strong>
                  </Typography>
                  <Typography variant="body2">
                    Amount of storage:{' '}
                    <strong>
                      {
                        amountOptions.find(
                          (el) => el.value === stepsData[0][c.amount],
                        )?.title
                      }
                    </strong>
                  </Typography>
                  <Typography variant="body2">
                    Upfront payment:{' '}
                    <strong>
                      {
                        upfrontOptions.find(
                          (el) => el.value === stepsData[0][c.upfront],
                        )?.title
                      }
                    </strong>
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body2">
                    Total price: <strong>${finalPrice} / month</strong>
                  </Typography>
                  <Typography variant="body2">
                    Price per GB: <strong>${pricePerGB}</strong>
                  </Typography>
                </Grid>
              </>
            )}
          <Grid item xs={12}>
            <CurrentStep {...stepProps} />
          </Grid>
        </Grid>
      </SpinnerOverlay>
    </div>
  );
};

const mapState = (state) => ({
  stepsData: orderSelectors.stepsData(state),
  currentStepIndex: orderSelectors.currentStepIndex(state),
  subscriptionPlansLoading: orderSelectors.subscriptionPlansLoading(state),
  subscriptionPlans: orderSelectors.subscriptionPlans(state),
  durationOptions: orderSelectors.durationOptions(state),
  orderRequesting: orderSelectors.orderRequesting(state),
});

const mapDispatch = {
  setStepsData: orderActions.setStepsData,
  setCurrentStepIndex: orderActions.setCurrentStepIndex,
  loadSubscriptionPlans: orderActions.loadSubscriptionPlans,
  resetSubscriptionPlans: orderActions.resetSubscriptionPlans,
  sendOrder: orderActions.sendOrder,
  resetOrder: orderActions.resetOrder,

  addAlert: alertsActions.addAlert,

  setModalInfo: modalActions.setInfo,
  resetModal: modalActions.reset,
};

export default connect(mapState, mapDispatch)(StepHandler);
