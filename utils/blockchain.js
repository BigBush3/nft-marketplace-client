import Web3 from "web3";

import {
	NFT_ABI, 
	NFT_ADDRESS, 

	NFTSTORE_ADDRESS, 
	NFTSTORE_ABI,
	
	TIMEDAUCTION_ABI,
	TIMEDAUCTION_ADDRESS,
	
	SIMPLEAUCTION_ABI,
	SIMPLEAUCTION_ADDRESS,

	RINKEBY_RPC_URL, 
	ULR_INFURA_WEBSOCKET, 
	EVENTS_TOPICS
} from '../config/default.json'

const getProvider = () => {
    const provider = new Web3.providers.WebsocketProvider(ULR_INFURA_WEBSOCKET)
    provider.on('connect', () => console.log('WS Connected'))
    provider.on('error', () => {
      console.error('WS Error')
      web3.setProvider(getProvider())
    })
    provider.on('end', () => {
      console.error('WS End')
      web3.setProvider(getProvider())
    })

    return provider
  }
  const web3 = new Web3(Web3.givenProvider || getProvider())
// const web3 = new Web3(new Web3.providers.WebsocketProvider(ULR_INFURA_WEBSOCKET));


// const web3 = new Web3(new Web3.providers.HttpProvider(RINKEBY_RPC_URL));
// const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:3334'));

let walletAddress, wallet

let NFT = new web3.eth.Contract(NFT_ABI, NFT_ADDRESS)
let NFTSTORE = new web3.eth.Contract(NFTSTORE_ABI, NFTSTORE_ADDRESS)

let TIMEDAUCTION = new web3.eth.Contract(TIMEDAUCTION_ABI, TIMEDAUCTION_ADDRESS)
let SIMPLEAUCTION = new web3.eth.Contract(SIMPLEAUCTION_ABI, SIMPLEAUCTION_ADDRESS)

// подключение metamask



const getGasFee = async(gasLimit)=>{
	let result = 0
	await NFTSTORE.methods.getGasFee(gasLimit).call({}, (err, res)=>{
		console.log(`gasFee - ${res}`)
		result = res
	})
	return result;
}

const gasFee = {
	createAuction: 180100,
	createOrderSell: 159100,
	returnFreeBalance: 58100,

	createBidAuction: 216400,
	updateBidAuction: 76700,
	finishAuction: 144800,
	cancelAuction: 59700,

	buyOrder :136500,
    cancelOrderSell :63100,
    createBidMarket : 219800,
    realizeBid : 140500,
    cancelBid :58500
}




//////////////////////////////////////// МЕТОДЫ ДЛЯ NFT ТОКЕНА ///////////////////////////////



// Генерируем новый токен
// initialSupply - количество новый токенов
// file - хеш на файл 
// pdf - хеш на pdf

const createNewToken = async (initialSupply, royalty, file, pdf)=> {
	let fileHash ="imageHash"//= await uploadToIpfs(file),
	let	pdfHash ="pdfHash"//= await uploadToIpfs(pdf)

	let txData = NFT.methods.create(initialSupply, royalty, fileHash, pdfHash).encodeABI()
	if(!wallet){
		alert('you have to connect cryptowallet')
	} else {
		wallet.eth.sendTransaction({
		        to: NFT_ADDRESS,
		        from: walletAddress,
		        data: txData
		    },
		    function(error, res){
		        console.log(error);
		        console.log(res);
		        subscription(NFT_ADDRESS, EVENTS_TOPICS.CREATE)
		    }
		)		
	}
}


// Транзакция для рарешение смарт-контракту работать с токенами
const approve = async()=>{
	let txData = NFT.methods.setApprovalForAll(NFTSTORE_ADDRESS, true).encodeABI()
	if(!wallet){
		alert('you have to connect cryptowallet')
	} else {
		wallet.eth.sendTransaction({
		        to: NFT_ADDRESS,
		        from: walletAddress,
		        data: txData
		    },
		    function(error, res){
		        console.log(error);
		        console.log(res);
		        subscription(NFT_ADDRESS, EVENTS_TOPICS.APPROVE)
		    }
		)		
	}
}

// перевод токена без сделки

const transfer = (addressTo, tokenID, value)=> {
	if(!walletAddress && !wallet){
		alert('you have to connect cryptowallet')
	} else {
		let txData = NFT.methods.transferFrom(walletAddress, addressTo, tokenID, value).encodeABI()
		wallet.eth.sendTransaction({
		        to: NFT_ADDRESS,
		        from: walletAddress,
		        data: txData
		    },
		    function(error, res){
		        console.log(error);
		        console.log(res);
		    }
		)		
	}
}

