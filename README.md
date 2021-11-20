This repo shows a bug in firestore query. When querying for null values using "in" operator or "not-in" invalid results are returned or are not returned at all.

Firestore security rules are set as follows:
```
service cloud.firestore {
  match /databases/{database}/documents {
    match /records/{anyDoc=**} {
       allow read: if true;
       allow write: if true;
    }
  }
}
```

How to test it:
* git clone https://github.com/MarkChrisLevy/firestore-null-bug
* npm install
* npm test

**I'm using firebase js sdk, but the same happens with node sdk.**