
import { Button, StyleSheet, View } from 'react-native';
import { Link, Redirect } from 'expo-router';

export default function App() {
  
  const displayData = () => {};
//   const user = useUserStore((state) => state.user)

//   if (user !== null) return <Redirect replace href='/notes'/>
//   if (user == null) return <Redirect replace href='/sign-in'/>

  return (
    <View style={styles.container}>
      <Button
        onPress={displayData}
        title="Display Data"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
      <Link href="/sign-in">Go to Chords</Link>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
