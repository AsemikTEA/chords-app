import { View, Text, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { styles } from '../../style/styles';
import FormField from '../../components/FormField';
import SubmitButton from '../../components/SubmitButton';
import { useCreateAccount } from '../../hooks/useCreateAccount';
import { useState } from 'react';

const SignUp = () => {

  //const errors = [];
  let username;
  let email;
  let password;
  let passwordRepeat;

  const createMutation = useCreateAccount();
  
  const [errors, setErrors] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const checkAuth = () => {
    //const errors = [];
    if (!username || username < 3) {
      //errors.push('Username must have atleast 3 characters.');
      setErrors('Username must have atleast 3 characters.');
    };
    if (!email || email < 3) {
      //errors.push('Enter valid email format.');
      setErrors('Enter valid email format.');
    };
    if (!password || password < 8) {
      //errors.push('Password must have atleast 8 characters.');
      setErrors('Password must have atleast 8 characters.');
    };
  }

  const checkPasswords = () => {
    if (password === passwordRepeat) {
      return true
    } else {
      return {
        status: false,
        message: 'Passwords must be identicall.'
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.signContainer}>
          <Modal
            animationType='none'
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => { setModalVisible(!modalVisible) }}>
            <TouchableOpacity
              style={styles.container}
              activeOpacity={1}
              onPressOut={() => { setModalVisible(false) }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  {errors.map((item) => {
                    console.log(errors)
                    return (
                      <Text>{item}</Text>
                    )
                  })}
                </View>
              </View>
            </TouchableOpacity>
          </Modal>
          <Text style={styles.welcomeText}>Sign Up to Chords</Text>
          <View style={styles.formContainer}>
            <FormField
              title="Username"
              value={username}
              handleChangeText={(e) => { username = e }}
              keyboardType="email-address"
              style={styles.formField}
              placeholder={"Enter username"}
            />
            <FormField
              title="Email"
              value={email}
              handleChangeText={(e) => { email = e }}
              keyboardType="email-address"
              style={styles.formField}
              placeholder={"Enter email"}
            />
            <FormField
              title="Password"
              value={password}
              handleChangeText={(e) => { password = e }}
              style={styles.formField}
              placeholder={"Enter password"}
              hidePassword={true}
            />
            <FormField
              title="Repeat Password"
              value={passwordRepeat}
              handleChangeText={(e) => { passwordRepeat = e }}
              style={styles.formField}
              placeholder={"Repeat Password"}
              hidePassword={true}
            />
          </View>
          <View style={{ alignSelf: 'flex-start', width: '100%' }}>
            <SubmitButton
              handlePress={() => {
                checkAuth();

                if (errors.length > 0) {
                  setModalVisible(true);
                  console.log(modalVisible);
                } else {
                  createMutation.mutate({
                    username: username,
                    email: email,
                    password: password,
                  })
                }
              }}
              textValue={"Sign Up"}
            />
          </View>
          <View style={{ alignSelf: 'flex-start', marginTop: 40 }}>
            <Text style={{ marginBottom: 5, fontSize: 18 }}>
              Already have an account?
            </Text>
            <Link style={{ fontWeight: 'bold', fontSize: 20 }} href="/sign-in">Sing In</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp