import User from '../models/UserModel';
import bcrypt from 'bcrypt';
import { onlineUsers } from '../index';
export const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const usernameCheck = await User.findOne({ username });
        if (usernameCheck) return res.json({ msg: "Username already used", status: false });
        const emailCheck = await User.findOne({ email });
        if (emailCheck) return res.json({ msg: "Email already used", status: false });
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            username,
            password: hashedPassword
        });
        delete user.password;
        return res.json({ status: true, user });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.json({ msg: "Incorrect username or password", status: false });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.json({ msg: "Incorrect username or password", status: false });
        }
        delete user.password;
        return res.json({ status: true, user });
    } catch (error) {
        next(error);
    }
};

export const setAvatar = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage
        })
        return res.json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage
        })
    } catch (error) {
        console.log(error);
    }
};


export const getAllUser = async (req, res, next) => {
    try {
        let users = await User.find({ _id: { $ne: req.params.id } }).select([
            "email",
            "username",
            "avatarImage",
            "_id",
            "online"
        ]).lean();

        users = users.map(user => {
            const userId = user._id.toString();
            return onlineUsers.get(userId) ? { ...user, online: true } : { ...user, online: false }
        });
        return res.json(users);
    } catch (error) {
        console.log(error);
    }
};