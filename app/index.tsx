import React, { useState, useEffect } from "react";
import { View, StyleSheet, useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Surface,
  Text,
  ActivityIndicator,
  IconButton,
  Avatar,
  useTheme,
  BottomNavigation,
  Appbar,
  PaperProvider,
  MD3LightTheme,
  MD3DarkTheme,
} from "react-native-paper";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import {
  Home,
  Bus,
  User,
  Bell,
  Moon,
  Sun,
  Settings,
} from "lucide-react-native";

// Import new components
import LoadingScreen from "./components/LoadingScreen";
import ModernAuthScreen from "./components/ModernAuthScreen";
import UberStyleHome from "./components/UberStyleHome";
import BusBookingSystem from "./components/BusBookingSystem";
import UserProfileSafety from "./components/UserProfileSafety";

// Custom theme colors - Pure Black & White
const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#000000",
    secondary: "#666666",
    surface: "#FFFFFF",
    background: "#FFFFFF",
    onPrimary: "#FFFFFF",
    onSecondary: "#FFFFFF",
    onSurface: "#000000",
    onBackground: "#000000",
    surfaceVariant: "#F5F5F5",
    onSurfaceVariant: "#666666",
    outline: "#E0E0E0",
    error: "#FF0000",
    onError: "#FFFFFF",
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#FFFFFF",
    secondary: "#CCCCCC",
    surface: "#000000",
    background: "#000000",
    onPrimary: "#000000",
    onSecondary: "#000000",
    onSurface: "#FFFFFF",
    onBackground: "#FFFFFF",
    surfaceVariant: "#1A1A1A",
    onSurfaceVariant: "#CCCCCC",
    outline: "#333333",
    error: "#FF6B6B",
    onError: "#000000",
  },
};

// Demo credentials for easy access
const DEMO_CREDENTIALS = {
  demo: {
    email: "demo@lnmiit.ac.in",
    password: "demo123",
    role: "passenger" as const,
  },
  student: {
    email: "21UCS045@lnmiit.ac.in",
    password: "student123",
    role: "passenger" as const,
  },
  driver: {
    email: "21UME023@lnmiit.ac.in",
    password: "driver123",
    role: "driver" as const,
  },
};

// Mock user authentication state
const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // Show loading screen for 3 seconds
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const login = (
    email: string,
    password: string,
    role: "driver" | "passenger"
  ) => {
    // Create user object based on credentials
    const isDemo = email === "demo@lnmiit.ac.in";
    const isStudent = email === "21UCS045@lnmiit.ac.in";
    const isDriver = email === "21UME023@lnmiit.ac.in";

    const userData = {
      id: isDemo ? "demo-1" : isStudent ? "student-1" : "driver-1",
      email,
      role,
      name: isDemo ? "Demo User" : isStudent ? "Arjun Sharma" : "Priya Gupta",
      profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      phone: isDemo
        ? "+91 99999 00000"
        : isStudent
        ? "+91 98765 43210"
        : "+91 87654 32109",
      branch: isStudent
        ? "Computer Science"
        : isDriver
        ? "Mechanical Engineering"
        : "Demo",
      year: isStudent ? "3rd Year" : isDriver ? "4th Year" : "Demo",
      rating: isDriver ? 4.8 : 4.5,
      isVerified: true,
      ridesCompleted: isDriver ? 125 : 87,
      emergencyContacts: [
        {
          id: "1",
          name: "Parent",
          phone: "+91 99887 76655",
          relation: "Father",
        },
      ],
    };

    setUser(userData);
    return Promise.resolve();
  };

  const logout = () => {
    setUser(null);
    return Promise.resolve();
  };

  return { user, loading, isInitialLoading, login, logout };
};

