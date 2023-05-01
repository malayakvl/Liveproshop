import passport from '../middleware/passport.js';
import userModel from '../models/User.js';
import invitationModel from '../models/Invitation.js'
import countryModel from '../models/Country.js';
import { getTokensAndSetCookies } from '../lib/token.js';
import { sendMail } from '../lib/sendMail.js';
import { welcomeEmail, restoreEmail, registerEmail } from '../sender/templates.js';


class AuthController {
    /**
     * Login user via email and password
     * @param req
     * @param res
     * @param next
     */
    authLogin(req, res, next) {
        passport.authenticate('local', { session: false },
            (err, authUser, info) => {
                if (err) {
                    return res.status(500).json({ code: 500, message: err.message });
                }
                if (!authUser) {
                    return res.status(400).json({ code: 400, message: info.message });
                }
                req.login(authUser, { session: false }, (err) => {
                    if (err) {
                        res.send(err);
                    }
                    getTokensAndSetCookies(req, res, authUser.id, authUser.email);

                    res.status(200).json({ user: authUser });
                });
            }
        )(req, res, next);
    }

    authSellerLogin(req, res, next) {
        const { seller_email } = req.body;
        passport.authenticate('custom', { session: false },
            (err, authUser, info) => {
                if (err) {
                    return res.status(500).json({ code: 500, message: err.message });
                }
                if (!authUser) {
                    return res.status(400).json({ code: 400, message: info.message });
                }
                req.login(authUser, { session: false }, async (err) => {
                    if (err) {
                        res.send(err);
                    }
                    const sellerUser = await userModel.findUserByEmail(seller_email);
                    if (sellerUser) {
                        getTokensAndSetCookies(req, res, sellerUser.id, sellerUser.email);
                        res.status(200).json({ user: sellerUser });
                    } else {
                        getTokensAndSetCookies(req, res, authUser.id, authUser.email);

                        res.status(200).json({ user: authUser });
                    }
                });
            }
        )(req, res, next);
    }

