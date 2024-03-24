import userModel from '../models/User.js';
import countryModel from '../models/Country.js';
import paymentPlanModel from '../models/PaymentPlan.js';
import multer from 'multer';
import fs from 'fs';
import unzipper from 'unzipper';
import { trialSubscriptionEmail, unsubscriberFromEmail } from "../sender/templates.js";
import { sendMail } from "../lib/sendMail.js";
import pool from "../models/connect.js";
// import * as decompress from 'decompress'
class UserController {

    async generateInvoice (req, res) {
        if (!req.user) {
            return res.status(401).json('Access deny');
        }
        const invoice = await userModel.generatePdf(req.user);
        if (invoice.success) {
            return res.status(200).json(invoice);
        }
    }

    async getProfile(req, res) {
        const user = req.user;

        if (!user) {
            return res.status(401).json({});
        }


        if (!user.identification_number) {
            user.identification_number = '';
        }
        if (!user.vat) {
            user.vat = '';
        }
        if (!user.phone) {
            user.phone = '';
        }
        if (!user.first_name) {
            user.first_name = '';
        }
        if (!user.last_name) {
            user.last_name = '';
        }
        if (!user.company_name) {
            user.company_name = '';
        }
        if (!user.email_real) {
            user.email_real = user.email;
        }

        delete user.salt;
        delete user.password;
        delete user.hash;
        delete user.expired_at;

        let response = {
            ...user,
            address: {},
            user: user
        }

        const address = await userModel.findUserAddress(req.user.id);
        if (!address.address_type) {
            address.address_type = 'home address';
        }
        if (address) {
            const country = await countryModel.findById(address.country_id)

            response.address = {
                ...address,
                country
            }
        }

        return res.status(200).json(response);
    }

    async fetchSettings (req, res) {
        if (!req.user) {
            return res.status(401).json('Access deny');
        }
        const data = await userModel.fetchUserSettings(req.user.id);
        return res.status(200).json({ item: data[0]});
    }

    async updateSettings (req, res) {
        if (!req.user) {
            return res.status(401).json('Access deny');
        }
        const data = await userModel.updateSellerSettings(req.user.id, req.body);
        return res.status(200).json({ success: data.success });
    }

    async updateLinksSettings (req, res) {
        if (!req.user) {
            return res.status(401).json('Access deny');
        }
        const data = await userModel.updateSellerLinkSettings(req.user.id, req.body);
        return res.status(200).json({ success: data.success });
    }

    async removeFilesSettings(req, res) {
        if (!req.user) {
            return res.status(401).json('Access deny');
        }
        const { type, tmpfile, ext } = req.query;
        await userModel.removeSettingsFile(type, tmpfile, ext, req.user.id);
        const data = await userModel.fetchUserSettings(req.user.id);
        return res.status(200).json({ item: data[0]});
    }

    processFileData(fileData) {
        fs.writeFile(`${process.env.DOWNLOAD_FOLDER}/users/${req.user.id}/documents/tmp/output.txt`, fileData, (err) => {
            if (err) {
                console.error('Error writing file:', err);
            } else {
                console.log('File written successfully');
            }
        });
    }



