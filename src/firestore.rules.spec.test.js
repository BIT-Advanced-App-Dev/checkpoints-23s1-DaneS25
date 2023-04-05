import firebase from 'firebase/app';
import 'firebase/firestore';
import { initializeTestApp, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';

const firebaseConfig = {
  apiKey: "AIzaSyBn1LdWi3GhrSNqT919ZsI-0aIBST812zA",
  authDomain: "todo-dane.firebaseapp.com",
  projectId: "todo-dane",
  storageBucket: "todo-dane.appspot.com",
  messagingSenderId: "288990996085",
  appId: "1:288990996085:web:4c0bdd5ec5482d3dd33a3c",
  measurementId: "G-MJQPNS0W3C"
};

firebase.initializeApp(firebaseConfig);

describe('Firestore rules', () => {
  const projectId = 'todo-dane';
  const uid = 'user1';

  beforeAll(async () => {
    await firebase.loadFirestoreRules({
      projectId: projectId,
      rules: 'path/to/your/firestore.rules',
    });
  });

  afterAll(async () => {
    await Promise.all(firebase.apps().map((app) => app.delete()));
  });

  beforeEach(async () => {
    const db = app.firestore();
    await db.collection('users').doc(uid).set({
      name: 'John',
      email: 'john@example.com',
    });
    await db.collection('users').doc(uid).collection('tasks').doc('task1').set({
      title: 'Task 1',
      description: 'This is task 1',
      userId: uid,
    });
  });

  afterEach(async () => {
    const db = app.firestore();
    await firebase.clearFirestoreData({
      projectId: projectId,
    });
  });

  it('should allow authenticated user to read and write to their own tasks collection', async () => {
    const db = initializeTestApp({
      projectId: projectId,
      auth: { uid: uid },
    }).firestore();
    const tasksRef = db.collection('users').doc(uid).collection('tasks');

    await assertSucceeds(tasksRef.add({ title: 'My new task', userId: uid }));

    const tasksSnapshot = await tasksRef.get();
    tasksSnapshot.forEach((doc) => {
      console.log(doc.id, '=>', doc.data());
    });
    await assertSucceeds(tasksSnapshot);
  });

  it('should not allow unauthenticated user to read or write to another user\'s tasks collection', async () => {
    const db = initializeTestApp({
      projectId: projectId,
    }).firestore();
    const otherUserId = 'user2';
    const otherUserTaskRef = db.collection('users').doc(otherUserId).collection('tasks').doc('task1');

    await assertFails(otherUserTaskRef.get());
    await assertFails(otherUserTaskRef.update({ title: 'Updated task' }));
    await assertFails(otherUserTaskRef.delete());
  });
});
