import semaphore from '../../behaviors/semaphore';

Component({
  behaviors: [semaphore],
  data: {
    info: '',
    infoApp: '',
  },
  pageLifetimes: {
    show() {
      this.refreshInfo();
    },
  },
  methods: {
    refreshInfo() {
      this.setData({ info: JSON.stringify(this.getSem()) });
      this.setData({ infoApp: JSON.stringify(Array.from(getApp().globalData.semaphoreStore))});
    },
    addSem({ currentTarget: { dataset: { flag: key }} }) {
      this.setSem({ [key]: true });
      this.refreshInfo();
    },
    addSelfSem({ currentTarget: { dataset: { flag: key }} }) {
      this.setSelfSem({ [key]: true });
      this.refreshInfo();
    },
    useSem({ currentTarget: { dataset: { flag: key }} }) {
      this.consumeSem(key);
      this.refreshInfo();
    },
    delSem({ currentTarget: { dataset: { flag: key }} }) {
      this.removeSem(key);
      this.refreshInfo();
    },
    onTap() {
      wx.reLaunch({ url: '../index/index' });
    }
  },
});
