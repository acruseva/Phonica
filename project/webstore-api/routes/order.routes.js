const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const replaceId = require('./helpers').replaceId;
const error = require('./helpers').sendErrorResponse;
const util = require('util');
const indicative = require('indicative');
const verifyToken = require('./verify-token');
const verifyRoleOrSelf = require('./verify-role');

router.get('/', verifyToken, function (req, res) {
    const db = req.app.locals.db;
    console.log(req.userId);
    db.collection('orders').find({userId: req.userId}).toArray(
        function (err, orders) {
            if (err) throw err;
            orders.forEach( (order) => replaceId(order) );
            res.json({ data: orders });
        }
    );
});

router.get('/all', verifyToken, verifyRoleOrSelf(3, false), function (req, res) {
    const db = req.app.locals.db;
    console.log(req.userId);
    db.collection('orders').find().toArray(
        function (err, orders) {
            if (err) throw err;
            orders.forEach( (order) => replaceId(order) );
            res.json({ data: orders });
        }
    );
});

router.get('/all/:orderId', verifyToken, verifyRoleOrSelf(3, false), function (req, res) {
    const db = req.app.locals.db;
    const params = req.params;
    indicative.validate(params, { orderId: 'required|regex:^[0-9a-f]{24}$' })
        .then(() => {
            db.collection('orders', function (err, orders_collection) {
                if (err) throw err;
                orders_collection.findOne({ _id: new mongodb.ObjectID(params.orderId)},
                    (err, order) => {
                        if (err) throw err;
                        if (order === null) {
                            error(req, res, 404, `order with Id=${params.orderId} not found.`, err);
                        } else {
                            replaceId(order);
                            res.json(order);
                        }

                    });
            });
        }).catch(errors => {
            error(req, res, 400, 'Invalid order ID: ' + util.inspect(errors))
        });
});

router.get('/:orderId', verifyToken, function (req, res) {
    const db = req.app.locals.db;
    const params = req.params;
    indicative.validate(params, { orderId: 'required|regex:^[0-9a-f]{24}$' })
        .then(() => {
            db.collection('orders', function (err, orders_collection) {
                if (err) throw err;
                orders_collection.findOne({ _id: new mongodb.ObjectID(params.orderId), userId: req.userId},
                    (err, order) => {
                        if (err) throw err;
                        if (order === null) {
                            error(req, res, 404, `order with Id=${params.orderId} not found.`, err);
                        } else {
                            replaceId(order);
                            res.json(order);
                        }

                    });
            });
        }).catch(errors => {
            error(req, res, 400, 'Invalid order ID: ' + util.inspect(errors))
        });
});

router.post('/', verifyToken, function (req, res) {
    const db = req.app.locals.db;
    const order = req.body;
    console.log(req);
    indicative.validate(order, {
      name: 'required|string|min:3|max:40',
      phone: 'required|string|min:3|max:20',
      address: 'required|string|min:3|max:255',
      city: 'required|string|min:3|max:30',
      postCode: 'required|string|min:3|max:30',
      country: 'required|string|min:3|max:30',
      totalPrice: 'required',
      userId: 'regex:^[0-9a-fA-F]{24}$'
    }).then(() => {
        const collection = db.collection('orders');
        console.log('Inserting order:', order);
        collection.insertOne(order).then((result) => {
            if (result.result.ok && result.insertedCount === 1) {
                replaceId(order);
                const uri = req.baseUrl + '/' + order.id;
                console.log('Created Order: ', uri);
                res.location(uri).status(201).json(order);
            } else {
                error(req, res, 400, `Error creating new order: ${order}`);
            }
        }).catch((err) => {
            error(req, res, 500, `Server error: ${err}`, err);
        })
    }).catch(errors => {
        error(req, res, 400, `Invalid order data: ${util.inspect(errors)}`);
    });
});


module.exports = router;