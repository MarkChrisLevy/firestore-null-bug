import {initializeApp, deleteApp, getApp} from "firebase/app";
import {collection, getFirestore, query, where, getDocs, deleteDoc, doc, setDoc} from "firebase/firestore";

(async () => {

    try {
        initializeApp({
            apiKey: "AIzaSyACkS2lYh-KO9YGPfEVDfrIvHlB8QrWr00",
            authDomain: "dev-test-17b7a.firebaseapp.com",
            databaseURL: "https://dev-test-17b7a.firebaseio.com",
            projectId: "dev-test-17b7a",
            storageBucket: "dev-test-17b7a.appspot.com",
            messagingSenderId: "35542723106",
            appId: "1:35542723106:web:51ff9a1acd32af35e6387b"
        })

        const testData = [{field: "test"}, {field: null}];
        console.log("---test data---")
        console.log(testData);

        const collectionRef = collection(getFirestore(), "records");

        console.log("\x1b[0m");
        console.log("---clear existing documents--");
        for (const doc of (await getDocs(collectionRef)).docs) {
            await deleteDoc(doc.ref);
        }

        console.log("\x1b[0m");
        console.log("---add new documents---");
        for (const data of testData) {
            await setDoc(doc(collectionRef), data)
        }

        console.log("\x1b[0m");
        console.log("---all documents---")
        for (const snapshot of (await getDocs(collectionRef)).docs) {
            console.log(snapshot.data());
        }

        console.log("\x1b[0m");
        console.log("---query != null---")
        for (const docSnapshot of (await getDocs(query(collectionRef, where("field", "!=", null)))).docs) {
            console.log(docSnapshot.data())
        }

        console.log("\x1b[0m");
        console.log("---query == null---")
        for (const docSnapshot of (await getDocs(query(collectionRef, where("field", "==", null)))).docs) {
            console.log(docSnapshot.data());
        }

        console.log("\x1b[0m");
        console.log("---query in [null]---")
        const resultInNull = (await getDocs(query(collectionRef, where("field", "in", [null])))).docs;
        if (resultInNull.length === 0) {
            console.log("\x1b[31m", "bug: query didn't return record with field=null")
        } else {
            console.log("hmm, everything is ok...");
        }

        console.log("\x1b[0m");
        console.log("---query in [null, \"test\"]---")
        const resultIn = (await getDocs(query(collectionRef, where("field", "in", [null, "test"])))).docs;
        if (resultIn.length !== testData.length) {
            console.log("\x1b[31m", `bug: query didn't return all records, only ${resultIn.length} with field=test`);
            for (const s of resultIn) {
                console.log(s.data());
            }
        } else {
            console.log("hmm, everything is ok...");
        }

        console.log();
        console.log("---query not-in [null]---")
        const resultNotIn = (await getDocs(query(collectionRef, where("field", "not-in", [null])))).docs;
        if (resultNotIn.length === 0) {
            console.error("\x1b[31m", `bug: query didn't return any record, but it should return record with field=test`);
        } else {
            console.log("hmm, everything is ok...");
        }

    } catch (error) {
        console.error(error);
    } finally {
        await deleteApp(getApp());
    }

})()