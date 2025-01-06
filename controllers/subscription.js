import Subscription from "../models/Subscription.js";

export const createSubscription = async (req, res) => {
    const { name, features, price, currency, billingCycle, recommended } = req.body;

    // Validate required fields
    if (!name || !features || !price) {
        return res.status(400).json({ message: "Name, features, and price are required" });
    }

    try {
        // Create a new subscription
        const newSubscription = new Subscription({
            name,
            features,
            price,
            currency,
            billingCycle,
            recommended,
        });

        // Save the subscription to the database
        await newSubscription.save();

        res.status(201).json({ message: "Subscription created successfully", subscription: newSubscription });
    } catch (error) {
        res.status(500).json({ message: "Error creating subscription", error });
    }
}

export const getSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find();
        res.status(200).json(subscriptions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching subscriptions", error });
    }
}

export const updateSubscription = async (req, res) => {
    const { id } = req.params;
    const { name, features, price, currency, billingCycle, recommended } = req.body;

    try {
        const updatedSubscription = await Subscription.findByIdAndUpdate(
            id,
            { name, features, price, currency, billingCycle, recommended },
            { new: true } // Return the updated document
        );

        if (!updatedSubscription) {
            return res.status(404).json({ message: "Subscription not found" });
        }

        res.status(200).json(updatedSubscription);
    } catch (error) {
        res.status(500).json({ message: "Error updating subscription", error });
    }
}    