    /**
     * Login/Create account via providers
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    async authProvider(req, res) {
        const { user, error } = await userModel.provider(req.body);
        if (error) {
            return res.status(error.code).json(error);
        }
        res.status(200).json({ user: user });
    }

    async authProviderLogin(req, res) {
        const { user, error } = await userModel.providerLogin(req.body);
        if (error) {
            return res.status(error.code).json(error);
        }
        res.status(200).json({ user: user });
    }

    async authSubscriptionLogin(req, res) {
        const user = await userModel.findUserByEmail(req.body.seller_email);
        if (!user) {
            return res.status(400).json('Not found user');
        }
        res.status(200).json({ user: user });
    }

    /**
     * Register new user via form data
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    async authRegister(req, res) {
        let formData = req.body;
        let email = formData.email

        let invitation = await invitationModel.findByEmail(email);

        if (!invitation) {
            return res.status(403).json({ message: "You don't have invitation" });

        }

        if (!invitation.active) {
            return res.status(403).json({ message: "Your invitation isn't active" });
        }

        const _user = await userModel.findUserByEmail(email);

        if (_user) {
            return res.status(403).json({ user: null, error: 'Email present' });

        }

        const { country_id, state, city, post_code, address_line_1, address_line_2, address_type } = formData;

        const countryName = (await countryModel.findById(country_id))?.nicename;

        const createUserData = {
            email,
            password: formData.password,
            role_id: invitation.role_id,
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone: formData.phone,
            full_address: [address_line_1, address_line_2, city, state, post_code, countryName].filter(Boolean).join(', '),
            company_name: formData.company_name,
            identification_number: formData.identification_number,
            vat: formData.vat
        }

        const { user, error } = await userModel.create(createUserData);
        // create trial subscription
        // const userData = {
        //     planId: 1,
        //     type: 'trial',
        //     user: {
        //         email: email,
        //         first_name: formData.first_name,
        //         last_name: formData.last_name
        //     }
        // }
        // await userModel.createExistUserSubscription(userData, user);

        if (error) {
            return res.status(error.code).json(error);
        }


        const createAddressData = {
            country_id,
            state,
            city,
            post_code,
            address_line_1,
            address_line_2,
            address_type
        }

        const { error: errorAddress } = await userModel.saveAddress(user.id, createAddressData);

        if (errorAddress) {
            return res.status(errorAddress.code).json(errorAddress);

        }


        invitationModel.deactivate(invitation.id)

        const mail = await registerEmail(user.email, req.query.locale);

        sendMail(
            user.email,
            mail.subject,
            mail.body
        );

        // sendMail(
        //     user.email,
        //     'Proshop',
        //     `Your email was successfully verified!`
        // );

        return res.status(200).json({ user })

    }

    async authInvite(req, res) {
        const data = req.body;
        const user = await userModel.findUserByEmail(data.email);

        if (user) {
            return res.status(403).json({ message: 'Email present' });

        }

        let invitation = await invitationModel.findByEmail(data.email);

        if (invitation) {
            await invitationModel.delete(invitation.id)

        }

        invitation = await invitationModel.create(data);

        let link = `${process.env.APPLICATION_BASE_URL}/auth/registration?hash=${invitation.hash}`;

        const mail = await welcomeEmail(data.email, link, req.query.locale);

        sendMail(
            data.email,
            mail.subject,
            mail.body
        );

        // sendMail(
        //     data.email,
        //     'Proshop',
        //     `
        //     Welcome at Proshop, (${data.email})! \n
        //     Here’s the verification link - <a href='${link}'>${link}</a> \n
        //     Please, complete the registration via this link \n
        //     Regards, Proshop Team
        //     `
        // );

        return res.status(200).json({ status: 'success' });
    }


    async restorePassword(req, res) {
        const data = req.body;

        const user = await userModel.findUserByEmail(data.email);

        if (!user) return res.status(402).json({ status: false, error: 'wrong email' });

        let invitation = await invitationModel.findByEmail(data.email);

        if (invitation) {
            await invitationModel.delete(invitation.id)
        }

        invitation = await invitationModel.create(user);

        const link = `${process.env.APPLICATION_BASE_URL}/auth/restore/password?hash=${invitation.hash}`;

        const mail = await restoreEmail(data.email, link, req.query.locale);

        sendMail(
            data.email,
            mail.subject,
            mail.body
        );

        res.status(200).json({ status: true });
    }

    async changePassword(req, res) {
        let { hash, password, password_confirmation } = req.body;

        let invitation = await invitationModel.findByHash(hash);

        if (!invitation) {
            return res.status(403).json({ success: false, message: "You don't have invitation" });
        }

        if (!invitation.active) {
            return res.status(403).json({ success: false, message: "Your invitation isn't active" });
        }

        const user = await userModel.findUserByEmail(invitation.email);

        if (password !== password_confirmation) {
            return res.status(200).json({success: false, message: 'Passwords do not match'});
        }

        const { success = false, error } = await userModel.changePassword(user, { password });

        if (error) {
            return res.status(error.code).json({success, message: error.message});
        }

        invitationModel.deactivate(invitation.id);

        return res.status(200).json({ success });
    }

    async activateHash(req, res) {
        const user = await userModel.activateByHash(req.params.hash);
        if (user) {
            res.status(200).json({ user: user });
        } else {
            res.status(402).json({ user: null, error: 'No user or token expired' });
        }
    }

    async getInvitation(req, res) {
        if (!req.params) {
            return res.status(404).json({})

        }

        if (!req.params.hash) {
            return res.status(404).json({})

        }

        let hash = await invitationModel.findByHash(req.params.hash)

        if (hash && hash.active) {
            return res.status(200).json(hash);

        }

        return res.status(404).json({})
    }
}

export default new AuthController();
