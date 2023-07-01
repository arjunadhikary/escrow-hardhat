const { ethers } = require("hardhat");

const main = async () => {

    const [deployer, beneficiary, arbiter] = await ethers.getSigners();
    console.log(
        "Deploying contracts with the account:",
        deployer.address
    );

    console.log("Account balance:", (await deployer.getBalance()).toString());

    const Escrow = await ethers.getContractFactory("Escrow");
    const escrow = await Escrow.deploy(arbiter.address, beneficiary.address, {
        value: ethers.utils.parseEther('1')
    });
    console.log("Token address:", escrow.address);

}


main().then(dt => process.exit(0)).catch(err => {
    console.log(err);
    process.exit(1)
})