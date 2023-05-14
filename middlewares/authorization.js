/* ei function ta amake authorization korte sahajjo korbe.jemon dhori, ami sudhu admin, ar store-manager chara ar kauke stock route e stock create korte dibo na. tahole amake stock route e ei fucniton ke import korte hobe. tarpor je route e stock create hoye sei route er sathe ei function ta boshiye dibo. jemon:
   router.route('/').post(verifytoken, authorization("admin", "store-manager") ,StockController.addANewStock)
*/

// ei function ta call krle ekta middleware return korbe
module.exports.authorization = (...role) => {
    return (req, res, next) => {
        const userRole = req?.user?.role;
        if (!role.includes(userRole)) {
            return res.status(403).json({
                status: 'fail',
                error: 'You are not authorized to access this',
            });
        }

        next();
    };
};
