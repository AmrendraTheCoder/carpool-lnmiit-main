import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  User,
  Phone,
  GraduationCap,
} from "lucide-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  interpolate,
  Easing,
} from "react-native-reanimated";

import Button from "./ui/Button";
import Input from "./ui/Input";
import AnimatedBackground from "./AnimatedBackground";

const { width, height } = Dimensions.get("window");

interface ModernAuthScreenProps {
  onAuthenticated: (
    email: string,
    password: string,
    role: "driver" | "passenger"
  ) => void;
  isDarkMode?: boolean;
}

const ModernAuthScreen: React.FC<ModernAuthScreenProps> = ({
  onAuthenticated,
  isDarkMode = false,
}) => {
  const theme = useTheme();

  // Form state
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedRole, setSelectedRole] = useState<"driver" | "passenger">(
    "passenger"
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation state
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  // Animation values
  const containerOpacity = useSharedValue(0);
  const headerScale = useSharedValue(0.8);
  const formTranslateY = useSharedValue(50);
  const demoCardOpacity = useSharedValue(0);

  useEffect(() => {
    // Entrance animations
    containerOpacity.value = withTiming(1, { duration: 600 });
    headerScale.value = withSequence(
      withTiming(1.05, { duration: 400, easing: Easing.out(Easing.back(1.2)) }),
      withTiming(1, { duration: 200 })
    );
    formTranslateY.value = withDelay(
      200,
      withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) })
    );
    demoCardOpacity.value = withDelay(800, withTiming(1, { duration: 600 }));
  }, []);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: headerScale.value }],
  }));

  const formAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: formTranslateY.value }],
  }));

  const demoCardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: demoCardOpacity.value,
  }));

  const validateEmail = (email: string) => {
    // LNMIIT email format: YYUXXnnn@lnmiit.ac.in
    const emailRegex = /^\d{2}U[A-Z]{2}\d{3}@lnmiit\.ac\.in$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleSubmit = async () => {
    // Clear previous errors
    setEmailError("");
    setPasswordError("");

    // Validate email
    if (!email) {
      setEmailError("Email is required");
      return;
    }

    // Demo credentials check
    const isDemoLogin =
      (email === "demo@lnmiit.ac.in" && password === "demo123") ||
      (email === "21UCS045@lnmiit.ac.in" && password === "student123") ||
      (email === "21UME023@lnmiit.ac.in" && password === "driver123");

    if (!isDemoLogin && !validateEmail(email)) {
      setEmailError(
        "Invalid LNMIIT email format. Example: 21UCS045@lnmiit.ac.in"
      );
      return;
    }

    // Validate password
    if (!password) {
      setPasswordError("Password is required");
      return;
    }

    if (!isDemoLogin && !validatePassword(password)) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    // Additional validation for signup
    if (!isLogin) {
      if (!name.trim()) {
        Alert.alert("Error", "Name is required");
        return;
      }
      if (password !== confirmPassword) {
        setPasswordError("Passwords do not match");
        return;
      }
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Auto-assign role based on demo credentials
      let role: "driver" | "passenger" = selectedRole;
      if (email === "21UME023@lnmiit.ac.in") {
        role = "driver";
      } else if (
        email === "21UCS045@lnmiit.ac.in" ||
        email === "demo@lnmiit.ac.in"
      ) {
        role = "passenger";
      }

      onAuthenticated(email, password, role);
    } catch (error) {
      Alert.alert("Error", "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (type: "student" | "driver" | "demo") => {
    switch (type) {
      case "demo":
        setEmail("demo@lnmiit.ac.in");
        setPassword("demo123");
        setSelectedRole("passenger");
        break;
      case "student":
        setEmail("21UCS045@lnmiit.ac.in");
        setPassword("student123");
        setSelectedRole("passenger");
        break;
      case "driver":
        setEmail("21UME023@lnmiit.ac.in");
        setPassword("driver123");
        setSelectedRole("driver");
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AnimatedBackground isDarkMode={isDarkMode} />

      <Animated.View style={[styles.content, containerAnimatedStyle]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoid}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <Animated.View style={[styles.header, headerAnimatedStyle]}>
              <LinearGradient
                colors={["#6366f1", "#8b5cf6"]}
                style={styles.logoContainer}
              >
                <Text style={styles.logoText}>L</Text>
              </LinearGradient>

              <Text style={[styles.title, { color: theme.colors.onSurface }]}>
                {isLogin ? "Welcome back!" : "Join LNMIIT Carpool"}
              </Text>
              <Text
                style={[
                  styles.subtitle,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {isLogin
                  ? "Sign in to continue your journey"
                  : "Create your account to start sharing rides"}
              </Text>
            </Animated.View>

            {/* Demo Credentials Card */}
            <Animated.View style={[styles.demoCard, demoCardAnimatedStyle]}>
              <LinearGradient
                colors={
                  isDarkMode
                    ? ["#1e293b40", "#33415580"]
                    : ["#f8fafc", "#e2e8f0"]
                }
                style={styles.demoCardGradient}
              >
                <Text
                  style={[styles.demoTitle, { color: theme.colors.onSurface }]}
                >
                  🚀 Quick Demo Access
                </Text>
                <Text
                  style={[
                    styles.demoSubtitle,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  Try the app instantly with demo credentials
                </Text>

                <View style={styles.demoButtons}>
                  <Button
                    title="Demo User"
                    onPress={() => fillDemoCredentials("demo")}
                    variant="outline"
                    size="small"
                  />
                  <Button
                    title="Student"
                    onPress={() => fillDemoCredentials("student")}
                    variant="outline"
                    size="small"
                  />
                  <Button
                    title="Driver"
                    onPress={() => fillDemoCredentials("driver")}
                    variant="outline"
                    size="small"
                  />
                </View>
              </LinearGradient>
            </Animated.View>

            {/* Form */}
            <Animated.View style={[styles.form, formAnimatedStyle]}>
              {!isLogin && (
                <Input
                  label="Full Name"
                  value={name}
                  onChangeText={setName}
                  leftIcon={
                    <User size={20} color={theme.colors.onSurfaceVariant} />
                  }
                  placeholder="Enter your full name"
                  autoCapitalize="words"
                />
              )}

              <Input
                label="LNMIIT Email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError("");
                }}
                error={emailError}
                leftIcon={
                  <Mail size={20} color={theme.colors.onSurfaceVariant} />
                }
                placeholder="21UCS045@lnmiit.ac.in"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              {!isLogin && (
                <Input
                  label="Phone Number"
                  value={phone}
                  onChangeText={setPhone}
                  leftIcon={
                    <Phone size={20} color={theme.colors.onSurfaceVariant} />
                  }
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                />
              )}

              <Input
                label="Password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordError("");
                }}
                error={passwordError}
                secureTextEntry={!showPassword}
                leftIcon={
                  <Lock size={20} color={theme.colors.onSurfaceVariant} />
                }
                rightIcon={
                  showPassword ? (
                    <EyeOff size={20} color={theme.colors.onSurfaceVariant} />
                  ) : (
                    <Eye size={20} color={theme.colors.onSurfaceVariant} />
                  )
                }
                onRightIconPress={() => setShowPassword(!showPassword)}
                placeholder="Enter your password"
              />

              {!isLogin && (
                <Input
                  label="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  leftIcon={
                    <Lock size={20} color={theme.colors.onSurfaceVariant} />
                  }
                  rightIcon={
                    showConfirmPassword ? (
                      <EyeOff size={20} color={theme.colors.onSurfaceVariant} />
                    ) : (
                      <Eye size={20} color={theme.colors.onSurfaceVariant} />
                    )
                  }
                  onRightIconPress={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  placeholder="Confirm your password"
                />
              )}

              {!isLogin && (
                <View style={styles.roleSelection}>
                  <Text
                    style={[
                      styles.roleTitle,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    I want to
                  </Text>
                  <View style={styles.roleButtons}>
                    <Button
                      title="🚗 Drive & Share"
                      onPress={() => setSelectedRole("driver")}
                      variant={
                        selectedRole === "driver" ? "primary" : "outline"
                      }
                      style={styles.roleButton}
                    />
                    <Button
                      title="🧳 Find Rides"
                      onPress={() => setSelectedRole("passenger")}
                      variant={
                        selectedRole === "passenger" ? "primary" : "outline"
                      }
                      style={styles.roleButton}
                    />
                  </View>
                </View>
              )}

              <Button
                title={isLogin ? "Sign In" : "Create Account"}
                onPress={handleSubmit}
                loading={loading}
                fullWidth
                size="large"
                rightIcon={!loading && <ArrowRight size={20} color="white" />}
                style={styles.submitButton}
              />

              <Button
                title={
                  isLogin
                    ? "Don't have an account? Sign up"
                    : "Already have an account? Sign in"
                }
                onPress={() => {
                  setIsLogin(!isLogin);
                  setEmailError("");
                  setPasswordError("");
                }}
                variant="ghost"
                fullWidth
              />
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  logoText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#ffffff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  demoCard: {
    marginBottom: 32,
  },
  demoCardGradient: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#6366f120",
  },
  demoTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
  demoSubtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  demoButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 8,
  },
  form: {
    flex: 1,
  },
  roleSelection: {
    marginBottom: 24,
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  roleButtons: {
    flexDirection: "row",
    gap: 12,
  },
  roleButton: {
    flex: 1,
  },
  submitButton: {
    marginTop: 16,
    marginBottom: 16,
  },
});

export default ModernAuthScreen;
