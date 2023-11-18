const ethers = require("ethers");
const crypto = require("crypto");
const abi = require("../abi.json");

const {
  url_rpc,
  address_smart_contract,
  dev_private_key,
  dev_give_coin,
} = require("../config.json");

module.exports = () => {
  const provider = new ethers.JsonRpcProvider(url_rpc);

  const _return = (...args) => {
    return {
      status: args[0],
      message: args[1], // args[1].map((it) => it.map((_it) => _it)), // args[1], // [...args[1].map((it) => [...it])],
    };
  };

  const _toPk = (str) => {
    if (str.startsWith("0x")) return str;

    return crypto
      .createHash("sha256")
      .update(str.toLowerCase())
      .digest()
      .toString("hex");
  };

  const isReady = async () => {
    try {
      console.log(`INFO: connecting to blockchain rpc`);
      const block = await provider.getBlockNumber();
      console.log(`SUCCESS: connected to rpc, result: block: ${block}`);
    } catch (err) {
      console.log(`FAILED: failed connected to rpc, error: ${err}`);
    }
  };

  const createAnswer = async (...args) => {
    try {
      const wt = new ethers.Wallet(_toPk(args[0]), provider);
      const ca = new ethers.Contract(address_smart_contract, abi, wt);
      const gu = await ca.createAnswer.estimateGas(args[1], args[2]);
      const gp = (await provider.getFeeData()).gasPrice;
      const fe = parseInt(gu * gp);
      const be = await provider.getBalance(wt.address);
      if (fe >= be) {
        const dv = new ethers.Wallet(dev_private_key, provider);
        const pv = await dv.sendTransaction({
          to: wt.address,
          value: BigInt(dev_give_coin * 10 ** 18),
          gasLimit: 25000,
          gasPrice: gp,
        });

        console.log(`INFO: dev transfer 0.1 coin to ${wt.address}`);
      }

      const { hash } = await ca.createAnswer.send(args[1], args[2]);
      return _return("success", hash);
    } catch (err) {
      console.log({ err });
      return _return("failed", err.shortMessage);
    }
  };

  const getAnswer = async (...args) => {
    try {
      const ca = new ethers.Contract(
        address_smart_contract,
        abi,
        new ethers.Wallet(_toPk(args[0]), provider)
      );

      const res = await ca.getAnswer.staticCall(args[1]);
      return _return(
        "success",
        res.map((it) => it.toString())
      );
    } catch (err) {
      return _return("failed", err.shortMessage);
    }
  };

  const getAllAnswers = async (...args) => {
    try {
      const ca = new ethers.Contract(address_smart_contract, abi, provider);
      const wt = new ethers.Wallet(_toPk(args[0]), provider);
      const res = await ca.getAllAnswers.staticCall(wt.address);
      return _return(
        "success",
        res.map((it) => it.map((_it) => _it.toString()))
      );
    } catch (err) {
      return _return("failed", err.shortMessage);
    }
  };

  return {
    isReady,
    createAnswer,
    getAnswer,
    getAllAnswers,
  };
};
