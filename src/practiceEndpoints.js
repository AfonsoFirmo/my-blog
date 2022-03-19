import express from 'express'
import { db } from './config'
// Import the functions you need from the SDKs you need
import { updateDoc, collection, query, where, addDoc, getDoc, setDoc, getDocs, doc, FieldValue} from "firebase/firestore"; 

const app = express();
app.use(express.json());

//WORKS AS TEST add document to collection
async function addData () {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      name: "my-thoughts-on-resumes",
      upvotes: 0,
      comments: []
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
//NOT IN USE
//addData();


//WORKS AS TEST Get a collection from DB using get() 
async function getCollection() {
  const querySnapshot = await getDocs(collection(db, "articles"));
  querySnapshot.forEach((doc) => {
  console.log(`${doc.id} => ${doc.data()}`);
})
}
//getCollection();

//Add documents to cities collection FROM DOCUMENTATION
async function addCities() {
  const citiesRef = collection(db, "cities");

  await setDoc(doc(citiesRef, "SF"), {
    name: "San Francisco", state: "CA", country: "USA",
    capital: false, population: 860000,
    regions: ["west_coast", "norcal"] });
await setDoc(doc(citiesRef, "LA"), {
    name: "Los Angeles", state: "CA", country: "USA",
    capital: false, population: 3900000,
    regions: ["west_coast", "socal"] });
await setDoc(doc(citiesRef, "DC"), {
    name: "Washington, D.C.", state: null, country: "USA",
    capital: true, population: 680000,
    regions: ["east_coast"] });
await setDoc(doc(citiesRef, "TOK"), {
    name: "Tokyo", state: null, country: "Japan",
    capital: true, population: 9000000,
    regions: ["kanto", "honshu"] });
await setDoc(doc(citiesRef, "BJ"), {
    name: "Beijing", state: null, country: "China",
    capital: true, population: 21500000,
    regions: ["jingjinji", "hebei"] });

}
//addCities();

//WORKS AS TEST Get multiple documents using a query
async function getDocument() {

  const q = query(collection(db, "articles"), where("name", "==", "learn-node"));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
  });
}
//getDocument();

//WORKS AS TEST get a document using get() FROM documentation
async function getCities() {
  const docRef = doc(db, "cities", "SF");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data().name);
  } else {
  // doc.data() will be undefined in this case
  console.log("No such document!");
  }
 }
//getCities();

//WORKS get a document using get() FROM documentation using endpoint instead of function
app.get("/get/city", async (req, res) => {
  const docRef = doc(db, "cities", "SF");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data().name);
    res.send({ msg: docSnap.data()});
  } else {
  // doc.data() will be undefined in this case
  console.log("No such document!");
  res.send({ msg: "No document found" });
  }
 });


//WORKS AS TEST  endpoint using post method to insert data into DB WORKS
// data comes in body. Need to use POST using postman
app.post("/create", async (req, res) => {
  const data = req.body;
  console.log(`data of user ${data}`)
  console.log(req.body.username)
  await addDoc(collection(db, "test"), data)
  res.send({ msg: "User Added" });
});

//WORKS adding a new document to DB based on url parameter. Should be post
app.get("/create/:name", async (req, res) => {
  try {
    const articlesRef = collection(db, "articles");
    const articleName = req.params.name
    await setDoc(doc(articlesRef), {
      name: articleName,
      upvotes: 0,
      comments: [] });
    res.status(200).json({msg: 'connecting to db'})
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: `error connecting to db ${error.message}`})
  }
});

//WORKS IT FUCKING WORKS - incrementing value
app.post("/increment", async (req,res) => {
  console.log('hi')
  try {
  const docRef = doc(db, "cities", "DC");
  const docSnap = await getDoc(docRef);
  console.log(docRef)
  // Set the "capital" field of the city 'DC'
  const newUpvotes  = docSnap.data().population + 1
  console.log(docSnap.data())
  await updateDoc(docRef, {
    population: newUpvotes
  });
  res.status(200).send({msg: "increment"});

  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: `error connecting to db ${error.message}`})
    console.log('hi')
  }
});


//WORKS add 1 upvote by article name in URL parameter
app.get("/api/articles/:name/upvote", async (req, res) => { 
  let docID;
  let newUpvotes;
  try {
    const articleName = req.params.name;
    const q = query(collection(db, "articles"), where("name", "==", articleName));
    
    const querySnapshot = await getDocs(q);
    //console.log(querySnapshot)
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots

      // extracting current upcotes and adding +1
      newUpvotes = doc.data().upvotes + 1;
      console.log(newUpvotes);

      //getting docID
      console.log(doc.id)
      docID = doc.id
      console.log(docID)
      
    });

      //getting doc ref by using ID from the querySnapshot
      const docRef = doc(db, "articles", docID);
      console.log(docRef);

      //updating upvotes count
      updateDoc(docRef, {
        upvotes: newUpvotes
      });
      console.log('hi')
      
    res.status(200).send({msg: `upvotes updated by 1`});
  } catch (error) {
    res.status(500).json({ message: `${error.message}`})
  }
  
});


//simple endpoint to say hello. No dependency on firebase
app.get('/hello', (req, res) => res.send('Hello!'));
app.post('/hello', (req, res) => res.send(`hi${req.body.name}`));

//connecting to server
app.listen(8000, () => console.log('listening on port 8000'));