function AppContent() {
  const { user, loading, isInitialLoading, login, logout } = useAuth();
  const [index, setIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const colorScheme = useColorScheme();
  const router = useRouter();

  // Animation for theme transition
  const themeTransition = useSharedValue(0);

  useEffect(() => {
    setIsDarkMode(colorScheme === "dark");
  }, [colorScheme]);

  useEffect(() => {
    themeTransition.value = withTiming(isDarkMode ? 1 : 0, {
      duration: 300,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  }, [isDarkMode]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    backgroundColor: isDarkMode ? "#000000" : "#FFFFFF",
  }));

  const [routes] = useState([
    {
      key: "rides",
      title: "Rides",
      focusedIcon: "car",
      unfocusedIcon: "car-outline",
    },
    {
      key: "bus",
      title: "Bus",
      focusedIcon: "bus",
      unfocusedIcon: "bus",
    },
    {
      key: "profile",
      title: "Profile",
      focusedIcon: "account",
      unfocusedIcon: "account-outline",
    },
  ]);

  // Show loading screen on app startup
  if (isInitialLoading) {
    return <LoadingScreen isDarkMode={isDarkMode} />;
  }

  // Show loading if authentication is in progress
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Animated.View
          style={[styles.loadingContainer, animatedContainerStyle]}
        >
          <ActivityIndicator
            size="large"
            animating={true}
            color={isDarkMode ? "#FFFFFF" : "#000000"}
          />
          <Text
            variant="bodyLarge"
            style={{ marginTop: 16, color: isDarkMode ? "#FFFFFF" : "#000000" }}
          >
            Loading LNMIIT Carpool...
          </Text>
        </Animated.View>
      </SafeAreaView>
    );
  }

  // Show modern auth screen if not authenticated
  if (!user) {
    return <ModernAuthScreen onAuthenticated={login} isDarkMode={isDarkMode} />;
  }

  const renderScene = BottomNavigation.SceneMap({
    rides: () => (
      <UberStyleHome
        user={user}
        isDarkMode={isDarkMode}
        onLocationSelect={(location) => {
          // Location selected
        }}
        onServiceSelect={(service) => {
          // Service selected
        }}
      />
    ),
    bus: () => <BusBookingSystem isDarkMode={isDarkMode} />,
    profile: () => (
      <UserProfileSafety
        user={user}
        onLogout={logout}
        isDarkMode={isDarkMode}
      />
    ),
  });

  return (
    <View style={styles.safeArea}>
      <StatusBar
        style="dark"
        backgroundColor="transparent"
        translucent={true}
      />
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Animated.View style={[styles.container, animatedContainerStyle]}>
          {/* Modern Header */}
          <View
            style={[
              styles.headerContainer,
              {
                backgroundColor: "#1A1A1A", // Always dark header
                borderBottomColor: isDarkMode ? "#333333" : "#E0E0E0",
              },
            ]}
          >
            <View style={styles.headerContent}>
              <View style={styles.headerLeft}>
                <View
                  style={[
                    styles.logoContainer,
                    { backgroundColor: "#FFFFFF" }, // Always white logo background
                  ]}
                >
                  <Text
                    style={[
                      styles.logoText,
                      { color: "#000000" }, // Always black text in logo
                    ]}
                  >
                    L
                  </Text>
                </View>
                <View style={styles.titleContainer}>
                  <Text style={styles.headerTitle}>LNMIIT</Text>
                  <Text style={styles.headerSubtitle}>
                    {user.role === "driver"
                      ? "Driver Dashboard"
                      : "Carpool & Bus"}
                  </Text>
                </View>
              </View>

              <View style={styles.headerRight}>
                <IconButton
                  icon={
                    isDarkMode ? "white-balance-sunny" : "moon-waning-crescent"
                  }
                  size={20}
                  iconColor="#FFFFFF"
                  onPress={() => setIsDarkMode(!isDarkMode)}
                  style={[
                    styles.iconButton,
                    { backgroundColor: "rgba(255,255,255,0.1)" },
                  ]}
                />
                <IconButton
                  icon="bell-outline"
                  size={20}
                  iconColor="#FFFFFF"
                  style={[
                    styles.iconButton,
                    { backgroundColor: "rgba(255,255,255,0.1)" },
                  ]}
                />
                <Avatar.Image
                  size={36}
                  source={{
                    uri:
                      user.profilePicture ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
                  }}
                  style={styles.avatar}
                />
              </View>
            </View>
          </View>

          {/* Content with Bottom Navigation */}
          <View style={styles.content}>
            <BottomNavigation
              navigationState={{ index, routes }}
              onIndexChange={setIndex}
              renderScene={renderScene}
              barStyle={{
                backgroundColor: isDarkMode ? "#000000" : "#FFFFFF",
                borderTopWidth: 1,
                borderTopColor: isDarkMode ? "#333333" : "#E0E0E0",
                paddingBottom: 8, // Reduced padding above home indicator
                marginBottom: 4, // Reduced margin from bottom edge
              }}
              activeColor={isDarkMode ? "#FFFFFF" : "#1A1A1A"}
              inactiveColor={isDarkMode ? "#CCCCCC" : "#999999"}
              safeAreaInsets={{ bottom: 8 }}
            />
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

export default function App() {
  return (
    <PaperProvider theme={lightTheme}>
      <AppContent />
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "900",
  },
  titleContainer: {
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.5,
    color: "#FFFFFF",
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#CCCCCC",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconButton: {
    margin: 0,
  },
  avatar: {
    marginLeft: 4,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
});
