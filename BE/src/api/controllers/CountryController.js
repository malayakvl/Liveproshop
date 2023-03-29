import countryModel from '../models/Country.js';

class CountryController {
    /**
     *
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    async getAll (req, res) {
        const countries = await countryModel.getAll();
        if (!countries) {
            return res.status(402).json('Something wend wrong');
        }
        // const addresses = await userModel.findUserAddresses(user.id);
        return res.status(200).json({ countries: countries });
    }
}

export default new CountryController();
