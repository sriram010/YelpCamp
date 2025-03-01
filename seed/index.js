const mongoose = require('mongoose');
const cities = require('./cities');
const {descriptors, places} = require('./seedHelpers');
require('dotenv').config();

const Campground = require('../models/campground');

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Database connected successfuly');
    })

const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)]
}

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i=0; i<400; i++) {
        const index = Math.floor(Math.random() * cities.length);
        const price = Math.floor(Math.random() * 20) + 10;
        const newCampground = new Campground(
            {
                name: `${sample(descriptors)} ${sample(places)}`,
                location: `${cities[index].city}, ${cities[index].state}`,
                images: [
                      {
                        url: 'https://res.cloudinary.com/dkpirn5sj/image/upload/v1740280045/YelpCamp/aifwcn9ccwd7mokyywbg.jpg',
                        filename: 'YelpCamp/aifwcn9ccwd7mokyywbg',
                      },
                      {
                        url: 'https://res.cloudinary.com/dkpirn5sj/image/upload/v1740579439/YelpCamp/gjowsfyaprrgevhvd9u3.jpg',
                        filename: 'YelpCamp/rp9ewfqvin1d75e6ztbq',
                      }
                  
                  ],
                geometry: {
                    type: 'Point',
                    coordinates: [
                        cities[index].longitude,
                        cities[index].latitude
                    ]
                },
                description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque doloremque fugiat inventore vero corporis expedita natus nisi itaque deserunt exercitationem. Eius totam est distinctio quisquam molestias, quod velit. Impedit, aperiam!',
                price: price,
                author: '67a8848f4b4b52512a258aef'
            }
        )
        await newCampground.save();
    }
}

seedDB()
    .then(() => {
        mongoose.connection.close();
    })