import cloneDeep from 'lodash/cloneDeep';

import * as c from 'src/constants';

const MODULE_PREFIX = 'order/';

export const orderTypes = {
  SET_STEPS_DATA: MODULE_PREFIX + 'SET_STEPS_DATA',
  SET_CURRENT_STEP_INDEX: MODULE_PREFIX + 'SET_CURRENT_STEP_INDEX',
  SUBSCRIPTION_PLANS_LOAD: MODULE_PREFIX + 'SUBSCRIPTION_PLANS_LOAD',
  SUBSCRIPTION_PLANS_LOAD_SUCCESS:
    MODULE_PREFIX + 'SUBSCRIPTION_PLANS_LOAD_SUCCESS',
  SUBSCRIPTION_PLANS_LOAD_ERROR:
    MODULE_PREFIX + 'SUBSCRIPTION_PLANS_LOAD_ERROR',
  SUBSCRIPTION_PLANS_LOAD_RESET:
    MODULE_PREFIX + 'SUBSCRIPTION_PLANS_LOAD_RESET',
  ORDER_REQUEST: MODULE_PREFIX + 'ORDER_REQUEST',
  ORDER_REQUEST_SUCCESS: MODULE_PREFIX + 'ORDER_REQUEST_SUCCESS',
  ORDER_REQUEST_ERROR: MODULE_PREFIX + 'ORDER_REQUEST_ERROR',
  ORDER_REQUEST_RESET: MODULE_PREFIX + 'ORDER_REQUEST_RESET',
};

export const orderActions = {
  setStepsData: (info, index) => ({
    type: orderTypes.SET_STEPS_DATA,
    payload: { info, index },
  }),
  setCurrentStepIndex: (index) => ({
    type: orderTypes.SET_CURRENT_STEP_INDEX,
    payload: { index },
  }),
  loadSubscriptionPlans: () => ({
    type: orderTypes.SUBSCRIPTION_PLANS_LOAD,
  }),
  resetSubscriptionPlans: () => ({
    type: orderTypes.SUBSCRIPTION_PLANS_LOAD_RESET,
  }),
  sendOrder: (payload, onSuccess) => ({
    type: orderTypes.ORDER_REQUEST,
    payload,
    onSuccess,
  }),
  resetOrder: () => ({
    type: orderTypes.ORDER_REQUEST_RESET,
  }),
};

export const orderSelectors = {
  stepsData: (state) => state.order.stepsData,
  currentStepIndex: (state) => state.order.currentStepIndex,
  subscriptionPlansLoading: (state) => state.order.subscriptionPlansLoading,
  subscriptionPlans: (state) => state.order.subscriptionPlans,
  orderRequesting: (state) => state.order.orderRequesting,
  durationOptions: (state) => state.order.selectOptions[c.duration],
};

const initialState = {
  stepsData: [{}, {}, {}],
  currentStepIndex: 0,
  subscriptionPlansLoading: true,
  subscriptionPlans: [],
  orderRequesting: false,
  selectOptions: {
    [c.duration]: [],
  },
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case orderTypes.SET_STEPS_DATA: {
      const updatedStepsData = cloneDeep(state.stepsData);

      updatedStepsData[payload.index] = payload.info;

      return {
        ...state,
        stepsData: updatedStepsData,
      };
    }
    case orderTypes.SET_CURRENT_STEP_INDEX: {
      return {
        ...state,
        currentStepIndex: payload.index,
      };
    }

    case orderTypes.SUBSCRIPTION_PLANS_LOAD: {
      return {
        ...state,
        subscriptionPlansLoading: true,
      };
    }
    case orderTypes.SUBSCRIPTION_PLANS_LOAD_SUCCESS: {
      return {
        ...state,
        subscriptionPlans: payload[c.subscription_plans],
        subscriptionPlansLoading: false,
        selectOptions: {
          ...state.selectOptions,
          [c.duration]: payload[c.subscription_plans].map((el) => ({
            title: `${el[c.duration_months]} months`,
            value: el[c.duration_months],
          })),
        },
      };
    }
    case orderTypes.SUBSCRIPTION_PLANS_LOAD_ERROR: {
      return {
        ...state,
        subscriptionPlansLoading: false,
      };
    }
    case orderTypes.SUBSCRIPTION_PLANS_LOAD_RESET: {
      return {
        ...state,
        subscriptionPlansLoading: true,
        subscriptionPlans: [],
        selectOptions: initialState.selectOptions,
      };
    }

    case orderTypes.ORDER_REQUEST: {
      return {
        ...state,
        orderRequesting: true,
      };
    }
    case orderTypes.ORDER_REQUEST_SUCCESS: {
      return {
        ...state,
        orderRequesting: false,
      };
    }
    case orderTypes.ORDER_REQUEST_ERROR: {
      return {
        ...state,
        orderRequesting: false,
      };
    }
    case orderTypes.ORDER_REQUEST_RESET: {
      return {
        ...state,
        stepsData: [{}, {}, {}],
        currentStepIndex: 0,
        orderRequesting: false,
      };
    }

    default:
      return state;
  }
};
