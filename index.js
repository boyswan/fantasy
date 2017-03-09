const R = require("ramda");
const Either = require("ramda-fantasy").Either;
const Left = Either.Left;
const Right = Either.Right;

const notNum = R.pipe(R.is(Number), R.not);

const tax = R.curry((tax, price) => {
  if (notNum(price)) return Left("Price must be numeric");
  return Right(price + tax * price);
});

const discount = R.curry((dis, price) => {
  if (notNum(price)) return Left("Price must be numeric");
  if (price < 10)
    return Left("discount cant be applied for items priced below 10");
  return Right(price - price * dis);
});

const eitherLogOrShow = Either.either(
  x => console.log("Error: ", x),
  x => console.log("Total:", x)
);

const addCaliTax = tax(0.1); // 10% tax
const apply25PercDisc = discount(0.25); // 25% discount

const getItemPrice = item => Right(item.price);

const showTotalPrice = item =>
  eitherLogOrShow(getItemPrice(item).chain(apply25PercDisc).chain(addCaliTax));

const tShirt = { name: "t-shirt", price: 11 };
const pant = { name: "t-shirt", price: "10 dollars" };
const chips = { name: "t-shirt", price: 5 };

showTotalPrice(tShirt); // Total Is: 9.075
showTotalPrice(pant); // Error: Price must be numeric
showTotalPrice(chips); //Error: discount cant be applied for items priced below 10
