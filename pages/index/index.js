Page({
  data: {
    info: '',
    infoApp: '',
  },
  onLoad() {
    this.semaphore = this.selectComponent("#semaphore");
  },
  onShow() {
    this.refreshInfo();
  },
  refreshInfo() {
    this.setData({ info: JSON.stringify(this.semaphore.getSem()) });
    this.setData({ infoApp: JSON.stringify(Array.from(getApp().globalData.semaphoreStore))});
  },
  addSem({ currentTarget: { dataset: { flag: key }} }) {
    this.semaphore.setSem({ [key]: true });
    this.refreshInfo();
  },
  addSelfSem({ currentTarget: { dataset: { flag: key }} }) {
    this.semaphore.setSelfSem({ [key]: true });
    this.refreshInfo();
  },
  useSem({ currentTarget: { dataset: { flag: key }} }) {
    this.semaphore.consumeSem(key);
    this.refreshInfo();
  },
  delSem({ currentTarget: { dataset: { flag: key }} }) {
    this.semaphore.removeSem(key);
    this.refreshInfo();
  },
  onTap() {
    wx.navigateTo({ url: '../step1/step1' });
  }
});
