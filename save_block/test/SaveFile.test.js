const SaveFile = artifact.require("SaveFile")
require('chai')
.use(require('chai-as-promised')
.should()

contract('SaveFile',(accounts) => {
let file;
before( () => {
    file = await SaveFile.deployed();
});

describe('deployment',async () => {
    it('deploys successfully', async () => {
    const addr = file.address;
    assert.notEqual(addr,0x0);
    assert.notEqual(addr,'');
    assert.notEqual(addr,null);
    assert.notEqual(addr,undefined);
    });
});
describe('Storage',async () => {
    it('Write file successfull', async () => {
        let fileName = "File1"
        let fileHash = "Hash1";
        await file.addData(fileName,fileHash);
        const result = await file.getData();
        let res1,res2;
        for(let fileData of result){
            res1 = fileData.fileName
            res2 = fileData.fileHash
        }
        assert.equal(res1,fileName);
        assert.equal(res2,fileHash);
    });
  });
})