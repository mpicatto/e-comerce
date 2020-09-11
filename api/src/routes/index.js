const { Router } = require('express');
// import all routers;
const productRouter = require('./product.js');
const categoryRouter = require('./category.js');
const catProRouter = require("./CategoryProducts");
const userRouter = require("./user");
const ordersRouter = require("./Orders");
const adminRouter = require('./admin')
//const loginRouter = require("./login.js");

const router = Router();

// load each router on a route
// i.e: router.use('/auth', authRouter);
// router.use('/auth', authRouter);
router.use('/products', productRouter);
router.use('/categories', categoryRouter)
router.use("/categoryProducts", catProRouter)
router.use('/users',userRouter)
router.use('/orders',ordersRouter)
router.use('/admin', adminRouter)
//router.use('/login',loginRouter)

module.exports = router;