// возвращает баланс пользователя по указаному токену (tokenID - number)

const balanceOf = async (_userAddress, tokenId) => {
	NFT.methods.balanceOf(_userAddress, tokenId).call({}, (err, res)=>{
		console.log(`balance of address ${_userAddress} - ${res}`)
	})
}

// возвращает массив балансов по указанным кошелькам и токенам (возможно не пригодится)
const balanceOfBatch = (_userAddressArray, tokenIdArray) => {
	NFT.methods.balanceOf(_userAddressArray, tokenIdArray).call({}, (err, res)=>{
		console.log(`balance of addresses ${_userAddressArray} - ${res}`)
	})
}		

// получить хеши файлов по токену 
const getTokenUriById = tokenId => {
	NFT.methods.mapUri(tokenId).call({}, (err, res)=>{
		console.log(`uriFile of tokenID ${tokenId} - ${res.file}`)
		console.log(`uriPdf of tokenID ${tokenId} - ${res.pdf}`)
	})
}

// получить id токена по хешу файлов
const getTokenIdByUri = uri => {
	NFT.methods.mapStringOfURI(uri).call({}, (err, res)=>{
		console.log(`tokenID of URI ${uri} - ${res}`)
	})
}

// получить адрес автора токена по tokenID
const getCreatorByTokenID = tokenID => {
	NFT.methods.creators(tokenID).call({}, (err, res)=>{
		console.log(`creator of tokenID ${tokenID} - ${res}`)
	})
}

// проверка разрешил ли пользователь смарт-контракту снимать с него токена
const isApprovedForAll = (userAddress) => {
	NFT.methods.isApprovedForAll(userAddress, NFTSTORE_ADDRESS).call({}, (err, res)=>{
		console.log(`isApprovedForAll - ${res}`)
	})
}	

// возвращает массив объектов транзакций переводов токенов
// путь obj.returnValues хранит от кого, кому и id токена
const getEventsTransfers = async(tokenId, timeFrom, timeTo)=>{
	let _fromBlock = await getBlock(timeFrom),
		_toBlock = await getBlock(timeTo)

	await NFT.getPastEvents(
		'TransferSingle', 
		{
			fromBlock: _fromBlock.block,
			toBlock: _toBlock.block,
			filter: {
				_id: tokenId
			}
		}, 
		(err, events) => {
			if(events!=null){
				console.log('EventsTransfers', events)
			}
		})
}



////////////////////////////////////// МЕТОДЫ ДЛЯ WHITELIST ////////////////////////////////////////////////

const addOwner = (newOwnerAddress)=> {
	if(!walletAddress && !wallet){
		alert('you have to connect cryptowallet')
	} else {
		let txData = NFTSTORE.methods.addOwner(newOwnerAddress).encodeABI()
		wallet.eth.sendTransaction({
		        to: NFT_ADDRESS,
		        from: walletAddress,
		        data: txData
		    },
		    function(error, res){
		        console.log(error);
		        console.log(res);
		    }
		)		
	}
}

const removeOwner = (ownerAddress)=> {
	if(!walletAddress && !wallet){
		alert('you have to connect cryptowallet')
	} else {
		let txData = NFTSTORE.methods.removeOwner(ownerAddress).encodeABI()
		wallet.eth.sendTransaction({
		        to: NFT_ADDRESS,
		        from: walletAddress,
		        data: txData
		    },
		    function(error, res){
		        console.log(error);
		        console.log(res);
		    }
		)		
	}
}

const addAdmin = (newAdminAddress)=> {
	if(!walletAddress && !wallet){
		alert('you have to connect cryptowallet')
	} else {
		let txData = NFT.methods.addAdmin(newAdminAddress).encodeABI()
		wallet.eth.sendTransaction({
		        to: NFT_ADDRESS,
		        from: walletAddress,
		        data: txData
		    },
		    function(error, res){
		        console.log(error);
		        console.log(res);
		    }
		)		
	}
}

const removeAdmin = (adminAddress)=> {
	if(!walletAddress && !wallet){
		alert('you have to connect cryptowallet')
	} else {
		let txData = NFT.methods.removeAdmin(adminAddress).encodeABI()
		wallet.eth.sendTransaction({
		        to: NFT_ADDRESS,
		        from: walletAddress,
		        data: txData
		    },
		    function(error, res){
		        console.log(error);
		        console.log(res);
		    }
		)		
	}
}

// return true/false
const isAdmin = async (address) => {
	NFT.methods.admins(address).call({}, (err, res)=>{
		console.log(`it's admin address ${address} - ${res}`)
	})
}

