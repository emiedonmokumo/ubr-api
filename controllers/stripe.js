import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


// Payment route
export const createPayment = async (req, res) => {
    const { amount, paymentMethodId, savePaymentMethod } = req.body;

    try {

        if (savePaymentMethod && req.user.id) {
            const customer = await stripe.customers.create({
                email: req.user.email,
                metadata: {
                    userId: req.user.id.toString(),
                },
            });

            
            await stripe.paymentMethods.attach(paymentMethodId, {
                customer: req.user.id.toString(),
            });
        }

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
            metadata: {
                userId: req.user.id.toString(),
            },
        });

        res.status(200).json({ success: true, paymentIntent });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, error: error.message });
    }
};


// Route to fetch customer payment methods
export const getPaymentMethod = async (req, res) => {
    try {
        console.log('working', req.user.id.toString())
        const paymentMethods = await stripe.paymentMethods.list({
            type: 'card', // Specify the type of payment method
        });

        res.status(200).json({ success: true, paymentMethods });
    } catch (error) {
        console.error('Error fetching payment methods:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
