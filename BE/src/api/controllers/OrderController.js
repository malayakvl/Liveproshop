import orderModel from '../models/Order.js';

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
            const items = await orderModel.fetchFilters(req.user);
            return res.status(200).json({ items: items.res });
        }
    }

    async generateInvoice (req, res) {
        if (!req.user) {
            return res.status(401).json('Access deny');
        } else {
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

    async updateWaitingOrder(req, res) {
        const { orderId } = req.query;
        const data = await orderModel.updateWaitWithOrderId(orderId);

        return res.status(200).json({ success: true });
    }

    async updateWaitingItemQty(req, res) {
        const { itemId, qty, configId, orderId } = req.query;
        const data = await orderModel.updateWaitingItemQty(itemId, qty, configId, orderId);
        console.log("WAIT DATA", data);

        return res.status(200).json({ success: true, orderNumber: data.orderNuber });
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

    async checkOrderStatus (req, res) {
        const data = await orderModel.checkOrderStatus(req.query.comment_id);
        return res.status(200).json({success: true, data: data});
    }

    async fetchOrderByComment (req, res) {
        // const data = await orderModel.checkOrderStatus(req.query.comment_id);
        return res.status(200).json({success: true});
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
        if (!req.user) {
            return res.status(401).json('Access deny');
        } else {
            const ids = [];
            JSON.parse(req.body.data).filter(id => id.checked).forEach(data => ids.push(data.id));
            const data = await orderModel.bulkDownload(ids, req.user);
            return res.status(200).json({ data: data.success, achive: data.achive });
        }
    }

    async findOrderByCommentId (req, res) {
        if (req.user) {
            const data = await orderModel.findByCommentId(req.query.commentId, req.user.id);
            return res.status(200).json({ success: true, orderNumber: data.orderNumber });
        }
        return res.status(200).json({ success: true, orderNumber: null });
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

    async findWaitOrderById (req, res) {
        if (req.user) {
            console.log('getting wait order by id');
            const data = await orderModel.findWaitById(req.query.orderId, req.user.id);
            console.log('here wa are', data);
            return res.status(200).json({ success: true, orderNumber: data.orderNumber });
        }
        return res.status(200).json({ success: true, orderNumber: null });
    }


    async insertStatus (req, res) {
        if (req.user) {
            // await client.query(`INSERT INTO data.order_statuses (order_id, status) VALUES ('${orderRes.rows[0].id}', 'payed')`);

            const data = await orderModel.insertOrderStatus(req.query.orderId, req.query.status);
            return res.status(200).json({ success: true, orderNumber: data.orderNumber });
        }
        return res.status(200).json({ success: true, orderNumber: null });
    }
}

export default new OrderController();
