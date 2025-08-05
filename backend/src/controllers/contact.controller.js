export const sendContactMessage = (contactModel) => async (req, res, next) => {
    try {
        console.log("Client send messages via contact");
        
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            console.log("Tous les champs sont obligatoires");
            return res.status(400).json({ error: "Tous les champs sont obligatoires" });
        }

        await contactModel.saveMessage({ name, email, subject, message });

        console.log("Message enregistré");
        res.status(201).json({ msg: "Message enregistré" });
    } catch (error) {
        console.log("Error in Contact Message");
        next(error);
    }
};