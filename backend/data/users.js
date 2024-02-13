import bcrypt from "bcryptjs";

const users = [
  {
    name: "Rohit Parakh",
    email: "rohitparakh4@gmail.com",
    password: bcrypt.hashSync("password", 10),
    isAdmin: true,
  },
  {
    name: "Customer 1",
    email: "cus1@rohstore.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Customer 2",
    email: "cus2@rohstore.com",
    password: bcrypt.hashSync("123456", 10),
  },
];

export default users;