    async processPDF(pdfFilePath, res) {
        try {
            // Parse the PDF content
            const pdfBuffer = fs.readFileSync(pdfFilePath);
            const data = await PDFParser(pdfBuffer);
            const pdfText = data.text;

            // Define the words to search and their initial count
            const technologies = ['Node.js', 'React.js', 'Angular', 'Vue.js', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Sass', 'Bootstrap', 'jQuery', 'Python', 'Java', 'Ruby', 'Go', 'PHP', 'Swift', 'Kotlin', 'Rust', 'SQL', 'MongoDB', 'Firebase', 'AWS', 'Azure', 'Docker', 'Kubernetes', 'Git', 'GitHub', 'Jenkins', 'CI/CD', 'REST API', 'GraphQL', 'OAuth', 'JSON', 'XML', 'Microservices', 'Artificial Intelligence', 'Machine Learning', 'Data Science', 'Big Data', 'Blockchain'];
            let wordCounts = {};

            // Count the occurrences of each search word
            technologies.forEach((word) => {
                const regex = new RegExp(word, 'gi');
                const count = (pdfText.match(regex) || []).length;
                wordCounts[word] = count;
            });

            // Return the word counts as the response
            wordCounts = Object.fromEntries(Object.entries(wordCounts).filter(([key, value]) => value !== 0));
            res.json({ wordCounts });
        } catch (error) {
            console.error('An error occurred while processing the PDF:', error);
            res.status(500).json({ error: 'Failed to process the PDF' });
        } finally {
            // Clean up - delete the uploaded file and PDF file if needed
        }
    }

    async updateFilesSettings (req, res) {
        if (!req.user) {
            return res.status(401).json('Access deny');
        }
        const type = req.query.typedoc;
        const dirUpload = `${process.env.DOWNLOAD_FOLDER}/users/${req.user.id}/documents/tmp`;
        if (!fs.existsSync(dirUpload)) {
            fs.mkdirSync(dirUpload);
        }
        let tmpFileName;

        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, `${dirUpload}`);
            },
            filename: function (req, file, cb) {
                cb(null, type+'.'+file.originalname.substr(file.originalname.lastIndexOf('.') + 1));
            }
        });
        const upload = multer({ storage: storage });


        if (req.query.typedoc === 'policy') {
            const uploadPolicy = multer({storage: storage}).any('policy');
            const resUpl = await uploadPolicy(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    return res.status(500).json(err);
                } else if (err) {
                    return res.status(500).json(err);
                }
                if (req.files.length > 0) {
                    req.files.forEach(async file => {
                        // console.log(file)
                        if (file.fieldname === 'policy') {

                        }
                    });
                }

                // WORK WITH ZIP
                // const zip = fs.createReadStream(`${process.env.DOWNLOAD_FOLDER}/users/${req.user.id}/documents/tmp/policy.zip`).pipe(unzipper.Parse({forceStream: true}));
                // for await (const entry of zip) {
                //     const fileName = entry.path;
                //     const type = entry.type; // 'Directory' or 'File'
                //     const size = entry.vars.uncompressedSize; // There is also compressedSize;
                //     // entry.pipe(fs.createWriteStream(`${process.env.DOWNLOAD_FOLDER}/users/${req.user.id}/documents/tmp/`));
                //     if (fileName === "policy.pdf") {
                //         console.log("FILENAME", fileName)
                //         entry.pipe(fs.createWriteStream(`${process.env.DOWNLOAD_FOLDER}/users/${req.user.id}/documents/tmp/policy.pdf`));
                //     } else {
                //         entry.autodrain();
                //     }
                // }
                return true;
            });
        }
        if (req.query.typedoc === 'terms') {
            const uploadTerms = multer({storage: storage}).any('terms');
            const resUpl = await uploadTerms(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    return res.status(500).json(err);
                } else if (err) {
                    return res.status(500).json(err);
                }
                return true;
            });
        }
        if (req.query.typedoc === 'delivery') {
            const uploadDelivery = multer({storage: storage, limits: { fileSize: '100000000' /* bytes */ }}).any('delivery');
            const resUpl = await uploadDelivery(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    return res.status(500).json(err);
                } else if (err) {
                    return res.status(500).json(err);
                }
                return true;
            });
        }
        if (req.query.typedoc === 'return') {
            const uploadReturn = multer({storage: storage, limits: { fileSize: '100000000' /* bytes */ }}).any('return');
            const resUpl = await uploadReturn(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    return res.status(500).json(err);
                } else if (err) {
                    return res.status(500).json(err);
                }
                return true;
            });
        }



        // await userModel.uploadSettingsNewDoc(docsPolicy, req.user.id, 'policy', 'tmp');


        // if (req.query.typedoc === 'delivery') {
        //     const uploadTerms = multer({storage: storage}).any('delivery');
        //     await uploadTerms(req, res, async function (err) {
        //         console.log('55555', req.files);
        //         if (err instanceof multer.MulterError) {
        //             return res.status(500).json(err);
        //         } else if (err) {
        //             return res.status(500).json(err);
        //         }
        //         let docsDelivery = '';
        //         if (req.files.length > 0) {
        //             req.files.forEach(file => {
        //                 if (file.fieldname === 'delivery') {
        //                     docsDelivery = file.filename;
        //                 }
        //             });
        //             await userModel.uploadSettingsNewDoc(docsDelivery, req.user.id, 'delivery', 'tmp');
        //         }
        //
        //         return;
        //     });
        // }
        // if (req.query.typedoc === 'terms') {
        //     const uploadTerms = multer({storage: storage}).any('terms');
        //     await uploadTerms(req, res, async function (err) {
        //         console.log('55555', req.files);
        //         if (err instanceof multer.MulterError) {
        //             return res.status(500).json(err);
        //         } else if (err) {
        //             return res.status(500).json(err);
        //         }
        //         let docsPolicy = '';
        //         if (req.files.length > 0) {
        //             req.files.forEach(file => {
        //                 if (file.fieldname === 'terms') {
        //                     docsPolicy = file.filename;
        //
        //                 }
        //             });
        //             await userModel.uploadSettingsNewDoc(docsPolicy, req.user.id, 'terms', 'tmp');
        //         }
        //
        //         return;
        //     });
        // }
        // if (req.query.typedoc === 'return') {
        //     const uploadReturn = multer({storage: storage}).any('return');
        //     await uploadReturn(req, res, async function (err) {
        //         console.log('55555', req.files);
        //         if (err instanceof multer.MulterError) {
        //             return res.status(500).json(err);
        //         } else if (err) {
        //             return res.status(500).json(err);
        //         }
        //         let returnPolicy = '';
        //         if (req.files.length > 0) {
        //             req.files.forEach(file => {
        //                 if (file.fieldname === 'returnPolicy') {
        //                     returnPolicy = file.filename;
        //
        //                 }
        //             });
        //             await userModel.uploadSettingsNewDoc(returnPolicy, req.user.id, 'return', 'tmp');
        //         }
        //
        //         return;
        //     });
        // }


        // if (req.query.typedoc === 'terms') {
        //     const uploadPolicy = multer({storage: storage}).any('policy');
        //     await uploadPolicy(req, res, async function (err) {
        //         if (err instanceof multer.MulterError) {
        //             return res.status(500).json(err);
        //         } else if (err) {
        //             return res.status(500).json(err);
        //         }
        //         // const dataProduct = req.body;
        //         let docsPolicy = '';
        //         if (req.files.length > 0) {
        //             req.files.forEach(file => {
        //                 console.log(file)
        //                 if (file.fieldname === 'policy') {
        //                     docsPolicy = file.filename;
        //
        //                 }
        //             });
        //             await userModel.uploadSettingsNewDoc(docsPolicy, req.user.id, 'policy', 'tmp');
        //         }
        //
        //         return;
        //     });
        // }


        // const uploadPolicy = multer({ storage: storage }).any('policy');

        // const uploadTerms = multer({ storage: storage }).any('terms');
        // const uploadDelivery = multer({ storage: storage }).any('delivery');
        // const uploadReturn = multer({ storage: storage }).any('return');
        //
        //
        //
        // await uploadTerms(req, res, async function (err) {
        //     if (err instanceof multer.MulterError) {
        //         return res.status(500).json(err);
        //     } else if (err) {
        //         return res.status(500).json(err);
        //     }
        //     // const dataProduct = req.body;
        //     const docsTerms = [];
        //     if (req.files.length > 0) {
        //         req.files.forEach(file => {
        //             if (file.fieldname === 'terms' && file?.size) {
        //                 docsTerms[0] = file.filename;
        //             }
        //
        //         });
        //         await userModel.uploadSettingsDoc(docsTerms, req.user.id, 'terms', 'tmp');
        //     }
        //     return;
        // });
        //
        // await uploadDelivery(req, res, async function (err) {
        //     if (err instanceof multer.MulterError) {
        //         return res.status(500).json(err);
        //     } else if (err) {
        //         return res.status(500).json(err);
        //     }
        //     // const dataProduct = req.body;
        //     const docsDelivery = [];
        //     if (req.files.length > 0) {
        //         req.files.forEach(file => {
        //             if (file.fieldname === 'delivery' && file?.size) {
        //                 docsDelivery[0] = file.filename;
        //             }
        //
        //         });
        //         await userModel.uploadSettingsDoc(docsDelivery, req.user.id, 'delivery', 'tmp');
        //     }
        //     return;
        // });
        //
        // await uploadReturn(req, res, async function (err) {
        //
        //     if (err instanceof multer.MulterError) {
        //         return res.status(500).json(err);
        //     } else if (err) {
        //         return res.status(500).json(err);
        //     }
        //     // const dataProduct = req.body;
        //     const docsReturn = [];
        //     if (req.files.length > 0) {
        //         req.files.forEach(file => {
        //             console.log(file);
        //             if (file.fieldname === 'returnPolicy' && file?.size) {
        //                 docsReturn[0] = file.filename;
        //             }
        //
        //         });
        //         await userModel.uploadSettingsDoc(docsReturn, req.user.id, 'return', 'tmp');
        //     }
        //     return;
        // });

        // const data = await userModel.updateSellerLinkSettings(req.user.id, req.body);
        return res.status(200).json({ success: true });
    }

    async fetchSellers (req, res) {
        if (!req.user) {
            return res.status(401).json('Access deny');
        }
        const data = await userModel.findUsersSuggestion(req.query.searchStr, 2);
        return res.status(200).json({ result: data});
    }

    async fetchBuyers (req, res) {
        if (!req.user) {
            return res.status(401).json('Access deny');
        }
        const data = await userModel.findUsersSuggestion(req.query.searchStr, 1);
        return res.status(200).json({ result: data});
    }

    async updateProfile(req, res) {
        // const _user = req.user;

        if (!req.user) {
            return res.status(402).json('Something wend wrong');
        }
        // const dataUser = req.body;
        // // delete dataUser.email;
        // console.log(dataUser);
        // await userModel.update(dataUser, req.user.id);

        const dirUpload = `${process.env.DOWNLOAD_FOLDER}/users/${req.user.id}`;
        if (!fs.existsSync(dirUpload)) {
            fs.mkdirSync(dirUpload, { recursive: true });
        }
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, `public/uploads/users/${req.user.id}`);
            },
            filename: function (req, file, cb) {
                cb(null, Date.now() + '-' + file.originalname);
            }
        });
        const upload = multer({ storage: storage }).single('photo');
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(500).json(err);
            } else if (err) {
                return res.status(500).json(err);
            }
            const dataUser = req.body;
            const userEmail = dataUser.email;
            // const userEmail = '122111272808068624';
            const profileData = dataUser;
            delete profileData.user;
            delete profileData.email;
            // delete profileData.email_real;
            delete profileData.subscription;
            delete profileData.address;
            delete profileData.period_left;
            delete profileData.plan_options;
            // delete dataUser.email;
            // await userModel.update(dataUser, req.user.id);
            await userModel.update(profileData, req.user.id);
            if (req.file) {
                await userModel.updateProfilePhoto(`/uploads/users/${req.user.id}/${req.file.filename}`, req.user.id);
            }
            // const isValidEmail = (email: any) => {
            //     return /\S+@\S+\.\S+/.test(email);
            // };
            // if (!/\S+@\S+\.\S+/.test(userEmail) && profileData.email_real) {
            //     // req.user.email = profileData.email_real
            //     // await userModel.updateEmail(profileData.email_real, req.user.id);
            //     console.log("need update user email", profileData.email_real);
            // }
            const user = await userModel.findUserByEmail(req.user.email);
            // console.log(user);
            delete user.password;
            delete user.salt;
            delete user.hash;
            delete user.expired_at;
            return res.status(200).json({ user: user });
        });
    }

    async saveAddress(req, res) {
        let status;
        const user = req.user;
        if (user) {
            status = await userModel.saveAddress(user.id, req.body);
            return res.status(200).json({ status: status });
        } else {
            return res.status(402).json('Something wend wrong');
        }
    }

    async saveAddressSeller(req, res) {
        let status;
        // Mayachny 21, p 5 f 4, Amsterdam, 67012, France
        const user = req.user;
        if (user) {
            const counrtRes = await countryModel.findById(req.body.country_id);
            const addressLine = req.body.address_line_1+", " + req.body.address_line_2.trimStart()+", " + req.body.city.trimStart() + ", " + req.body.post_code.trimStart() + ", " + counrtRes.nicename;
            status = await userModel.saveSellerAddress(user.id, addressLine);
            return res.status(200).json({ status: true });
        } else {
            return res.status(402).json('Something wend wrong');
        }
    }


    async changePassword(req, res) {
        if (req.user) {
            const status = await userModel.changePassword(req.user, req.body);
            if (status) {
                return res.status(200).json({ status: status });
            }
        }
        return res.status(402).json('Something wend wrong');
    }

    async syncFb (req, res) {
        if (req.user) {
            const data = await userModel.syncFb(req.user, req.body);
            if (data.user) {
                return res.status(200).json({ user: data.user });
            }
        }
        return res.status(402).json('Something wend wrong');
    }

    async createAfterSkipSubscription(req, res) {
        const data = await userModel.createExistUserSubscriptionAfterTrial(req.user, req.body.planId);
        if (data.subscription) {
            return res.status(200).json({
                user: req.user,
                subscription: data.subscription,
                planId: data.planId,
                // clientSecret: data.subscription.status === 'trialing' ? null : data.subscription.latest_invoice.payment_intent.client_secret
                clientSecret: data.setupIntent.client_secret
            });
        }
        return res.status(402).json('Something wend wrong');
    }

    async createUserFromSubscription (req, res) {
        const createdUser = await userModel.createUserFromSubscription(req.body.userData, req.body.planId, req.body.type);
        // const createdUser = await userModel
        createdUser.planId = req.body.planId;
        const data = await userModel.createExistUserSubscription(createdUser);
        if (data.subscription) {
            // console.log('createUserFromSubscription', data.subscription);
            return res.status(200).json({
                user: createdUser.user,
                subscription: data.subscription,
                planId: data.planId,
                // clientSecret: data.subscription.status === 'trialing' ? null : data.subscription.latest_invoice.payment_intent.client_secret
                // clientSecret: data.subscription.latest_invoice.payment_intent.client_secret
            });
        } else {
            return res.status(402).json('Something wend wrong');
        }
    }

    async defaultPaymentSetup(req, res) {
        if (req.user) {
            const data = await userModel.setupDefaultPayment(req.user, req.body.paymentId);
            if (data.subscription) {
                return res.status(200).json({
                    subscription: data.subscription,
                });
            } else {
                return res.status(402).json('Something wend wrong');
            }
        } else {
            return res.status(402).json('Something wend wrong');
        }
    }

    async deletePaymentMethod(req, res) {
        if (req.user) {
            const data = await userModel.deletePaymentMethod(req.user, req.body.paymentId);
            if (data.subscription) {
                return res.status(200).json({
                    subscription: data.subscription,
                });
            } else {
                return res.status(402).json('Something wend wrong');
            }
        } else {
            return res.status(402).json('Something wend wrong');
        }
    }


    async getSubscription(req, res) {
        if (req.user) {
            // OLD VERSION
            // const data = await userModel.getSubscriptionInfo(req.user.subscription_id, req.user.customer_id, req.user.is_trial);
            // NEW VERSION
            const data = await userModel.fetchSubscription(req.user, req.user.subscription_id, req.user.customer_id, req.user.is_trial);
            // console.log('DATA SUBSCRIPTION PAYMENTS', data.subscription.paymentMethods);
            if (data.subscription) {
                return res.status(200).json({
                    subscription: data.subscription,
                });
            } else {
                return res.status(402).json('Something wend wrong');
            }
        } else {
            return res.status(402).json('Something wend wrong');
        }
    }

    async addPaymentMethodAfterRegistration(req, res) {
        const formData = req.body;
        const data = await userModel.createExistUserTrialSubscription(formData);
        if (data.subscription) {
            req.body.subscription = data.subscription;
            await userModel.addPaymentMethodBySubscription(req.body);
            const _user = await userModel.findUserByEmail(formData.user.email);
            return res.status(200).json({
                success: true,
                user: _user
            });
        }
        // console.log("FORM DATA", formData);

        // for incoming user create free month subscription



        return res.status(402).json('Something wend wrong');

        // if (formData.subscription.id) {
        //     const data = await userModel.addPaymentMethodBySubscription(req.body);
        //     if (data.success) {
        //         return res.status(200).json({
        //             success: data.success,
        //             user: data.user
        //         });
        //     } else {
        //         return res.status(402).json({
        //             success: data.success,
        //             error: data.error
        //         });
        //     }
        // } else {
        //     return res.status(402).json('Something wend wrong');
        // }
    }


    async addPaymentMethodFromSubscription(req, res) {
        const formData = req.body;
        if (formData.subscription.id) {
            const data = await userModel.addPaymentMethodBySubscription(req.body);
            if (data.success) {
                return res.status(200).json({
                    success: data.success,
                    user: data.user
                });
            } else {
                return res.status(402).json({
                    success: data.success,
                    error: data.error
                });
            }
        } else {
            return res.status(402).json('Something wend wrong');
        }
    }

    async setUserLocale(req, res) {
        if (req.user) {
            const dataLocale = userModel.setLocale(req.user.id, req.query.locale);
            return res.status(200).json({success: true});
        } else {
            return res.status(402).json('Something wend wrong');
        }
    }

    async addPaymentMethod(req, res) {
        if (req.user) {
            const data = await userModel.addPaymentMethod(req.user, req.body);
            if (data.success) {
                return res.status(200).json({
                    success: data.success
                });
            } else {
                return res.status(402).json({
                    success: data.success,
                    error: data.error
                });
            }
        } else {
            return res.status(402).json('Something wend wrong');
        }
    }



    async cancelSubscription(req, res) {
        if (req.user) {
            const data = await userModel.cancelSubscription(req.user, req.body.planId);
            if (data.success) {
                return res.status(200).json({
                    success: data.success
                });
            } else {
                return res.status(402).json({
                    success: data.success,
                    error: data.error
                });
            }
        } else {
            return res.status(402).json('Something wend wrong');
        }

    }


    async updateSubscriptionPlan (req, res) {
        if (req.user) {
            console.log('here');
            const data = await userModel.updateSubscriptionPlan(req.user, req.body.planId);
            if (data.success) {
                return res.status(200).json({
                    success: data.success
                });
            } else {
                return res.status(402).json({
                    success: data.success,
                    error: data.error
                });
            }
        } else {
            return res.status(402).json('Something wend wrong');
        }
    }

    async skipExistUserSubscriptionNew (req, res) {
        if (req.user) {
            console.log("skipExistUserSubscriptionNew", req.user.subscription_id)
            // skipping subscription
            if (!req.user.subscription_id) {
                const data = await userModel.createSkipSubscriptionNew(req.user);
                return res.status(200).json({
                    success: true,
                    tmp: 'tmp1',
                    user: data.user
                });
            }
            if (req.user.subscription_id.includes('fake_sub') || req.user.subscription_id.includes('skip_sub')) {
                const data = await userModel.createSkipSubscription(req.user);
                return res.status(200).json({
                    success: true,
                    tmp: 'tmp2',
                    user: data.user
                });
            } else {
                return res.status(200).json({
                    success: true,
                    tmp: 'tmp3',
                    data
                });
            }
        }
    }

    async skipExistUserSubscription (req, res) {
        if (req.user) {
            const userData = {
                planId: 1,
                type: 'trial',
                user: {
                    email: req.user.email,
                    first_name: req.user.first_name,
                    last_name: req.user.last_name
                }
            }
            const data = await userModel.createExistUserSubscription(userData, req.user);
            const user = await userModel.findUserByEmail(req.user.email);

            trialSubscriptionEmail(req.user.email, req.body.locale);

            if (data.subscription) {
                return res.status(200).json({
                    user: user,
                    subscription: data.subscription,
                    planId: data.planId,
                    // clientSecret: data.subscription.status === 'trialing' ? null : data.subscription.latest_invoice.payment_intent.client_secret
                    clientSecret: data.subscription.status === 'trialing' ? null : data.setupIntent.client_secret
                });
            } else {
                return res.status(402).json('Something wend wrong');
            }
        }
        return res.status(402).json('Something wend wrong');
    }

    async createExistUserSubscription (req, res) {
        if (req.user) {
            let subscriptionData;
            if (req.user.is_trial) {
                subscriptionData = await userModel.createExistUserSubscriptionAfterTrial(req.body, req.user);
            } else {
                subscriptionData = await userModel.createExistUserSubscription(req.body, req.user);

            }
            // console.log("SUBSCRIPTION", data.subscription);
            // let data;
            // if (!req.user.subscription) {
            //     data = await userModel.createExistUserSubscription(req.body, req.user);
            // } else {
            //     data.subscription = req.user.subscription;
            // }
            // if (!req.user.subscription) {
            //     data = await userModel.createExistUserSubscription(req.body, req.user);
            // }
            const user = await userModel.findUserByEmail(req.user.email, true);
            // console.log(user);

            // if (data.subscription) {
            if (subscriptionData?.subscription) {
                return res.status(200).json({
                    user: user,
                    subscription: subscriptionData.subscription,
                    planId: subscriptionData.planId,
                    clientSecret: subscriptionData.subscription.status === 'trialing' ? null :
                        subscriptionData.subscription.latest_invoice.payment_intent.client_secret
                    // clientSecret: data.subscription.status === 'trialing' ? null : data.setupIntent.client_secret
                });
            } else {
                return res.status(402).json('Something wend wrong');
            }
        }
        return res.status(402).json('Something wend wrong');
    }




    async checkPaymentStatus (req, res) {
        const data = await userModel.checkPayment(req.body.paymentIntent, req.body.paymentIntentSecret, req.body.planId, req.body.type);

        if (data.paymentIntent) {
            const user = await userModel.findUserByEmail(data.paymentIntent.email);
            delete user.salt;
            delete user.password;
            delete user.hash;
            delete user.expired_at;

            return res.status(200).json({
                paymentIntent: data.paymentIntent,
                user
            });
        }
        return res.status(200).json('Something wend wrong');
    }

    async unsubscribe (req, res) {
        if (req.user) {
            // send email to support about unsubscribe
            await userModel.cancelSubscription(req.user);

            const settings = paymentPlanModel.fetchSettings();
            const mail = await unsubscriberFromEmail(req.user.email, "User want unsubscribe from plan", 'fr');

            sendMail(
                settings.support_email,
                mail.subject,
                mail.body
            );
            // const welcomeEmail = welcomeEmailHtml(req.user.email, '', '');
            // sendMail(
            //     settings.support_email,
            //     'Proshop',
            //     welcomeEmail);
            return res.status(200).json({success: true});
        } else {
            return res.status(403).json({error: 'Something wend wrong'});
        }
    }
}

export default new UserController();
