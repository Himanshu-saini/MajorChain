pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract SaveFile {
    // variable to store data
    struct fileData{
        string fileName;
        string fileHash;
    }
	fileData [] filesList;
	
	// Write Function
	function addData(string memory _fileName, string memory _fileHash) public {
	  filesList.push(fileData(_fileName,_fileHash));
	}
	// Read Function
	function getData() public view returns(fileData [] memory){
	  return filesList;
	}
}