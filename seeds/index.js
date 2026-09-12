const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

async function startServer() {
  try {
    await mongoose.connect("mongodb://localhost:27017/yelp-camp");
    console.log("Mongo Connection Open!");
  } catch (error) {
    console.log("Mongo Error");
    console.log(error);
  }
}

startServer();

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});

  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const randprice = Math.floor(Math.random() * 19 + 10 / 5) * 5;

    const camp = new Campground({
      title: `${sample(descriptors)} ${sample(places)}`,
      price: randprice,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      image: `https://picsum.photos/400?random=${Math.random()}`,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus consequatur blanditiis iusto, facilis impedit voluptatum laudantium. Eaque sed ratione hic quam sit debitis, ullam ipsa neque cupiditate reprehenderit inventore vitae.",
    });

    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
