var MDPToken = artifacts.require("./MDPToken.sol");
var MDPTokenSale = artifacts.require("./MDPTokenSale.sol");

contract('MDPTokenSale', function(accounts) {
	var tokenInstance;
	var tokenSaleInstance;
	var tokenPrice = 1000000000000; //in wei
	var admin = accounts[0];
	var buyer = accounts[1];
	var tokensAvailable = 750000;
	var numberOfTokens;

	it('initializes the contract with the correct values', function() {
		return MDPTokenSale.deployed().then(function(instance) {
			tokenSaleInstance = instance;
			return tokenSaleInstance.address
		}).then(function(address) {
			assert.notEqual(address, 0x0, 'has contract address');
			return tokenSaleInstance.tokenContract();
		}).then(function(address) {
			assert.notEqual(address, 0x0, 'has token contract address');
			return tokenSaleInstance.tokenPrice();
		}).then(function(price) {
			assert.equal(price, tokenPrice, 'token price is correct');
		})
	})

	it('facilitates token buying', function() {
		return MDPToken.deployed().then(function(instance) {
			tokenInstance = instance;
			return MDPTokenSale.deployed();
		}).then(function(instance) {
			tokenSaleInstance = instance;
			return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, { from: admin })
		}).then(function(receipt) {
			numberOfTokens = 10;
			return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: numberOfTokens * tokenPrice })
		}).then(function(receipt) {
			assert.equal(receipt.logs.length, 1, 'trigger one event');
			assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
			assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased the tokens');
			assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchases');
			return tokenSaleInstance.tokensSold();
		}).then(function(amount) {
			assert.equal(amount.toNumber(), numberOfTokens, 'increments the number of tokens sold');
			return tokenInstance.balanceOf(buyer);
		}).then(function(balance) {
			assert.equal(balance.toNumber(), numberOfTokens, 'buyer has the correct balance');
			return tokenInstance.balanceOf(tokenSaleInstance.address);
		}).then(function(balance) {
			assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens, 'seller has the correct balance');
			//try to buy tokens different from the ether value
			return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: 1 });
	    }).then(assert.fail).catch(function(error) {
	    	assert(error.message.indexOf('revert') >= 0, 'msg.value must equal number of tokens in wei');
			return tokenSaleInstance.buyTokens(800000, { from: buyer, value: 800000 * tokenPrice })
		}).then(assert.fail).catch(function(error) {
	    	assert(error.message.indexOf('revert') >= 0, 'cannot buy too many tokens');
		})
	})

	it('end token sale', function() {
		return MDPToken.deployed().then(function(instance) {
			tokenInstance = instance;
			return MDPTokenSale.deployed();
		}).then(function(instance) {
			tokenSaleInstance = instance;
			// try to end sale from account other than the admin
			return tokenSaleInstance.endSale({ from: buyer })
	    }).then(assert.fail).catch(function(error) {
	    	assert(error.message.indexOf('revert') >= 0, 'must be admin to end the sale');
			return tokenSaleInstance.endSale({ from: admin })
		}).then(function(receipt) {
			return tokenInstance.balanceOf(admin);
		}).then(function(balance) {
			assert.equal(balance.toNumber(), 999990, 'returns all unsold MPD tokens to admin');
		})
	})
})