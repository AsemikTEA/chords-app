import { View, Text, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { styles } from '../../style/styles';
import SubmitButton from '../../components/SubmitButton';
import { useLogIn } from '../../hooks/useLogIn';
import { useUserStore } from '../../state/store';
import { Controller, useForm } from 'react-hook-form';
import * as SecureStore from 'expo-secure-store';

const SignIn = () => {

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const user = useUserStore((state) => state.user);
  const userLogIn = useLogIn();

  const setId = useUserStore((state) => state.setId);
  const setUsername = useUserStore((state) => state.setUsername);
  const setEmail = useUserStore((state) => state.setEmail);

  const onSubmit = (logInData) => {
    userLogIn.mutate(
      {
        email: logInData.email,
        password: logInData.password,
      },
      { onSuccess: ({ status: status, data: data, response: error }) => logIn(status, data, error) }
    )
  };

  const logIn = async (status, data, error) => {
    if (status === 401) {
      console.log(error.data.message);
      setError('FORM_ERROR', {
        type: 'server',
        message: 'Authentication failed. Please check your credentials.'
      });
    }
    if (status === 200) {
      console.log(data);
      setId(data.id)
      setUsername(data.username);
      setEmail(data.email);

      try {
        await saveToken(data.accessToken, data.refreshToken);
        router.replace('/search');
      } catch (err) {
        Alert.alert('Login succeeded, but failed to save token.');
      }
      console.log(user);
    }
  }

    const saveToken = async (accessToken, refreshToken) => {
      try {
        await SecureStore.setItemAsync('access_token', accessToken);
        await SecureStore.setItemAsync('refresh_token', refreshToken);
      } catch (error) {
        console.log('Error saving token:', error);
      }
    }

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.signContainer}>
            <Text style={styles.welcomeText}>Log in to Chords</Text>
            <View style={styles.formContainer}>

              {/* Email Field */}
              <Text style={styles.formTextStyle}>Email</Text>
              <Controller
                control={control}
                name="email"
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
                    message: "Invalid email address",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.formTextInput}
                    placeholder="Enter your email"
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      onChange(text);
                      clearErrors('FORM_ERROR');
                    }}
                    value={value}
                    keyboardType="email-address"
                  />
                )}
              />
              {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

              {/* Password Field */}
              <Text style={styles.formTextStyle}>Password</Text>
              <Controller
                control={control}
                name="password"
                rules={{
                  required: "Password is required",
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.formTextInput}
                    placeholder="Enter your password"
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      onChange(text);
                      clearErrors('FORM_ERROR');
                    }}
                    value={value}
                    secureTextEntry={true}
                  />
                )}
              />
              {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

              {errors.FORM_ERROR && (
                <Text style={styles.error}>{errors.FORM_ERROR.message}</Text>
              )}

            </View>
            <View style={{ alignSelf: 'flex-start', width: '100%' }}>
              <SubmitButton
                handlePress={
                  handleSubmit(onSubmit)
                }
                style={styles.submitButton}
                textValue={"Sign in"}
              />
            </View>
            <View style={{ alignSelf: 'flex-start', marginTop: 40 }}>
              <Text style={{ marginBottom: 5, fontSize: 18 }}>
                Don't have account?
              </Text>
              <Link style={{ fontWeight: 'bold', fontSize: 20 }} href="/sign-up">Sing Up</Link>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  
}

  export default SignIn;