const Address = require("../model/addressModel");
const Users = require("../model/userModel");

const addAddress = async (req) => {
  const addressData = await Address.create(req.body);
  const addressId = addressData._id;
  const userUpdate = await Users.findOneAndUpdate(
    { _id: req.userId },
    {
      $push: {
        address: addressId,
      },
    },
    { new: true }
  );
  return addressData;
};

const getUsersAddress = async (req) => {
  const userData = await Users.findById(req.userId);
  const addressIds = userData.address;
  const addrPromise = addressIds.map((e) => Address.findById(e));
  return Promise.allSettled(addrPromise);
};

const updateAddress = async (req) => {
  return Address.findOneAndUpdate({ _id: req.params.addressId }, req.body, {
    new: true,
  });
};
const deleteAddress = async (req) => {
  return Address.findOneAndDelete({ _id: req.params.addressId });
};

module.exports = { addAddress, getUsersAddress, updateAddress,deleteAddress };
