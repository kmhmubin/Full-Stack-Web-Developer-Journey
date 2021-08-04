const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "610800db3d9d6322d4e54400",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Camping is a leisurivity, usually during summer when school children are on holiday, where people leave their homes and spend one or more nights outdoors. Usually they seek nature, adventure, or a different environment. They may sleep in a campervan or trailer, a tent, or in the open air in good weather. Winter camping is less common but in some parts of the world, tents are people's homes year around. Rich people began camping for fun in the early 20th century. When more people could afford it, many more did it. When camping, people usually prepare food to eat that is easy to make. If they were hunting or fishing, they may cook the animal or fish they caught over a campfire.",
      price,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: "https://res.cloudinary.com/coderuseless/image/upload/v1628108537/YelpCamp/chris-holder-uY2UIyO5o5c-unsplash_imwrsl.jpg",
          filename: "YelpCamp/chris-holder-uY2UIyO5o5c-unsplash_imwrsl",
        },
        {
          url: "https://res.cloudinary.com/coderuseless/image/upload/v1628108538/YelpCamp/tommy-lisbin-2DH-qMX6M4E-unsplash_kk01um.jpg",
          filename: "YelpCamp/tommy-lisbin-2DH-qMX6M4E-unsplash_kk01um",
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
