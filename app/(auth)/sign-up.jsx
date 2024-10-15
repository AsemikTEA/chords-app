import { View, Text, ScrollView, Button, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, Redirect } from 'expo-router';
import { styles } from '../../style/styles';
import FormField from '../../components/FormField';
import SubmitButton from '../../components/SubmitButton';

const SignUp = () => {
  return (
    <SafeAreaView style={styles.container}>
        <ScrollView>
            <View style={styles.signContainer}>
                <Text style={styles.welcomeText}>Sign Up to Chords</Text>
                <View style={styles.formContainer}>
                  <FormField 
                    title="Username"
                    value={""}
                    handleChangeText={(e) => {}}
                    keyboardType="email-address"
                    style={styles.formField}
                    placeholder={"Enter username"}
                  />
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
                  <FormField 
                    title="Repeat Password"
                    value={""}
                    handleChangeText={(e) => {}}
                    style={styles.formField}
                    placeholder={"Repeat Password"}
                    hidePassword={true}
                  />
                </View>
                <View style={{alignSelf: 'flex-start', width: '100%'}}>
                  <SubmitButton
                    handlePress={() => {}}
                    textValue={"Sign Up"}
                  />
                </View>
                <View style={{alignSelf: 'flex-start', marginTop: 40}}>
                  <Text style={{ marginBottom: 5, fontSize: 18}}>
                    Already have an account?
                  </Text>
                  <Link style={{fontWeight: 'bold', fontSize: 20}} href="/sign-in">Sing In</Link>
                </View>
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp