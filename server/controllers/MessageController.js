import Message from '../models/MessageModel';

export const addMessage = async (req, res) => {
    try {
        const { from, to, message } = req.body;
        const data = await Message.create({
            message: { text: message },
            users: [from, to],
            sender: from
        });
        if (data) return res.json({ msg: "Message added successfully" });
        return res.json({ msg: "Failed to add message to the database" });
    } catch (error) {
        console.log(error);
    }
};

export const getAllMessage = async (req, res) => {
    try {
        const { from, to } = req.body;
        const messages = await Message.find({
            users: {
                $all: [from, to],
            },
        }).sort({ updatedAt: 1 });
        const projectMessages = messages.map(msg => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,
            }
        });
        res.json(projectMessages);
    } catch (error) {
        console.log(error);
    }
};
