const restaurantModel = require('../models/restaurant-model');

const populateObject = [{
    path :'gallerie'
},{
    path :'photoCover',
}];

exports.one = async (req,res) => {

    

    try {

        const restaurant = await restaurantModel.findOne({
            idParent : req.user.id_user
        }).populate(populateObject).exec();

      


        return  res.status(200).json({
            message: 'creation réussi',
            status: 'OK',
            data: restaurant,
            statusCode: 200
        });
        
    } catch (error) {
        return res.status(404).json({
            message: 'erreur supréssion ',
            statusCode: 404,
            data: error,
            status: 'NOT OK'
        });
    }

}


exports.all = async (req ,res )=> {

    try {
        
        const restaurants = await restaurantModel.find(req.query).populate(populateObject).exec();

        return  res.status(200).json({
            message: 'creation réussi',
            status: 'OK',
            data: restaurants,
            statusCode: 200
        });

    } catch (error) {
        
        return res.status(404).json({
            message: 'erreur supréssion ',
            statusCode: 404,
            data: error,
            status: 'NOT OK'
        });

    }


}

