import axios from 'axios';

const API = process.env.API_URL;
const OER_APP_ID = '9317f57120ea4b259808c8cb148f2fce';
const WARN_MISSING_DATA_NODE = 'No HTML data-node found';
const WARN_NO_NODE_DATA = 'Node data is empty';

function getHtmlData(key) {
  const node = document.getElementById(key);
  if (!node) return Promise.reject(WARN_MISSING_DATA_NODE);
  return Promise.resolve(node.innerHTML);
}

function processHtmlData(data) {
  if (data === '') return Promise.reject(WARN_NO_NODE_DATA);

  try {
    return Promise.resolve(JSON.parse(data));
  } catch (e) {
    return Promise.reject(e);
  }
}

function setJsonData(context, instance, data) {
  context.commit(instance, data);
}

export default {
  getLinklists(context) {
    const key = 'linklists-data';
    getHtmlData(key)
      .then(processHtmlData)
      .then(data => setJsonData(context, 'LOAD_LINKLISTS', data))
      /* eslint no-console: ["error", { allow: ["warn", "error"] }] */
      .catch(err => console.warn(`WARNING while loading '${key}':`, err));
  },
  LOAD_COLLECTIONS: ({ commit }) => {
    axios.get(`${API}/collections/all?view=collections-endpoint`)
      .then((response) => {
        commit('SET_COLLECTIONS', response.data.collections);
      });
  },
  LOAD_PRODUCTS: ({ commit }) => {
    axios.get(`${API}/collections/all?view=products-endpoint`)
      .then((response) => {
        commit('SET_PRODUCTS', response.data.products);
      });
  },
  SET_LANG: ({ commit }, payload) => {
    commit('SET_LANG', payload);
  },
  LOAD_CART: ({ commit }) => {
    axios.get(`${API}/cart.js`)
      .then((response) => {
        commit('SET_CART', response.data);
      });
  },
  ADD_TO_CART: (payload) => {
    axios.post(`${API}/cart/add.js`, payload);
  },
  LOAD_CURRENCY_RATES: ({ commit }) => {
    axios.get(`https://openexchangerates.org/api/latest.json?app_id=${OER_APP_ID}&base=CAD`)
      .then((response) => {
        commit('SET_CURRENCY_RATES', response.rates);
      });
  },
};
