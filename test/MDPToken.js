var MDPToken = artifacts.require("./MDPToken.sol");

contract('MDPToken', function(accounts) {
	it('initializes the contract with the correct values', function() {
		return MDPToken.deployed().then(function(instance) {
			tokenInstance = instance;
			return tokenInstance.name();
		}).then(function(name) {
			assert.equal(name, 'MDP Token', 'has the correct name');
			return tokenInstance.symbol();
		}).then(function(symbol) {
			assert.equal(symbol, 'MDP', 'has the correct symbol');
			return tokenInstance.standard();
		}).then(function(standard) {
			assert.equal(standard, 'MDP Token v1.0', 'has the correct standard');
		});
	});

	it('allocates total supply upon deployment', function() {
		return MDPToken.deployed().then(function(instance) {
			tokenInstance = instance;
			return tokenInstance.totalSupply();
		}).then(function(totalSupply) {
			assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1,000,000');
			return tokenInstance.balanceOf(accounts[0]);
		}).then(function(adminBalance) {
			assert.equal(adminBalance.toNumber(), 1000000, 'it allocates the initial suppy to to the admin account');
		});
	});

	it('transfer token ownership', function() {
		return MDPToken.deployed().then(function(instance) {
			tokenInstance = instance;
			// test require statement by first transferring something larger than the senders balance
	    	return tokenInstance.transfer.call(accounts[1], 9999999);
	    }).then(assert.fail).catch(function(error) {
	    	assert(error.message.indexOf('revert') >= 0, 'error message must contain revert');
			return tokenInstance.transfer.call(accounts[1], 250000, { from: accounts[0]});
		}).then(function(success) {
			assert.equal(success,true, 'it returns true');
			return tokenInstance.transfer(accounts[1], 250000, { from: accounts[0]});
		}).then(function(receipt) {
			assert.equal(receipt.logs.length, 1, 'trigger one event');
			assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "transfer" event');
			assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens are transferred from');
			assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tokens are transferred to');
			assert.equal(receipt.logs[0].args._value, 250000, 'logs the transfer amount');
			return tokenInstance.balanceOf(accounts[1]);
		}).then(function(balance) {
			assert.equal(balance.toNumber(), 250000, 'add the amount to the receiving account');
			return tokenInstance.balanceOf(accounts[0]);
		}).then(function(balance) {
			assert.equal(balance.toNumber(), 750000, 'deducts the amount to the sending account');
		});
	});
})