const SaveFile = artifacts.require("SaveFile");

module.exports = function(deployer) {
  deployer.deploy(SaveFile);
};