// return true/false
const isOwner = async (owners) => {
	NFTSTORE.methods.admins(address).call({}, (err, res)=>{
		console.log(`it's owners address ${address} - ${res}`)
	})
}
 


/////////////////////////////////////////////////// МЕТОДЫ ДЛЯ NFTSTORE //////////////////////////////////////////

const createOrderSell = async (tokenId, amount, price)=> {
	let fee = await getGasFee(gasFee.createOrderSell)
	await console.log('fee', fee)
	let txData = NFTSTORE.methods.createOrderSell(NFT_ADDRESS, tokenId, amount, web3.utils.toWei(String(price))).encodeABI()
	if(!wallet){
		alert('you have to connect cryptowallet')
	} else {
		wallet.eth.sendTransaction({
		        to: NFTSTORE_ADDRESS,
		        from: walletAddress,
		        value: web3.utils.toWei(String(fee/1e18)),
		        data: txData
		    },
		    function(error, res){
		        console.log(error);
		        console.log(res);
		        if(price>0){
		        	subscription(SIMPLEAUCTION_ADDRESS, EVENTS_TOPICS.FIX_ORDER_CREATED)
		        } else {
			        subscription(SIMPLEAUCTION_ADDRESS, EVENTS_TOPICS.Simple_Auction_Created)
		        }
		    }
		)		
	}
}

// timeStart and timeEnd must be in UNIX format
// example - 1629172781 

const createAuction = async (tokenId, firstPrice, timeStart, timeEnd)=> {
	let fee = await getGasFee(gasFee.createAuction)
	console.log("Gas Fee - ", fee)
	let txData = await NFTSTORE.methods.createAuction(NFT_ADDRESS, tokenId, web3.utils.toWei(String(firstPrice)), timeStart, timeEnd).encodeABI()
	if(!wallet){
		alert('you have to connect cryptowallet')
	} else {
		wallet.eth.sendTransaction({
		        to: NFTSTORE_ADDRESS,
		        from: walletAddress,
		        value: web3.utils.toWei(String(fee/1e18)),
		        data: txData
		    },
		    async function (error, res){
		        console.log(error);
		        console.log(res);
		        let subEvent = subscription(TIMEDAUCTION_ADDRESS, EVENTS_TOPICS.Time_Auction_Created)
		    	
		    	subEvent.on('data', event => {
		    		safeOrderIndexToBD(parseInt(event.data))
		    	})

				// subEvent.on('changed', changed => console.log(changed))
				// subEvent.on('error', err => { throw err })
				// subEvent.on('connected', nr => console.log(nr))
		    }
		)		
	}
}

// freeBalance это то деньги которыми пользователь сделал ставки, 
// но победителем оказался другой пользователь и теперь его деньги остались 
// на смарт контракте и ему их можно забрать через метод returnFreeBalance

const getFreeBalance = async (userAddress) => {
	let result = 0;
	await SIMPLEAUCTION.methods.getFreeBalance(userAddress).call({}, (err, res)=>{
		result += res;
		console.log(`free balance in simpleauction - ${res}`)
	})
	await TIMEDAUCTION.methods.getFreeBalance(userAddress).call({}, (err, res)=>{
		result += res;
		console.log(`free balance in timedauction - ${res}`)
	})
	return result
}	


const returnFreeBalance = async ()=> {
	let fee = await getGasFee(gasFee.returnFreeBalance)
	let txData = NFTSTORE.methods.returnFreeBalance().encodeABI()
	if(!wallet){
		alert('you have to connect cryptowallet')
	} else {
		wallet.eth.sendTransaction({
		        to: NFTSTORE_ADDRESS,
		        from: walletAddress,
		        value: web3.utils.toWei(String(fee/1e18)),
		        data: txData
		    },
		    function(error, res){
		        console.log(error);
		        console.log(res);
		        subscription(EVENTS_TOPICS.CREATE_ORDER)
		    }
		)		
	}
}

const getServiceFee = async()=>{
	let result
	await NFTSTORE.methods.getServiceFee().call({}, (err, res)=>{
		console.log(`ServiceFee - ${res/10}`)
		result = res/10;
	})
	return result
}



//////////////////////////////////////////////////// МЕТОДЫ для SIMPLEAUCTION ////////////////////////////////////

