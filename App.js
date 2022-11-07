import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithCredential, onAuthStateChanged } from 'firebase/auth';
import { StyleSheet, Button, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// Initialize Firebase
initializeApp({
  apiKey: "__apiKey__",
  authDomain: "__authDomain__",
  projectId: "__projectId__",
  storageBucket: "__storageBucket__",
  messagingSenderId: "__messageSenderId__",
  appId: "__appId__",
  measurementId: "__measurementId__"
});

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('user', user?.email)
    } else {
      console.log('not currently signed in')
    }
  });
  
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest(
    {
      clientId: '__clientId__.apps.googleusercontent.com',
    },
  );

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;

      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
    }
  }, [response]);

  return (
    <View style={styles.container}>
    <Button
      disabled={!request}
      title="Login"
      onPress={() => {
        promptAsync();
      }}
    />
    </View>
  );
}

