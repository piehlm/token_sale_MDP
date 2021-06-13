var MDPToken = artifacts.require("./MDPToken.sol");
var MDPTokenSale = artifacts.require("./MDPTokenSale.sol");

module.exports = function(deployer) {
	deployer.deploy(MDPToken, 1000000).then(function() {
		var tokenPrice = 100000000000000;
		return deployer.deploy(MDPTokenSale, MDPToken.address, tokenPrice);
	});
	
};