const cancelOrderSell = async (tokenId, orderIndex)=> {
	let fee = await getGasFee(gasFee.cancelOrderSell)
	let txData = SIMPLEAUCTION.methods.cancelOrderSell(NFT_ADDRESS, tokenId, orderIndex).encodeABI()
	if(!wallet){
		alert('you have to connect cryptowallet')
	} else {
		wallet.eth.sendTransaction({
		        to: SIMPLEAUCTION_ADDRESS,
		        from: walletAddress,
		        value: web3.utils.toWei(String(fee/1e18)),
		        data: txData
		    },
		    function(error, res){
		        console.log(error);
		        console.log(res);
		    }
		)		
	}
}

const buyOrder = async (tokenId, orderIndex, amount)=> {
	let fee = await getGasFee(gasFee.buyOrder)
	let txData = SIMPLEAUCTION.methods.buyOrder(NFT_ADDRESS, tokenId, orderIndex, amount).encodeABI()
	let order = await getOrder(tokenId, 0)
	if(!wallet){
		alert('you have to connect cryptowallet')
	} else {
		wallet.eth.sendTransaction({
		        to: SIMPLEAUCTION_ADDRESS,
		        from: walletAddress,
		        value: web3.utils.toWei(String(parseInt(order.price)/1e18*amount+(fee/1e18) )),
		        data: txData
		    },
		    function(error, res){
		        console.log(error);
		        console.log(res);
		    }
		)
	}
}


const createBidMarket = async (tokenId, orderIndex, amount, price)=> {
	let fee = await getGasFee(gasFee.createBidMarket)
	let txData = SIMPLEAUCTION.methods.createBidMarket(NFT_ADDRESS, tokenId, orderIndex, amount, web3.utils.toWei(String(price))).encodeABI()
	if(!wallet){
		alert('you have to connect cryptowallet')
	} else {
		wallet.eth.sendTransaction({
		        to: SIMPLEAUCTION_ADDRESS,
		        from: walletAddress,
		        value: web3.utils.toWei(String((amount*price)+ (fee/1e18) )),
		        data: txData
		    },
		    function(error, res){
		        console.log(error);
		        console.log(res);
		        subscription(SIMPLEAUCTION_ADDRESS, EVENTS_TOPICS.FIX_BID)
		    }
		)		
	}
}

const realizeBid = async (tokenId, orderIndex, bidIndex)=> {
	let fee = await getGasFee(gasFee.realizeBid)
	let txData = SIMPLEAUCTION.methods.realizeBid(NFT_ADDRESS, tokenId, orderIndex, bidIndex).encodeABI()
	if(!wallet){
		alert('you have to connect cryptowallet')
	} else {
		wallet.eth.sendTransaction({
		        to: SIMPLEAUCTION_ADDRESS,
		        from: walletAddress,
		        value: web3.utils.toWei(String(fee/1e18)),
		        data: txData
		    },
		    function(error, res){
		        console.log(error);
		        console.log(res);
		    }
		)		
	}
}

const cancelBid = async (tokenId, orderIndex, bidIndex)=> {
	let fee = await getGasFee(gasFee.cancelBid)
	let txData = SIMPLEAUCTION.methods.cancelBid(NFT_ADDRESS, tokenId, orderIndex, bidIndex).encodeABI()
	if(!wallet){
		alert('you have to connect cryptowallet')
	} else {
		wallet.eth.sendTransaction({
		        to: SIMPLEAUCTION_ADDRESS,
		        from: walletAddress,
		        value: web3.utils.toWei(String(fee/1e18)),
		        data: txData
		    },
		    function(error, res){
		        console.log(error);
		        console.log(res);
		    }
		)		
	}
}


/// view functions

const getOrder = async (tokenId, orderIndex) => {
	let result
	await SIMPLEAUCTION.methods.orderSells(NFT_ADDRESS, tokenId, orderIndex).call({}, (err, res)=>{
		console.log(`order - ${orderIndex} of token ${tokenId}`)
		console.log(res)
		result = res
	})
	return result;
}

const getBid = async (tokenId, orderIndex, bidIndex) => {
	let result
	await TIMEDAUCTION.methods.getBid(NFT_ADDRESS, tokenId, orderIndex, bidIndex).call({}, (err, res)=>{
		console.log(res)
		result = res
	})
	return result;
}

// fixBid - бид выставленные на simpleauction
const getAllUserFixBids = async(address, timeFrom, timeTo)=>{
	let _fromBlock = await getBlock(timeFrom),
		_toBlock = await getBlock(timeTo)

	await SIMPLEAUCTION.getPastEvents(
		'FixBid', 
		{
			fromBlock: _fromBlock.block,
			toBlock: _toBlock.block,

			filter: {
				user: address
			}
		}, 
		(err, events) => {
			if(events!=null){
				console.log("FixBids", events)
			}
		})
}

