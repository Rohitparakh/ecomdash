const mongoose= require("mongoose");

//Schema
const Schema= mongoose.Schema;
const orderSchema=new Schema({    
        id: String,
        reference: String,
        subtotal: String,
        tax: String,
        discount: String,
        total: String,
        date: String,
        customer: {
            id: Number,
            firstName: String,
            lastName: String,
            avatar: String,
            company: String,
            jobTitle: String,
            email: String,
            phone: String,
            invoiceAddress: {
                address: String,
                lat: Number,
                lng: Number
            },
            shippingAddress: {
                address: String,
                lat: Number,
                lng: Number
            }
        },
        products: [
            {
                id: Number,
                name: String,
                price: String,
                quantity: Number,
                total: String,
                image: String
            }
        ],
        status: [
            {
                id: Number,
                name: String,
                color: String,
                date: String
            }
        ],
        payment: {
            transactionId: String,
            amount: String,
            method: String,
            date: String
        },
        shippingDetails: [
            {
                tracking: String,
                carrier: String,
                weight: String,
                fee: String,
                date: String
            }
        ]
    
})

// Model
const order=mongoose.model('order',orderSchema)

module.exports = order;