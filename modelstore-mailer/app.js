const amqp = require('amqplib/callback_api');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const database = require('./config/database');
const Order = require('./models/order');
const Product = require('./models/product');


// Create a transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

amqp.connect('amqp://rabbitmq', function (err, conn) {
    conn.createChannel(function (err, ch) {
        const queue = 'mailer';

        ch.assertQueue(queue, { durable: false });

        ch.consume(queue, async function (msg) {
            let data = JSON.parse(msg.content.toString());

            console.log(data);

            if (data.type == 'order') {
                // Get the order details
                let order = await Order.findById(data.orderId);

                if (order) {
                    data.links = [];
                    // Get the products model links
                    await Promise.all(order.products.map(async (product, index) => {
                        let productData = await Product.findById(product.id);
                        console.log(productData);
                        if (productData) {
                            data.links.push({
                                name: productData.name,
                                url: productData.models
                            });
                        };
                    }));

                    let productsList = data.links.map((product, index) =>
                        `<li>${index + 1}. <a href="${product.url}" style="text-decoration: none; color: #4b9ce2;">${product.name}</a></li>`
                    ).join('');

                    let mailOptions = {
                        from: 'modelstore0301@gmail.com',
                        to: data.email,
                        subject: 'Order Confirmation',
                        html: `
                    <div style="font-family: Arial, sans-serif;">
                        <h2 style="color: #4b9ce2;">Order Confirmation</h2>
                        <p>Thank you for your order. The 3D Models can be downloaded using the following links:</p>
                        <ul>
                            ${productsList}
                        </ul>
                    </div>`
                    };

                    transporter.sendMail(mailOptions, function (err, info) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('Message sent: ' + info.response);
                        }
                    });

                    // Update the order status
                    order.status = 'Delivered';
                    order.save();
                } else {
                    console.log('Order not found');
                }
            } else if (data.type == 'reset_password') {
                let mailOptions = {
                    from: 'modelstore0301@gmail.com',
                    to: data.email,
                    subject: 'Reset Password',
                    html: `
                        <div style="font-family: Arial, sans-serif; background-color: #f6f6f6; padding: 20px;">
                            <h2 style="color: #4b9ce2;">Reset Password</h2>
                            <p>Click the button below to reset your password.</p>
                            <a href="${process.env.URL}/api/reset/${data.token}" 
                                style="display: inline-block; padding: 10px 20px; color: white; background-color: #4b9ce2; 
                                       text-decoration: none; border-radius: 5px; margin-top: 10px;">Reset Password</a>
                            <p>If you did not request a password reset, please ignore this email or reply to let us know. This password reset is only valid for the next 30 minutes.</p>
                        </div>`
                };
                
                transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Message sent: ' + info.response);
                    }
                });
            }
        }, { noAck: true });
    });
});