// sellOrder - токен выставленный на simple auction
const getAllUserSellOrdersAuction = async(address, timeFrom, timeTo)=>{
	let _fromBlock = await getBlock(timeFrom),
		_toBlock = await getBlock(timeTo)

	await SIMPLEAUCTION.getPastEvents(
		'SimpleAuctionCreated', 
		{
			fromBlock: _fromBlock.block,
			toBlock: _toBlock.block,
			filter: {
				seller: address
			}
		}, 
		(err, events) => {
			if(events!=null){
				console.log('SimpleAuctions',events)
			}
		})
}

const getAllUserSellOrdersFix = async(address, timeFrom, timeTo)=>{
	let res
	let _fromBlock = await getBlock(timeFrom),
		_toBlock = await getBlock(timeTo)

	await SIMPLEAUCTION.getPastEvents(
		'FixOrder', 
		{
			fromBlock: _fromBlock.block,
			toBlock: _toBlock.block,
			filter: {
				seller: address
			}
		}, 
		(err, events) => {
			if(events!=null){
				res = events
			}
		})
	return res
}


const isOrdersExists = async(CONTRACT, tokenIds, orderIndexes)=>{
	let result
	console.log('tokenIds', tokenIds)
	console.log('orderIndexes', orderIndexes)
	await CONTRACT.methods.getTokensInFixMarket(NFT_ADDRESS, tokenIds, orderIndexes).call({}, (err, res)=>{
		console.log(`orders exists - ${res}`)
		result = res
	})
	return result
}

const getTokensInMarket = async (address)=>{
	let result = {
		fixOrders: [],
		auctions: []
	}
	const allEventsFixOrders = await getAllUserSellOrdersFix(address, 0, 'latest')
	
	let allFixOrders = {
		tokenIds: [],
		orderIndexes: []
	}
	for(let i=0; i<allEventsFixOrders.length; i++){
		allFixOrders.tokenIds.push(parseInt(allEventsFixOrders[i].returnValues.tokenId))
		allFixOrders.orderIndexes.push(parseInt(allEventsFixOrders[i].returnValues.orderIndex))
	}
	
	const existFixOrders = await isOrdersExists(SIMPLEAUCTION, allFixOrders.tokenIds, allFixOrders.orderIndexes)
	
	for(let i=0; i<existFixOrders.length; i++){
		if(existFixOrders[i]){
			result.fixOrders.push({
				tokenId: allFixOrders.tokenIds[i],
				orderIndex: allFixOrders.orderIndexes[i],
				seller: allEventsFixOrders[i].returnValues.seller
			})
		}
	}
	
	const allEventsAuction = await getAllUserAuctions(address, 0, 'latest')
	let allAuctions = {
		tokenIds: [],
		orderIndexes: []
	}
	for(let i=0; i<allEventsAuction.length; i++){
		allAuctions.tokenIds.push(parseInt(allEventsAuction[i].returnValues.tokenId))
		allAuctions.orderIndexes.push(parseInt(allEventsAuction[i].returnValues.orderIndex))
	}
	const existAuctions = await isOrdersExists(TIMEDAUCTION, allAuctions.tokenIds, allAuctions.orderIndexes)

	for(let i=0; i<existAuctions.length; i++){
		if(existAuctions[i]){
			result.auctions.push({
				tokenId: allAuctions.tokenIds[i],
				orderIndex: allAuctions.orderIndexes[i],
				seller: allEventsAuction[i].returnValues.seller
			})
		}
	}

	console.log('result', result)
}

const isBidsExists = async(tokenIds, orderIndexes, bidIndexes)=>{
	SIMPLEAUCTION.methods.getUsersFixOrderBids(NFT_ADDRESS, tokenIds, orderIndexes, bidIndexes).call({}, (err, res)=>{
		console.log(`bids of order - exists - ${res}`)
		return res;
	})
}



///////////////////////////////////////////////// МЕТОДЫ ДЛЯ TIMEDAUCTION ////////////////////////////////////////

const cancelAuction = async (tokenId, auctionIndex)=> {
	let fee = await getGasFee(gasFee.cancelAuction)
	let txData = TIMEDAUCTION.methods.cancelAuction(NFT_ADDRESS, tokenId, auctionIndex).encodeABI()
	if(!wallet){
		alert('you have to connect cryptowallet')
	} else {
		wallet.eth.sendTransaction({
		        to: TIMEDAUCTION_ADDRESS,
		        from: walletAddress,
		        value: web3.utils.toWei(String(fee/1e18)),
		        data: txData
		    },
		    function(error, res){
		        console.log(error);
		        console.log(res);
		    }
		)		
	}
}

