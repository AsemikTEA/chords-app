import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { styles } from '../../style/styles';
import FormField from '../../components/FormField';
import SubmitButton from '../../components/SubmitButton';
import { useLogIn } from '../../hooks/useLogIn';
import { useUserStore } from '../../state/store';

const SignIn = () => {

  const user = useUserStore((state) => state.user);
  const logInData = useUserStore((state) => state.logInData);
  const userLogIn = useLogIn();

  const setId = useUserStore((state) => state.setId);
  const setUsername = useUserStore((state) => state.setUsername);
  const setEmail = useUserStore((state) => state.setEmail);
  const setToken = useUserStore((state) => state.setToken);
  const setLogInEmail = useUserStore((state) => state.setLogInEmail);
  const setLogInPassword = useUserStore((state) => state.setLogInPassword);

  const logIn = (status, data, error) => {
    if (status === 401) {
      console.log(error.data.message);
      setLogInEmail('');
      setLogInPassword('');
    }
    if (status === 200) {
      console.log(data);
      setId(data.id)
      setUsername(data.username);
      setEmail(data.email);
      setToken(data.token);
      setLogInEmail('');
      setLogInPassword('');
      router.replace('/search');
    }
    console.log(user);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.signContainer}>
          <Text style={styles.welcomeText}>Log in to Chords</Text>
          <View style={styles.formContainer}>
            <FormField
              title="Email"
              value={logInData.email}
              handleChangeText={(e) => { setLogInEmail(e) }}
              keyboardType="email-address"
              style={styles.formField}
              placeholder={"Enter email"}
            />
            <FormField
              title="Password"
              value={logInData.password}
              handleChangeText={(e) => { setLogInPassword(e) }}
              style={styles.formField}
              placeholder={"Enter password"}
              hidePassword={true}
            />
          </View>
          <View style={{ alignSelf: 'flex-start', width: '100%' }}>
            <SubmitButton
              handlePress={() => {
                userLogIn.mutate(
                  {
                    email: logInData.email,
                    password: logInData.password,
                  },
                  { onSuccess: ({ status: status, data: data, response: error }) => logIn(status, data, error) }
                )
              }}
              style={styles.submitButton}
              textValue={"Sign in"}
            />
          </View>
          <View style={{ alignSelf: 'flex-start', marginTop: 40 }}>
            <Text style={{ marginBottom: 5, fontSize: 18 }}>
              Dont have account?
            </Text>
            <Link style={{ fontWeight: 'bold', fontSize: 20 }} href="/sign-up">Sing Up</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn