import todoModule from './todo/module'
import doneModule from './done/module'

export default {
  namespace: 'recommend',

  state: {
  },

  actions: {
  },
  
  reducers: {
  },

  children: [
    todoModule,
    doneModule
  ]
}