const createBidAuction = async (tokenId, auctionIndex, value)=> {
	let fee = await getGasFee(gasFee.createBidAuction)
	let txData = TIMEDAUCTION.methods.createBidAuction(NFT_ADDRESS, tokenId, auctionIndex).encodeABI()
	if(!wallet){
		alert('you have to connect cryptowallet')
	} else {
		wallet.eth.sendTransaction({
		        to: TIMEDAUCTION_ADDRESS,
		        from: walletAddress,
		        value: web3.utils.toWei(String(value+ (fee/1e18) )),
		        data: txData
		    },
		    function(error, res){
		        console.log(error);
		        console.log(res);
		        subscription(TIMEDAUCTION_ADDRESS, EVENTS_TOPICS.AUCTION_BID)
		    }
		)		
	}
}

const updateBidAuction = async (tokenId, auctionIndex, bidIndex, value)=> {
	let fee = await getGasFee(gasFee.updateBidAuction)
	let txData = TIMEDAUCTION.methods.updateBidAuction(NFT_ADDRESS, tokenId, auctionIndex, bidIndex).encodeABI()
	if(!wallet){
		alert('you have to connect cryptowallet')
	} else {
		wallet.eth.sendTransaction({
		        to: TIMEDAUCTION_ADDRESS,
		        from: walletAddress,
		        value: web3.utils.toWei(String(value+ (fee/1e18) )),
		        data: txData
		    },
		    function(error, res){
		        console.log(error);
		        console.log(res);
		    }
		)		
	}
}

const finishAuction = async (tokenId, auctionIndex)=> {
	let fee = await getGasFee(gasFee.finishAuction)
	let txData = TIMEDAUCTION.methods.finishAuction(NFT_ADDRESS, tokenId, auctionIndex).encodeABI()
	if(!wallet){
		alert('you have to connect cryptowallet')
	} else {
		wallet.eth.sendTransaction({
		        to: TIMEDAUCTION_ADDRESS,
		        from: walletAddress,
		        value: web3.utils.toWei(String(fee/1e18)),
		        data: txData
		    },
		    function(error, res){
		        console.log(error);
		        console.log(res);
		    }
		)		
	}
}

// view functions

const getAllUserAuctionBids = async(userAddress, timeFrom, timeTo)=>{
	let _fromBlock = await getBlock(timeFrom),
		_toBlock = await getBlock(timeTo),
		res
	await TIMEDAUCTION.getPastEvents(
		'AuctionBid', 
		{
			fromBlock: _fromBlock.block,
			toBlock: _toBlock.block,
			filter: {
				user: userAddress
			}
		}, 
		(err, events) => {
			if(events!=null){
				console.log("AuctionBids", events)
				res = events
			}
		})
	return res
}

const getAllTokenAuctionBids = async(_tokenId)=>{
	let res
	await TIMEDAUCTION.getPastEvents(
		'AuctionBid', 
		{
			fromBlock: 0,
			toBlock: 'latest',
			filter: {
				tokenId: _tokenId
			}
		}, 
		(err, events) => {
			if(events!=null){
				res = events
			}
		})
	return res
}


// sellOrder - токен выставленный на simple auction
const getAllUserAuctions = async(address, timeFrom, timeTo)=>{
	let res
	let _fromBlock = await getBlock(timeFrom),
		_toBlock = await getBlock(timeTo)

	await TIMEDAUCTION.getPastEvents(
		'AuctionOrder', 
		{
			fromBlock: _fromBlock.block,
			toBlock: _toBlock.block,
			filter: {
				seller: address
			}
		}, 
		(err, events) => {
			if(events!=null){
				res = events
			}
		})
	return res
}

const getAllTokenAuctions = async(_tokenId)=>{
	let res

	await TIMEDAUCTION.getPastEvents(
		'AuctionOrder', 
		{
			fromBlock: 0,
			toBlock: 'latest',
			filter: {
				tokenId: _tokenId
			}
		}, 
		(err, events) => {
			if(events!=null){
				res = events
			}
		})
	return res
}

const getAuction = async (tokenId, auctionIndex) => {
	let result
	console.log("lalal")
	await TIMEDAUCTION.methods.auctions(NFT_ADDRESS, tokenId, auctionIndex).call({}, (err, res)=>{
		console.log(`order - ${auctionIndex} of token ${tokenId}`)
		console.log(res)
		result = res
	})
	return result;
}

// const getAuctionBid = async (tokenId, auctionIndex, bidIndex) => {
// 	let auction = await getAuction(tokenId, auctionIndex)
// 	console.log(console.log(`bid ${bidIndex} of auction - ${auctionIndex} of token ${tokenId}`))
// 	console.log(auction)
// }

