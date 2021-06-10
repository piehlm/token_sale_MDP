pragma solidity ^0.4.22;

contract MDPToken {
	//constructor
	//set total number of token
	//read total number of tokens
	uint256 public totalSupply;

	function MDPToken () public {
		totalSupply = 1000000;
	}
}