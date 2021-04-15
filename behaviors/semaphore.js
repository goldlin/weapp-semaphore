// behaviors/semaphore.js
const app = getApp();

export default Behavior({
  behaviors: [],
  properties: {
  },
  data: {
    _semaKey: '',
  },

  attached() {
    const { __wxWebviewId__, __wxExparserNodeId__, route } = getCurrentPages().pop();
    this.data._semaKey = JSON.stringify({ __wxWebviewId__, __wxExparserNodeId__, route });
    const curSems = this.getSem();
    if (curSems === undefined) {
      app.globalData.semaphoreStore.set(this.data._semaKey, { _refCount: 1 });
    } else {
      this.setSelfSem({
        _refCount: curSems._refCount + 1,
      });
    }
  },

  detached() {
    const curSems = this.getSem();
    if (curSems._refCount > 1) {
      this.setSelfSem({
        _refCount: curSems._refCount - 1,
      });
    } else {
      app.globalData.semaphoreStore.delete(this.data._semaKey);
    }
  },

  methods: {
    setSem(obj = {}) {
      console.log(`setSem: ${JSON.stringify(obj)}`);
      try {
        const newSemStore = new Map([...app.globalData.semaphoreStore]
          .map(([key, value]) => (key === this.data._semaKey ? [key, value] : [key, Object.assign({}, value, obj)])));
        app.globalData.semaphoreStore = newSemStore;
      } catch (error) {
        // assign failed
        console.log('setSem failed!');
        return false;
      }
      return true;
    },

    // set a semaphore on current page, to use on next onShow
    setSelfSem(obj = {}) {
      console.log(`setSelfSem: ${JSON.stringify(obj)}`);
      try {
        const newSems = Object.assign({}, this.getSem(), obj);
        app.globalData.semaphoreStore.set(this.data._semaKey, newSems);
      } catch (error) {
        // assign failed
        console.log('setSelfSem failed!');
        return false;
      }
      return true;
    },

    // consume a semaphone by key, what is, delete the key and return its value
    consumeSem(semKey = '') {
      const sem = this.getSem();
      if (sem === undefined) return undefined;
      const value = sem[semKey];
      delete sem[semKey];
      return value;
    },

    // return semaphores of current page, but not consume
    getSem(semKey) {
      const sem = app.globalData.semaphoreStore.get(this.data._semaKey);
      if (semKey) return sem[semKey];
      return sem;
    },

    // remove a semaphone by key, what is, delete the key from all the semaphoreStore
    removeSem(semKey = '') {
      try {
        const newSemStore = new Map([...app.globalData.semaphoreStore]
          .map(([key, value]) => {
            if (key !== this.data._semaKey) {
              const newValue = value;
              delete newValue[semKey];
              return [key, newValue];
            }
            return [key, value];
          }));
        app.globalData.semaphoreStore = newSemStore;
      } catch (error) {
        // delete failed
        return false;
      }
      return true;
    },
  },
});
