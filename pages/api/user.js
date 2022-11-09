import firebase from "../../config/firebase-admin";

export default async function userhandler(req, res) {
  const method = req.method;
  console.log("Response from user route");
  if (method == "POST") {
    const { walletAddress, balane } = req.body;
    try {
      await firebase
        .firestore()
        .collection("players")
        .doc(walletAddress.trim())
        .create({
          balance: balane,
        });
      return res.status(200).send({
        status: 200,
        message: "New User Created Successfully",
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    return res.status(404).send({
      status: 400,
      message: "Invalid Request",
    });
  }
}
