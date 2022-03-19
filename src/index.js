import express from 'express'
import { db } from './config'
// Import the functions you need from the SDKs you need
import { updateDoc, collection, query, where, addDoc, getDoc, setDoc, getDocs, doc, FieldValue} from "firebase/firestore"; 
import path from 'path';

const app = express();

//telling the back where to serve static files
app.use(express.static(path.join(__dirname, '/build')))
app.use(express.json());

//WORKS getting a new document from DB based on url parameter. 
app.get("/api/articles/:name", async (req, res) => {
  let docData;
  try {
    const articleName = req.params.name;
    const q = query(collection(db, "articles"), where("name", "==", articleName));
      
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      docData = doc.data();
    });
      res.status(200).json(docData)
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: `error connecting to db ${error.message}`})
  }
});


//WORKS add 1 upvote by article name in URL parameter
app.post("/api/articles/:name/upvote", async (req, res) => { 
  let docID;
  let newUpvotes;
  let docData;
  try {
    const articleName = req.params.name;
    const q = query(collection(db, "articles"), where("name", "==", articleName));
    
    let querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots

      // extracting current upcotes and adding +1
      newUpvotes = doc.data().upvotes + 1;
      //getting docID
      docID = doc.id
      
    });

    //getting doc ref by using ID from the querySnapshot
    const docRef = doc(db, "articles", docID);
      
    //updating upvotes count
    await updateDoc(docRef, {
      upvotes: newUpvotes
    }, docData=doc.data);

    const docSnap = await getDoc(docRef);
      
    res.status(200).send(docSnap.data());
  } catch (error) {
    res.status(500).json({ message: `${error.message}`})
  }
  
});

//ADD A COMMENT
app.post("/api/articles/:name/add-comment", async (req, res) => {
  let docData;
  let docID;
  let username = req.body.username;
  let text = req.body.text;
  
  try {
    const articleName = req.params.name;
    const q = query(collection(db, "articles"), where("name", "==", articleName));
      
    let querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      //getting docID to use in the next query in getting update doc info
      docID = doc.id
      docData = doc.data();
    });
    //getting doc ref by using ID from the querySnapshot
    const docRef = doc(db, "articles", docID);

    //adding comment
    updateDoc(docRef, {
      comments: docData.comments.concat({username, text})
    });
    
    //getting doc info again to send to client
    const docSnap = await getDoc(docRef);
    
    res.status(200).send(docSnap.data());

  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: `error connecting to db ${error.message}`})
  }
});

//WORKS AS TEST  endpoint using post method to insert data into DB WORKS
// data comes in body. Need to use POST using postman
app.post("/create", async (req, res) => {
  const data = req.body;
  console.log(req.body.name);
  console.log(`data of user ${data}`)
  console.log(req.body.username)
  await addDoc(collection(db, "test"), data)
  res.send({ msg: "User Added" });
});

app.get('*'), (req, res) => {
  res.sendFile(path.join(__dirname + '/build/index.hmtl'));
}
//connecting to server
app.listen(8000, () => console.log('listening on port 8000'));

