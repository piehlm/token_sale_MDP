pragma solidity ^0.4.22;
import "./MDPToken.sol";

contract MDPTokenSale {
	address admin;
	MDPToken public tokenContract;
	uint256 public tokenPrice;

	constructor (MDPToken _tokenContract, uint256 _tokenPrice) public {
		admin = msg.sender;
		tokenContract = _tokenContract;
		tokenPrice = _tokenPrice;
	}
}