pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract FileData {
    // variable to store data
	string [] filesName;
	string [] filesHash;
	uint index;
	
	// Write Function
	function addData(string memory _fileName, string memory _fileHash) public {
	  filesName.push(_fileName);
	  filesHash.push(_fileHash);
	}
	// Read Function
	function getData() public view returns(string [] memory,string [] memory){
	  return (filesName,filesHash);
	}
}