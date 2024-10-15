import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, Redirect, router } from 'expo-router';
import { styles } from '../../style/styles';
import FormField from '../../components/FormField';
import SubmitButton from '../../components/SubmitButton';

const SignIn = () => {
  return (
    <SafeAreaView style={styles.container}>
        <ScrollView>
            <View style={styles.signContainer}>
                <Text style={styles.welcomeText}>Log in to Chords</Text>
                <View style={styles.formContainer}>
                  <FormField 
                    title="Email"
                    value={""}
                    handleChangeText={(e) => {}}
                    keyboardType="email-address"
                    style={styles.formField}
                    placeholder={"Enter email"}
                  />
                  <FormField 
                    title="Password"
                    value={""}
                    handleChangeText={(e) => {}}
                    style={styles.formField}
                    placeholder={"Enter password"}
                    hidePassword={true}
                  />
                </View>
                <View style={{alignSelf: 'flex-start', width: '100%'}}>
                  <SubmitButton
                    handlePress={() => {router.replace('/search')}}
                    textValue={"Sign in"}
                  />
                </View>
                <View style={{alignSelf: 'flex-start', marginTop: 40}}>
                  <Text style={{ marginBottom: 5, fontSize: 18}}>
                    Dont have account?
                  </Text>
                  <Link style={{fontWeight: 'bold', fontSize: 20}} href="/sign-up">Sing Up</Link>
                </View>
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn