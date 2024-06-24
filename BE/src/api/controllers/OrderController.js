import orderModel from '../models/Order.js';
// import * as nodeFetch from "node-fetch";
import shell from "shelljs";


class OrderController {
    /**
     *
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    async fetchItems(req, res) {
        const { limit, offset, queryFilter, column, sort } = req.query;
        if (!req.user) {
            return res.status(401).json('Access deny');
        } else {
            // if (orderCommentId) {
            //     await orderModel.updateOrderByCommentId(orderCommentId, req.user.id);
            // }
            const data = await orderModel.fetchItems(1, limit, req.user, false, offset, queryFilter, column, sort);
            return res.status(200).json({ count: data.size, items: data.items ? data.items : [], itemsStatuses: data.grouppedStatuses});
        }
    }


    async fetchFilters (req, res) {
        if (!req.user) {
            return res.status(401).json('Access deny');
        } else {
            const { type } = req.query;
            const items = await orderModel.fetchFilters(req.user, type);
            return res.status(200).json({ items: items.res });
        }
    }

    async generateInvoice (req, res) {
        if (!req.user) {
            return res.status(401).json('Access deny');
        } else {
            console.log('GENERATE INVOICE PDF');
            // check if file exist, then return true
            const order = await orderModel.generatePdf(req.params.id, req.user.id, req.user, req.params.locale, "", req.params.type);
            return res.status(200).json({ fileName: order.filename, success: true, filebase64: order.fileEncoded });
        }
    }

    async updateProductConfigQty(req, res) {
        const { selectedConfigurationId, itemQty, liveSessionId } = req.body;
        if (!req.user) {
            return res.status(401).json('Access deny');
        } else {
            await orderModel.updateProductConfigQty(selectedConfigurationId, itemQty, liveSessionId);
            return res.status(200).json({ success:  true });
        }
    }

    async getProductConfigQty(req, res) {
        const { configId } = req.query;
        const data = await orderModel.getConfigQty(configId);

        return res.status(200).json({ success: true, qty: data.qty });
    }


    async removeWaitItemStatus(req, res) {
        const { itemId } = req.query;
        const data = await orderModel.removeItemWaitStatus(itemId);

        return res.status(200).json({ success: true });
    }

    async updateConfigQtyAfterWait(req, res) {
        const { configId, qty } = req.query;

        const data = await orderModel.updateConfigQty(configId, qty);

        return res.status(200).json({ success: true, qty: data.qty });
    }

    async updateWaitingOrder(req, res) {
        const { orderId } = req.query;
        console.log('Remove wait from order_items');
        const data = await orderModel.updateWaitWithOrderId(orderId);

        return res.status(200).json({ success: true });
    }

    async returnWrongParsedConfigured(req, res) {
        const { qty, configId } = req.query;
        const data = await orderModel.returnNotParsedConfigQty(qty, configId);
        return res.status(200).json({ success: true });

    }

    async updateWaitingItemQty(req, res) {
        const { itemId, qty, configId, orderId } = req.query;
        const data = await orderModel.updateWaitingItemQty(itemId, qty, configId, orderId);
        if (data.qty === 0) {
            return res.status(200).json({ success: true, orderNumber: data.orderNuber });
        } else {
            return res.status(200).json({ success: true, orderNumber: data.orderNuber });
        }
    }

    async waitingJobOrders(req, res) {
        const { configId } = req.query;
        const data = await orderModel.sendingMessageByWaiting(configId);

        return res.status(200).json({ success:  true, data: data });
        // if (!req.user) {
        //     return res.status(401).json('Access deny');
        // } else {
        //     const data = await orderModel.sendingMessageByWaiting(configId);
        //     return res.status(200).json({ success:  true, data: data });
        // }
    }

    async runWaitWorkflow(req, res) {
        const { sessionId, productConfigurationId } = req.body;
        if (!req.user) {
            return res.status(401).json('Access deny');
        } else {
            await orderModel.runWaitWorkflow(sessionId, productConfigurationId);
            return res.status(200).json({ success:  true });
        }
    }


    async fetchWaitingList (req, res) {
        const { limit, offset, queryFilter, column, sort } = req.query;
        if (!req.user) {
            return res.status(401).json('Access deny');
        } else {
            const data = await orderModel.fetchWaitingItems(1, limit, req.user, false, offset, queryFilter, column, sort);
            return res.status(200).json({ count: data.size, items: data.items});
        }
    }

    async createOrders (req, res) {
        await orderModel.createOrders(req.query.sessionId);
        // if (!data.error) {
        //     return res.status(200).json({success: true});
        // } else {
        //     return res.status(401).json({success: false, error: 'Something wend wrong'});
        // }
        return res.status(200).json({success: true, message: 'creating orders'});
    }

    async removeSessionsOrders (req, res) {
        const data = await orderModel.removeUnpayedSessionsOrders();
        return res.status(200).json({success: true});
    }

    async removeUnpayedOrder (req, res) {
        const data = await orderModel.removeUnpayedSessionOrder(req.query.sessionId);
        return res.status(200).json({success: true});
    }

    async checkOrderStatus (req, res) {
        const data = await orderModel.checkOrderStatus(req.query.comment_id);
        return res.status(200).json({success: true, data: data});
    }

    async fetchOrderByComment (req, res) {
        console.log("INCOMING QUERY COMMENT", req.query.commentId);
        console.log("INCOMING USER FB ID", req.query.userFbEmail);
        const data = await orderModel.checkOrderStatus(req.query.commentId, req.query.userFbEmail);
        // console.log("FETCHED DATA", data);
        // console.log("INCOMING USER", req.query.commentId);
        return res.status(200).json({success: true, data: data});
    }

    async getOrderQuantity(req, res) {
        const resQuery = await orderModel.getProductQty(req.query.product_id, req.query.product_configuration_id);
        const productQuant = resQuery.qty;
        return res.status(200).json({success: true, qty: productQuant});
    }

    async removeOrderItem(req, res) {
        await orderModel.removeOrderItem(req.query.orderItemId);
        // const productQuant = resQuery.qty;
        return res.status(200).json({success: true});
    }

    async minusOrderItem(req, res) {
        await orderModel.minusOrderItem(req.query.orderItemId);
        // const productQuant = resQuery.qty;
        return res.status(200).json({success: true});
    }

    async setupShipped (req, res) {
        if (!req.user) {
            return res.status(401).json('Access deny');
        } else {
            const ids = [];
            JSON.parse(req.body.data).filter(id => id.checked).forEach(data => ids.push(data.id));
            const data = await orderModel.setupShippingStatus(ids, req.user);
            return res.status(200).json({ data: data.success });
        }
    }


    async bulkCancel (req, res) {
        if (!req.user) {
            return res.status(401).json('Access deny');
        } else {
            const ids = [];
            JSON.parse(req.body.data).filter(id => id.checked).forEach(data => ids.push(data.id));
            const data = await orderModel.bulkCancel(ids, req.user);
            return res.status(200).json({ data: data.success });
        }
    }

    async bulkDownload (req, res) {
        console.log('Current locale', req.query.locale);
        if (!req.user) {
            return res.status(401).json('Access deny');
        } else {
            const ids = [];
            JSON.parse(req.body.data).filter(id => id.checked).forEach(data => ids.push(data.id));
            const data = await orderModel.bulkDownload(ids, req.user, req.query.locale ? req.query.locale : 'fr');
            return res.status(200).json({ data: data.success, achive: data.achive });
        }
    }

    async expireOrder (req, res) {
        if (req.user) {
            console.log('ORDER EXPIRE', req.query.orderId);
            const data = await orderModel.expireOrder(req.query.orderId, req.user.id);
            return res.status(200).json({ success: true });
        }
        return res.status(200).json({ success: true, orderNumber: null });
    }

    async findOrderByCommentId (req, res) {
        if (req.user) {
            const data = await orderModel.findByCommentId(req.query.commentId, req.user.id);
            return res.status(200).json({ success: true, orderNumber: data.orderNumber, storeName: data.storeName });
        }
        return res.status(200).json({ success: true, orderNumber: null, storeName: null });
    }

    async findWaitOrderByCommentId (req, res) {
        if (req.user) {
            console.log('getting wait order by comment');
            const data = await orderModel.findWaitByCommentId(req.query.commentId, req.user.id);
            console.log('here wa are', data);
            return res.status(200).json({ success: true, orderNumber: data.orderNumber });
        }
        return res.status(200).json({ success: true, orderNumber: null });
    }

    async compareFromOrder (req, res) {
        const data = await orderModel.connectThrowStore(req.query.messageId, req.query.fromId, req.query.storeId);
        // if (req.user) {
        //     console.log('fing user by comment and by from_id');
        //     const data = await orderModel.findWaitByCommentId(req.query.messageId, fromId);
        //     console.log('here wa are', data);
        //     return res.status(200).json({ success: true, orderNumber: data.orderNumber });
        // }
        // return res.status(200).json({ success: true, orderNumber: null });
    }

    async findWaitOrderById (req, res) {
        if (req.user) {
            console.log('getting wait order by id', req.query.orderId);
            const tmpWait = req.query.orderId?.split('_');
            let data;
            if (req.query.orderId?.hasOwnProperty('_')) {
                data = await orderModel.findWaitByCommentId(req.query.orderId, req.user.id);
            } else {
                console.log("here we are search by order id");
                data = await orderModel.findWaitById(req.query.orderId, req.user.id);
            }

            // const data = await orderModel.findWaitById(req.query.orderId, req.user.id);
            console.log('here wa are', data);
            return res.status(200).json({ success: true, orderNumber: data.orderNumber });
        }
        return res.status(200).json({ success: true, orderNumber: null });
    }


    async insertStatus (req, res) {
        if (req.user) {
            // await client.query(`INSERT INTO data.order_statuses (order_id, status) VALUES ('${orderRes.rows[0].id}', 'payed')`);

            const data = await orderModel.insertOrderStatus(req.query.orderId, req.query.status, req.query.locale);
            return res.status(200).json({ success: true, orderNumber: data.orderNumber });
        }
        return res.status(200).json({ success: true, orderNumber: null });
    }

    async openBrowser (req, res) {
        // shell.exec(`open -a Safari https://liveproshop.com/en/`, function(code, output) {
        //     console.log('Exit code:', code);
        //     console.log('Program output:', output);
        // });
        // if (req.user) {
        //     // await client.query(`INSERT INTO data.order_statuses (order_id, status) VALUES ('${orderRes.rows[0].id}', 'payed')`);
        //
        //     const data = await orderModel.insertOrderStatus(req.query.orderId, req.query.status);
        //     return res.status(200).json({ success: true, orderNumber: data.orderNumber });
        // }
        return res.status(200).json({ success: true, shellObject: shell });
    }
}

export default new OrderController();
