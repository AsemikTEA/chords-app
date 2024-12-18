import { View, Text, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { styles } from '../../style/styles';
import SubmitButton from '../../components/SubmitButton';
import { useCreateAccount } from '../../hooks/useCreateAccount';
import { Controller, useForm } from 'react-hook-form';

const SignUp = () => {

  const {
    control,
    handleSubmit,
    clearErrors,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      repeatPassword: '',
    }
  });

  const createMutation = useCreateAccount();

  const onSubmit = (registerData) => {

    console.log(registerData);

    createMutation.mutate({
      username: registerData.username,
      email: registerData.email,
      password: registerData.password,
    },
      { onSuccess: ({ status: status, data: data, response: error }) => register(status, data, error) }
    );
  };

  const register = (status, data, error) => {
    if (status === 409) {
      console.log(error.data.message);
      setError('FORM_ERROR', {
        type: 'server',
        message: error.data.message,
      });
    }
    if (status === 201) {
      console.log(data);
      console.log('router replace');
      router.replace('/sign-in');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.signContainer}>
          <Text style={styles.welcomeText}>Sign Up to Chords</Text>
          <View style={styles.formContainer}>

            {/* Username Field */}
            <Text style={styles.formTextStyle}>Username</Text>
            <Controller
              control={control}
              name="username"
              rules={{
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Username must have atleast 3 characters",
                }
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.formTextInput}
                  placeholder="Enter your username"
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    onChange(text);
                    clearErrors('FORM_ERROR');
                  }}
                  value={value}
                />
              )}
            />
            {errors.username && <Text style={styles.error}>{errors.username.message}</Text>}

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
                minLength: {
                  value: 8,
                  message: "Password must have atleast 8 characters",
                }
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

            {/* repeatPassword Field */}
            <Text style={styles.formTextStyle}>Repeat Password</Text>
            <Controller
              control={control}
              name="repeatPassword"
              rules={{
                required: "You must repeat your password",
                validate: (value) =>
                  value === getValues('password') || 'Passwords do not match',
              }
              }
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.formTextInput}
                  placeholder="Enter your password"
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    onChange(text);
                    clearErrors(['FORM_ERROR', 'repeatPassword']);
                  }}
                  value={value}
                  secureTextEntry={true}
                />
              )}
            />
            {errors.repeatPassword && <Text style={styles.error}>{errors.repeatPassword.message}</Text>}

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