import { createStore } from 'framework7/lite';

const initialState = {
  error: '',
  message: '',
  firstname: '',
  lastname: '',
  mobile: '',
  banknamemain: '',
  altrnumber: '',
  banknamealtnumber: '',
  photo: '',
  email: '',
  deviceId: null,
  token: '',
  access_token: '',
  community_id: '',
}

const saleDataInitialState = {
  farmer : '',
  payto : '',
  commodity: '',
  community_id :'',
  siloid:'',
  quantity: '',
  bags: '',
  unit_price: '',
  commodity_qc: '',
}

const store = createStore({
  state: {
    user: initialState,
    offlineUser: {},
    saleData: saleDataInitialState,
  },
  getters: {
    user({ state }) {
      return state.user;
    },
  },
  actions: {
    setUser({ state }, user) {
      state.user = user;
    },
    setOfflineUser({ state }, user) {
      state.offlineUser = user;
    },
    updateSaleData({ state }, data) {
      const updatedSaleData = {...state.saleData, ...data};
      state.saleData = updatedSaleData;
    },
    resetState({ state }) {
      state = {
        user: initialState,
        offlineUser: {},
        saleData: saleDataInitialState,
      };
    },

  },
})
export default store;
