const User = require("../../models/User");

const userCreate = async () => {
  const user = {
    firstName: "Esteban",
    lastName: "Bustos",
    email: "estebanbmth99@gmail.com",
    password: "7972",
    phone: "+573113195202",
  };
  await User.create(user);
};

module.exports = userCreate;
