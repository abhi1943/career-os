import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "./firebase";

export function signup(email,password){
  return createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
}

export function loginUser(email,password){
  return signInWithEmailAndPassword(
    auth,
    email,
    password
  );
}

export function logoutUser(){
  return signOut(auth);
}