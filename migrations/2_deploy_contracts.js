var MDPToken = artifacts.require("./MDPToken.sol");

module.exports = function(deployer) {
	deployer.deploy(MDPToken);
};