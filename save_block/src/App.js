import React,{ Component } from 'react';
import './App.css';
import Web3 from 'web3';
import FileData from "./abis/SaveFile.json";
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })
  
class App extends Component {
  
  async componentDidMount() { // lifecycle method in react
    console.log("running componentWillMount")
    await this.loadWeb3();
	  await this.loadBlockchainData();
  }  // call this function whenever the component mount to the DOM
  
  constructor(props) {
    super(props);
	  this.state = {
      currentFileName: null,
	    currentFileBuffer: null,
	    filesList: [],
      account: null,
      contract: null
	  };
  }
  
  async loadWeb3(){  
    console.log("loading web3");
    if(window.etherium){
	    window.web3 = new Web3(window.ethereum)  // create new instance
      await window.ethereum.enable()  // link to metamask
      console.log("Connected to ethereum") 
	  }
	  if(window.web3){
	    window.web3 = new Web3(window.web3.currentProvider)
      await window.ethereum.enable()  // link to metamask
      console.log("Connected to web3") 
	  }
	  else{
	    window.alert("Metamask not installed");
	  }
  }

  async loadBlockchainData(){
    console.log("Loading blockchain");
    const web3 = window.web3;
    console.log("Getting Accounts");
	  const accounts = await web3.eth.getAccounts();
	  this.setState({ account:accounts[0] });
	  const networkId = await web3.eth.net.getId();
	  const networkData = FileData.networks[networkId]
	  if(networkData){
      console.log("Netword data true")
	    const abi = FileData.abi;  // get contract ABI from local file 
	    const contractAddress = networkData.address;  // get contract address from local file
      // Get contract from network
      console.log("Searching Contract");
	    const contract = new web3.eth.Contract(abi,contractAddress);
	    this.setState({ contract:contract })
      // Call Contract function
      await this.readBlockchainData()
	  }
  	else{
	    alert("Smart Contract not deployed on this network");
  	}
  }
  
  async readBlockchainData(){
    console.log("getting data from contract") 
    const filesData = await this.state.contract.methods.getData().call();
    console.log("Contract data:",filesData)
    this.setState({ filesList:filesData })
  }

  processFile = (event) => {
    event.preventDefault();  // Prevent default Behaviour of button
	  console.log("File processing ....");	
  	const file = event.target.files[0];  // Read file 
	  const reader = new window.FileReader();  // Create a Buffer 
    reader.readAsArrayBuffer(file);  // Convert file to buffer 
	  reader.onloadend = () => {
      let today = new Date();
	    this.setState({ currentFileName: file.name+"_"+today.toISOString().split("T")[0] });
      this.setState({ currentFileBuffer: Buffer(reader.result) });
	    console.log('File processed : ',this.state.currentFileName);
	    console.log('buffer created');
  	}
  }

  uploadFile = async (event) => {
    event.preventDefault();
	  console.log("Submitting the form")
    // connect to IPFS 
    if(this.state.currentFileBuffer){
      console.log("check 1")  
      let ipfsResult = await ipfs.add(this.state.currentFileBuffer)
      console.log('IPFS result',ipfsResult);  // contain the Hash address
      // store file on blockchain 
      // URL: https://ipfs.infura.io/ipfs/<HASH>
      console.log("sending path to blockchain")
       this.state.contract.methods.addData(this.state.currentFileName,ipfsResult.path).send({from:this.state.account}).then( async (res) => {
        console.log("Blockchain updated")
        await this.readBlockchainData()
      });
    }
    console.log("Submition complete")
  }

  createFilesTable = () => {
    let table = [
      <div className="tableRow">
        <div className="tableItem tableHead">File Name</div>
        <div className="tableItem tableHead">Download Link</div>
      </div>
      ]
    console.log("files",this.state.filesList)
    console.log("creating files table")
    for(let file of this.state.filesList){
      table.push(
      <div className="tableRow">
        <div className="tableItem fileName">{file.fileName}</div>
        <div className="tableItem tableItem">
          <a className="downloadButtom" href={ "https://ipfs.infura.io/ipfs/"+file.fileHash } target="_blank" rel="noreferrer" download >
          Download File
          </a>
        </div>
      </div>
      );
    }
    return table
  }

  render(){return (
    <div>
      <nav className="navbar">
        <div className="headingName"> Save Block </div>
        <div className="activeAccount"> Account: {this.state.account} </div>
      </nav>
      <div className="bodyContainer">
        <div className="formContainer">
          <form onSubmit={this.uploadFile}>
            <input type="file" className="selectButton" onChange={this.processFile} />
            <input className="submitButton" type="submit" value="Send File" /> 
          </form>
        </div>
        <div className="filesTable">
          { this.createFilesTable() }
        </div>
      </div>
    </div>
  );
  }
}

export default App;
