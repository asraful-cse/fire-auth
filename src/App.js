import React, { useState } from 'react';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: ''

  })
  const googleProvider = new firebase.auth.GoogleAuthProvider();
const fbProvider = new firebase.auth.FacebookAuthProvider();
  const handleSingIn = () => {
    // console.log('sign in click');
    firebase.auth().signInWithPopup(googleProvider)
      .then(res => {
        // console.log(res);
        const { displayName, photoURL, email } = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        };
        setUser(signedInUser);
        // console.log(displayName, email, photoURL);
      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
      })
  }
 const handleFbSignIn = () =>{
  firebase
  .auth()
  .signInWithPopup(fbProvider)
  .then((result) => {
    // /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;

    // The signed-in user info.
    var user = result.user;

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var accessToken = credential.accessToken;

    // ...
    console.log('fb user after sign in', user);
  })
  .catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;

    // ...
  });
 }

 
// // fb user code


  // sign out korar jonno
  const handleSignOut = () => {
    // console.log('sign out');
    firebase.auth().signOut()
      .then(res => {
        const signedOutUser = {
          isSignedIn: false,
          name: '',
          photo: '',
          email: '',
          error: '',
          success: false
        }
        setUser(signedOutUser);
        console.log(res);
      })
      .catch(err => {
        // console.log(err);
        // console.log(err.message);
      });
  }

  const handleBlur = (e) => {
    let isFieldValid = true;
    if (e.target.name === 'email') {
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if (e.target.name === 'password') {
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFieldValid = isPasswordValid && passwordHasNumber;
    }
    if (isFieldValid) {
      //[...cart,newItem]
      const newUserInfo = { ...user };
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  }
  const handleSubmit = (e) => {
    // console.log(user.email, user.password);
    if (newUser && user.email && user.password) {           // / condition korar jonno new user hole er vetore jao 
      // console.log('submitted');
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          // console.log(res);
          const newUserInfo = { ...user };           // // error message er poriborte success message dekhabe
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
          // Signed in 
          // var user = userCredential.user;
          // ...
          updateUserName(user.name);
        })
        .catch((error) => {
          // //handle errors here
          // var errorCode = error.code;
          // var errorMessage = error.message;
          // console.log(errorCode, errorMessage);
          //  // error message set:: opore error : '' kora hoyese
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;    // successful er jonno 
          setUser(newUserInfo);
          // // ..
        });
    }
    if (!newUser && user.email && user.password) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          const newUserInfo = { ...user };           // // oporer ta copy kor past kora hoyese
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
          console.log('sign in user info' , res.user);
        })
        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;    // oporer ta copy kor past kora hoyese
          setUser(newUserInfo);
        });
    }
    e.preventDefault();
  }

  const updateUserName = name => {
    var user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name
    }).then(function () {
      // Update successful.
      console.log('user name update successfully');
    }).catch(function (error) {
      // An error happened.
      console.log(error);
    });
  }
  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}> Sign out </button> :
          <button onClick={handleSingIn}> Sign in </button>
      }
      <br />
      <button onClick={handleFbSignIn}>Sign in using facebook</button>
      {
        user.isSignedIn && <div>
          <p>Welcome, {user.name}</p>
          <p>Your email: {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      }
      <h1>Our own Authentication</h1>
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id="" />   
      <label htmlFor="newUser">New User Sign Up</label>
      <br />
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Password: {user.password}</p>

      <form onSubmit={handleSubmit}>
        {newUser && <input type="text" name="name" onBlur={handleBlur} placeholder="Your name" />}
        <br />
        <input type="text" name="email" onBlur={handleBlur} placeholder="Your Email address" required />
        <br />
        <input type="password" name="password" onBlur={handleBlur} placeholder="Your Password" required />
        <br />
        <input type="submit" value={newUser ? 'Sign up' : 'Sign in'} />
      </form>
      <p style={{ color: 'red' }}>{user.error}</p>
      {user.success && <p style={{ color: 'green' }}>User {newUser ? 'create' : 'Logged In'} successfully</p>}
    </div>
  );
}

export default App;
