import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';



firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: ''
  
  })
  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSingIn = () =>{
// console.log('sign in click');
firebase.auth().signInWithPopup(provider)
.then(res => {
  // console.log(res);
  const {displayName, email, photoURL} = res.user;
const signedInUser = {
  isSignedIn: true,
  name: displayName,
  email: email,
  photo: photoURL
};
setUser(signedInUser);
  console.log(displayName, email, photoURL);
})
.catch(err =>{
  console.log(err);
  console.log(err.message);
})
  }

  // sign out korar jonno
  const handleSignOut = () =>{
    // console.log('sign out');
firebase.auth().signOut()
.then(res =>{
  const signedOutUser ={
    isSignedIn: false,
    name: '',
    photo: '',
    email: ''
  }
  setUser(signedOutUser);
  console.log(res);
})
.catch(err => {
  console.log(err);
  console.log(err.message);
})
  }
 
  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}> Sign out </button> :
        <button onClick={handleSingIn}> Sign in </button>
        }
      {
        user.isSignedIn && <div>
          <p>Welcome, {user.name}</p>
          <p>Your email: {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      }
    </div>
  );
}

export default App;
