import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
import Customer from '../models/Customer.js';


// Payment route
export const createPayment = async (req, res) => {
    const { amount, paymentMethodId, savePaymentMethod } = req.body;

    try {
        let customer;

        // Search for an existing customer
        const customers = await stripe.customers.list({
            email: req.user.email,
            limit: 1,
        });

        if (customers.data.length > 0) {
            // If the customer exists, use the existing one
            customer = customers.data[0];

            const customerDB = await Customer.findOne({ customerId: customer.id });
            if (!customerDB) {
                await Customer.create({
                    user: req.user.id,
                    customerId: customer.id,
                });
            }

        } else {
            // If no customer is found, create a new customer
            customer = await stripe.customers.create({
                email: req.user.email,
                metadata: {
                    userId: req.user.id.toString(),
                },
            });

            await Customer.create({
                user: req.user.id,
                customerId: customer.id,
            });
        }

        // Attach the payment method if required
        if (savePaymentMethod) {
            await stripe.paymentMethods.attach(paymentMethodId, {
                customer: customer.id,
            });
        }

        // Create a payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            confirm: true, // Confirm the payment immediately
            payment_method: paymentMethodId,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never', // Ensure no redirect-based methods are included
            },
            setup_future_usage: 'off_session',
            customer: customer.id,
            metadata: { userId: req.user.id.toString() }, // Correct metadata format
        });

        res.status(200).json(paymentIntent);
    } catch (error) {
        // console.log(error)
        res.status(500).json({ error: error.message });
    }
};



// Route to fetch customer payment methods
export const getPaymentMethod = async (req, res) => {
    try {
        // console.log('working', req.user.id.toString())

        const customer = await Customer.findOne({ user: req.user.id });
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }

        const paymentMethods = await stripe.paymentMethods.list({
            customer: customer.customerId,
            type: 'card', // Specify the type of payment method
        });

        res.status(200).json(paymentMethods);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getCustomer = async (req, res) => {
    // Search for a customer by metadata and email
    const customerDB = await Customer.findOne({ user: req.user.id });
    const customer = await stripe.customers.retrieve(customerDB.customerId);

    try {
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}