const auctionIsRun = async (tokenId, auctionIndex) => {
	let res = await TIMEDAUCTION.methods.auctionIsRun(NFT_ADDRESS, tokenId, auctionIndex).call()
	console.log(`auction: ${auctionIndex} of tokenId: ${tokenId} is running - ${res}`)
	return res
}




///////////////////////////////////////////// ОБЩИЕ МЕТОДЫ ////////////////////////////////////////////////


const getAllAuctionPurchased = async(_tokenId)=>{
	let res
	await TIMEDAUCTION.getPastEvents(
		'Deal', 
		{
			fromBlock: 0,
			toBlock: 'latest',

			filter: {
				nft: NFT_ADDRESS,
				tokenId: _tokenId
			}
		}, 
		(err, events) => {
			if(events!=null){
				res = events
			}
		})
	return res
}

const getAllFixPurchaseds = async(_tokenId)=>{
	let res
	await SIMPLEAUCTION.getPastEvents(
		'Deal', 
		{
			fromBlock: 0,
			toBlock: 'latest',

			filter: {
				nft: NFT_ADDRESS,
				tokenId: _tokenId
			}
		}, 
		(err, events) => {
			if(events!=null){
				res = events
			}
		})
	return res
}

const getAllFixOrdersToken = async(_tokenId)=>{
	let res

	await SIMPLEAUCTION.getPastEvents(
		'FixOrder', 
		{
			fromBlock: 0,
			toBlock: 'latest',
			filter: {
				tokenId: _tokenId
			}
		}, 
		(err, events) => {
			if(events!=null){
				res = events
			}
		})
	return res
}

const getAllCanceledFixToken = async(_tokenId)=>{
	let res
	await SIMPLEAUCTION.getPastEvents(
		'CancelFixOrder', 
		{
			fromBlock: 0,
			toBlock: 'latest',
			filter: {
				tokenId: _tokenId
			}
		}, 
		(err, events) => {
			if(events!=null){
				res = events
			}
		})
	return res
}

const getAllCanceledAuctions = async(_tokenId)=>{
	let res
	await TIMEDAUCTION.getPastEvents(
		'CancelAuction', 
		{
			fromBlock: 0,
			toBlock: 'latest',
			filter: {
				tokenId: _tokenId
			}
		}, 
		(err, events) => {
			if(events!=null){
				res = events
			}
		})
	return res
}

const getUpdatedBidByToken = async(_tokenId)=>{
	let res
	await TIMEDAUCTION.getPastEvents(
		'UpdateBidAuction', 
		{
			fromBlock: 0,
			toBlock: 'latest',
			filter: {
				tokenId: _tokenId
			}
		}, 
		(err, events) => {
			if(events!=null){
				res = events
			}
		})
	return res
}

export const getTokenOwnHistory = async(_tokenId)=>{
	const fixPurchased = await getAllFixPurchaseds(_tokenId)
	const auctionPurchaseds = await getAllAuctionPurchased(_tokenId)
	let history = fixPurchased.concat(auctionPurchaseds)
	return sortEvents(history)
}

const getMinted = async(_tokenId)=>{
	let res
	await NFT.getPastEvents(
		'Create', 
		{
			fromBlock: 0,
			toBlock: 'latest',
			filter: {
				_id: _tokenId
			}
		}, 
		(err, events) => {
			if(events!=null){
				res = events
			}
		})
	return res
}

export const getAllTokenHistory = async(_tokenId)=>{
	// const ownersHistory = await getTokenOwnHistory(_tokenId)
	
	const auctionOrders = await getAllTokenAuctions(_tokenId)
	const auctionsCanceled = await getAllCanceledAuctions(_tokenId)
	const bids = await getAllTokenAuctionBids(_tokenId)
	const updateis = await getUpdatedBidByToken(_tokenId)
	const auctionPurchaseds = await getAllAuctionPurchased(_tokenId)

	const fixOrders = await getAllFixOrdersToken(_tokenId)
	const fixCanceled = await getAllCanceledFixToken(_tokenId)
	const fixPurchased = await getAllFixPurchaseds(_tokenId)
	const Minted = await getMinted(_tokenId)

	let result = auctionOrders.concat(auctionsCanceled)
		
		.concat(fixCanceled)
		.concat(fixPurchased)
		
		.concat(auctionPurchaseds)
		.concat(fixOrders)
		.concat(bids)
		.concat(Minted)
		.concat(updateis)
		
	return sortEvents(result)
}
export const getAllBidHistory = async(_tokenId) => {
	const bids = await getAllTokenAuctionBids(_tokenId)
	const updateBids = await getUpdatedBidByToken(_tokenId)
	let bidHistory = bids.concat(updateBids)
	return sortEvents(bidHistory)
}

