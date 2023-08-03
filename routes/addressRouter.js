const {Router} = require("express");
const { addAddress,getUsersAddress,updateAddress,deleteAddress } = require("../controllers/addressController");

const addressRouter = Router();

addressRouter.post("/add",async(req,res) => {
    try {
        if(!req.isAuth) throw new Error("Unauthenticated");
        const data = await addAddress(req);
        res.send(data);
    } catch (error) {
        res.send({err: error.message})
    }
})

addressRouter.get("/usersAddr", async(req,res) => {
    try {
        if(!req.isAuth) throw new Error("Unauthenticated");
        const data = await getUsersAddress(req);
        res.send(data.map(e => e.value));
    } catch (error) {
        res.send({err: error.message})
    }
})

addressRouter.patch("/:addressId", async(req,res) => {
    try {
        if(!req.isAuth) throw new Error("Unauthenticated");
        const data = await updateAddress(req);
        res.send(data);
    } catch (error) {
        res.send({err: error.message})
    }
})
addressRouter.delete("/:addressId", async(req,res) => {
    try {
        if(!req.isAuth) throw new Error("Unauthenticated");
        const data = await deleteAddress(req);
        res.send(data);
    } catch (error) {
        res.send({err: error.message})
    }
})

module.exports = addressRouter;