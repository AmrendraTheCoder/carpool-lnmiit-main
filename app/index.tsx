import React, { useState, useEffect } from "react";
import { View, StyleSheet, useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
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
          <LinearGradient
            colors={["#1A1A1A", "#2A2A2A"]}
            style={[
              styles.headerContainer,
              {
                borderBottomColor: isDarkMode ? "#333333" : "#E0E0E0",
              },
            ]}
          >
            <View style={styles.headerContent}>
              <View style={styles.headerLeft}>
                <LinearGradient
                  colors={["#6366f1", "#8b5cf6"]}
                  style={styles.logoContainer}
                >
                  <Text style={styles.logoText}>L</Text>
                </LinearGradient>
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
                  size={22}
                  iconColor="#FFFFFF"
                  onPress={() => setIsDarkMode(!isDarkMode)}
                  style={[
                    styles.iconButton,
                    { backgroundColor: "rgba(255,255,255,0.15)" },
                  ]}
                />
                <IconButton
                  icon="bell-outline"
                  size={22}
                  iconColor="#FFFFFF"
                  style={[
                    styles.iconButton,
                    { backgroundColor: "rgba(255,255,255,0.15)" },
                  ]}
                />
                <LinearGradient
                  colors={["#6366f1", "#8b5cf6"]}
                  style={styles.avatarGradient}
                >
                  <Avatar.Image
                    size={32}
                    source={{
                      uri:
                        user.profilePicture ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
                    }}
                    style={styles.avatar}
                  />
                </LinearGradient>
              </View>
            </View>
          </LinearGradient>

          {/* Content with Custom Bottom Navigation */}
          <View style={styles.content}>
            {/* Main Content */}
            <View style={styles.sceneContainer}>
              {index === 0 && (
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
              )}
              {index === 1 && <BusBookingSystem isDarkMode={isDarkMode} />}
              {index === 2 && (
                <UserProfileSafety
                  user={user}
                  onLogout={logout}
                  isDarkMode={isDarkMode}
                />
              )}
            </View>

            {/* Custom Bottom Navigation */}
            <View
              style={[
                styles.bottomNavContainer,
                {
                  backgroundColor: isDarkMode ? "#000000" : "#FFFFFF",
                  borderTopColor: isDarkMode ? "#333333" : "#E0E0E0",
                },
              ]}
            >
              {routes.map((route, routeIndex) => {
                const isActive = index === routeIndex;
                const iconName = isActive
                  ? route.focusedIcon
                  : route.unfocusedIcon;

                return (
                  <Animated.View
                    key={route.key}
                    style={[styles.tabItem, isActive && styles.activeTabItem]}
                  >
                    {isActive && (
                      <LinearGradient
                        colors={["#6366f1", "#8b5cf6"]}
                        style={styles.activeTabBackground}
                      />
                    )}
                    <IconButton
                      icon={iconName}
                      size={24}
                      iconColor={
                        isActive
                          ? "#FFFFFF"
                          : isDarkMode
                          ? "#CCCCCC"
                          : "#999999"
                      }
                      onPress={() => setIndex(routeIndex)}
                      style={[
                        styles.tabButton,
                        isActive && styles.activeTabButton,
                      ]}
                    />
                    <Text
                      style={[
                        styles.tabLabel,
                        {
                          color: isActive
                            ? "#FFFFFF"
                            : isDarkMode
                            ? "#CCCCCC"
                            : "#999999",
                          fontWeight: isActive ? "600" : "400",
                        },
                      ]}
                    >
                      {route.title}
                    </Text>
                    {isActive && (
                      <View
                        style={[
                          styles.activeIndicator,
                          { backgroundColor: "#FFFFFF" },
                        ]}
                      />
                    )}
                  </Animated.View>
                );
              })}
            </View>
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
    color: "#FFFFFF",
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
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  avatarGradient: {
    borderRadius: 20,
    padding: 2,
    marginLeft: 4,
  },
  content: {
    flex: 1,
  },
  sceneContainer: {
    flex: 1,
  },
  bottomNavContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    paddingBottom: 12,
    marginBottom: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 16,
    position: "relative",
    minHeight: 64,
  },
  activeTabItem: {
    transform: [{ scale: 1.05 }],
  },
  activeTabBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    opacity: 0.9,
  },
  tabButton: {
    margin: 0,
    backgroundColor: "transparent",
  },
  activeTabButton: {
    backgroundColor: "transparent",
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 2,
    textAlign: "center",
  },
  activeIndicator: {
    position: "absolute",
    bottom: -2,
    width: 24,
    height: 3,
    borderRadius: 2,
  },
});