const sortEvents = (events)=>{
	
	events.sort((a,b)=>{
		return a.blockNumber - b.blockNumber
	})
	return events;
}

const getTokendByCreator = async(address)=>{
	let events
	await NFT.getPastEvents(
		'Create', 
		{
			fromBlock: 0,
			toBlock: 'latest',
			filter: {
				creator: address
			}
		}, 
		(err, _events) => {
			if(_events!=null){
				events = _events
				console.log('Created tokens: ', events)
			}
		})
	return events
}

const getBlock = async(timeFrom)=>{
	if(timeFrom==='latest'){
		return web3.eth.getBlockNumber()
	}
	let block = await dater.getDate(
			timeFrom,
			true
		)
	return block
}

const getBalance = async (address)=>{
	let balance = await web3.eth.getBalance(address)
	return balance
}

const example = async ()=>{
	// let res = await auctionIsRun(1,0)
	// console.log('auctionIsRun', res)
	// getTokendByCreator('0xd09Eb1fcCD1b0A04799F4763EB2aC63296633C54')
	// getTokensInMarket('0xd09Eb1fcCD1b0A04799F4763EB2aC63296633C54')

	// const auctionOrders = await getAllTokenAuctions(1)
	// console.log('auctionOrders: ', auctionOrders)
	// const auctionsCanceled = await getAllCanceledAuctions(1)
	// console.log('auctionsCanceled: ', auctionsCanceled)
	// const bids = await getAllTokenAuctionBids(1)
	// console.log("bids: ", bids)
	
	// const auctionPurchaseds = await getAllAuctionPurchased(1)
	// console.log('auctionPurchaseds: ', auctionPurchaseds)


	// const fixOrders = await getAllFixOrdersToken(1)
	// console.log('fixOrders: ', fixOrders)
	// const fixCanceled = await getAllCanceledFixToken(1)
	// console.log('fixCanceled: ', fixCanceled)
	// const fixPurchased = await getAllFixPurchaseds(1)
	// console.log('fixPurchased: ', fixPurchased)
	// const Minted = await getMinted(1)
	// console.log('Minted: ', Minted)

	const ownersToken = await getTokenOwnHistory(1)
	console.log('ownersToken: ', ownersToken)

	const bids = await getAllTokenAuctionBids(1)
	console.log("bids: ", bids)

	const history = await getAllTokenHistory(4)
	console.log('history: ', history)

	const updateis = await getUpdatedBidByToken(1)
	console.log('updateis: ', updateis)

	// const Minted = await getMinted(4)
	// console.log("Minted: ", Minted)

	// getServiceFee()
	// console.log(web3)
	// console.log(web3.utils.toWei('.2'));
	// getAllUserAuctionBids("0xd09Eb1fcCD1b0A04799F4763EB2aC63296633C54", 0, Date.now())
	// getAllUserAuctions("0xd09Eb1fcCD1b0A04799F4763EB2aC63296633C54", 0, Date.now())

	// getAllUserFixBids('0x2778C6F33A0C9a20866Cce84beb3e78b9dD26AE5', 0, Date.now())
	// getAllUserSellOrdersAuction("0xd09Eb1fcCD1b0A04799F4763EB2aC63296633C54", 0, Date.now())
	// getEventsTransfers(1, 0, Date.now())
	// balanceOf('0xd09Eb1fcCD1b0A04799F4763EB2aC63296633C54', 1) 

// getAuction(16, 0)
// getAuctionBid()

	// getTokenUriById(1) // return {file: 'qwert', pdf: 'asdfg'} 
	// getTokenIdByUri('aaaa') // return 1
	// getTokenIdByUri('ccccc') // return 1
	// getCreatorByTokenID(1) // return 0xd09Eb1fcCD1b0A04799F4763EB2aC63296633C54
	// isApprovedForAll('0xd09Eb1fcCD1b0A04799F4763EB2aC63296633C54') // return true
	// const balance = await getBalance('0xd09Eb1fcCD1b0A04799F4763EB2aC63296633C54') 
	// console.log(balance)
}



const subscription = (contractAddress, topic)=>{
	console.log('start subscription')
	console.log('contractAddress: ', contractAddress)
	console.log('topic: ', topic)
	return web3.eth.subscribe('logs', {
	    address: contractAddress,
	    topics: [topic]
	})
} 