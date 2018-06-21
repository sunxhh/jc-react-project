import recommendModule from './recommend/module'

// ===========================> Action Types <=========================== //

export default {
  namespace: 'library',

  state: {
    first: ''
  },

  actions: {
  },

  reducers: {
  },

  children: [
    recommendModule
  ]
}
