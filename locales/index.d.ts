/**
 * Интерфейс языковой локали
 */
export default interface Language {
  value: 'en' | 'ru';
  wallet: string;
  popular: string;
  more: string;
  placeBid: string;
  buy: string;
  send: string;
  chat: string;
  date: string;
  price: string;
  filter: string;
  language: string;
  upload: string;
  save: string;
  uploadFile: string;
  fileFormats: string;
  description: string;
  uploadDescription: string;
  roalty: string;
  authors: string;
  author: string;
  buyBid: string;
  share: string;
  documents: string;
  highestBid: string;
  history: string;
  bids: string;
  shareModalText: string
  auction: {
    auctionEnded: string;
    title: string;
    firstBid: string;
    startDate: string;
    endDate: string;
    fixPay: string;
    setPrice: string;
    createHashTag: string;
    nftName: string;
    collectionName: string;
    countNFT: string;
  };
  form: {
    yourName: string;
    yourEmail: string;
    profilePhoto: string;
    headerImage: string;
  };
  formQuestion: {
    haveQuestions: string;
    text: string;
  };
  pageNames: {
    home: string;
    fineArt: string;
    marketPlace: string;
    support: string;
    about: string;
    settings: string;
    createNFT: string;
    createOne: string;
    createMany: string;
    activity: string;
    resell: string;
  };
  searchBy: {
    name: string;
    title: string;
    author: string;
    collection: string;
  };
  filterBy: {
    day: string;
    week: string;
    mouth: string;
  };
  create: {
    one: string;
    oneDesc: string;
    many: string;
    manyDesc: string;
  };
  cabinet: {
    returnBalance: string;
    bidHistory: string;
    auctionBallance: string;
    walletBallance: string;
    created: string;
    inMarket: string;
    myCollection: string;
    favorites: string;
    followers: string;
    following: string;
    Collection: string;
  };
  footer: {
    weInSocial: string;
    privacyPolicy: string;
    termsOfUse: string;
    reportAnError: string;
    allRightsReserved: string;
    subscribe: string;
  };
  userMenu: {
    title: string;
    myProfile: string;
    addNft: string;
    settings: string;
    disconnect: string;
  };
  modal: {
    connectToAWalet: string;
    connectToAWalletDesc: string;
    termsOfService: {
      title: string;
      description: string;
      iHaveOld: string;
      iAccept: string;
      proceed: string;
    };
  };
  theme: string;
  message: string;
  videoInstruction: string;
}
