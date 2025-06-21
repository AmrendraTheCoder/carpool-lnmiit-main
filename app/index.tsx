import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
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
import StudentCarpoolSystem from "./components/StudentCarpoolSystem";
import BusBookingSystem from "./components/BusBookingSystem";
import UserProfileSafety from "./components/UserProfileSafety";
import DriverDashboard from "./components/DriverDashboard";

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
  external_driver: {
    email: "rajesh.driver@gmail.com",
    password: "driver123",
    role: "external_driver" as const,
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
    role: "driver" | "passenger" | "external_driver"
  ) => {
    // Create user object based on credentials
    const isDemo = email === "demo@lnmiit.ac.in";
    const isStudent = email === "21UCS045@lnmiit.ac.in";
    const isDriver = email === "21UME023@lnmiit.ac.in";
    const isExternalDriver = email === "rajesh.driver@gmail.com";

    const userData = {
      id: isDemo
        ? "demo-1"
        : isStudent
        ? "student-1"
        : isDriver
        ? "driver-1"
        : "ext-driver-1",
      email,
      role,
      name: isDemo
        ? "Demo User"
        : isStudent
        ? "Arjun Sharma"
        : isDriver
        ? "Priya Gupta"
        : "Rajesh Kumar",
      profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      phone: isDemo
        ? "+91 99999 00000"
        : isStudent
        ? "+91 98765 43210"
        : isDriver
        ? "+91 87654 32109"
        : "+91 98765 43210",
      branch: isStudent
        ? "Computer Science"
        : isDriver
        ? "Mechanical Engineering"
        : isExternalDriver
        ? "Professional Driver"
        : "Demo",
      year: isStudent
        ? "3rd Year"
        : isDriver
        ? "4th Year"
        : isExternalDriver
        ? "5+ years experience"
        : "Demo",
      rating: isDriver || isExternalDriver ? 4.8 : 4.5,
      isVerified: true,
      ridesCompleted: isDriver || isExternalDriver ? 245 : 87,
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

const AppContent = () => {
  const { user, loading, isInitialLoading, login, logout } = useAuth();
  const [index, setIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const colorScheme = useColorScheme();
  const router = useRouter();

  // Animation for theme transition
  const themeTransition = useSharedValue(0);

  useEffect(() => {
    // Default to light theme instead of following system
    setIsDarkMode(false);
  }, [colorScheme]);

  useEffect(() => {
    themeTransition.value = withTiming(isDarkMode ? 1 : 0, {
      duration: 300,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  }, [isDarkMode]);

  const animatedContainerStyle = useAnimatedStyle(
    () => ({
      backgroundColor: isDarkMode ? "#000000" : "#FFFFFF",
    }),
    [isDarkMode]
  );

  const [routes] = useState([
    {
      key: "carpool",
      title: "Carpool",
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
                <View style={styles.logoContainer}>
                  <Text style={styles.logoEmoji}>🚗</Text>
                </View>
                <View style={styles.titleContainer}>
                  <Text style={styles.headerTitle}>LNMIIT Carpool</Text>
                  <Text style={styles.headerSubtitle}>
                    Student Ride Sharing
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
                    { backgroundColor: "rgba(255,255,255,0.15)" },
                  ]}
                />
                <Avatar.Image
                  size={36}
                  source={{
                    uri:
                      user.profilePicture ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
                  }}
                  style={[
                    styles.avatar,
                    { borderWidth: 2, borderColor: "#FFFFFF" },
                  ]}
                />
              </View>
            </View>
          </LinearGradient>

          {/* Content with Custom Bottom Navigation */}
          <View style={styles.content}>
            {/* Main Content */}
            <View style={styles.sceneContainer}>
              {index === 0 && (
                <StudentCarpoolSystem
                  isDarkMode={isDarkMode}
                  currentUser={{
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    branch: user.branch,
                    year: user.year,
                    rating: user.rating,
                    photo:
                      user.profilePicture ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
                  }}
                  onCreateRide={() => {
                    // TODO: Navigate to create ride screen
                    console.log("Create ride from StudentCarpool");
                  }}
                  onJoinRide={(rideId) => {
                    // TODO: Handle ride join logic
                    console.log("Join ride:", rideId);
                  }}
                />
              )}
              {index === 1 && <BusBookingSystem isDarkMode={isDarkMode} />}
              {index === 2 &&
                (user.role === "external_driver" ? (
                  <DriverDashboard
                    isDarkMode={isDarkMode}
                    driver={{
                      id: user.id,
                      name: user.name,
                      phone: user.phone,
                      verificationStatus: "approved",
                      rating: user.rating,
                      totalRides: user.ridesCompleted,
                      monthlyEarnings: 8500,
                      performanceScore: 92,
                      vehicleInfo: {
                        make: "Maruti",
                        model: "Swift Dzire",
                        licensePlate: "RJ14 CA 1234",
                        isAC: true,
                      },
                      currentRide: {
                        pickupLocation: "LNMIIT Campus",
                        destination: "Jaipur Railway Station",
                        passengers: 3,
                        fare: 120,
                      },
                    }}
                  />
                ) : (
                  <UserProfileSafety
                    user={user}
                    onLogout={logout}
                    isDarkMode={isDarkMode}
                  />
                ))}
            </View>

            {/* Custom Bottom Navigation */}
            <View
              style={[
                styles.bottomNavContainer,
                {
                  backgroundColor: isDarkMode ? "#000000" : "#FFFFFF",
                  borderTopColor: isDarkMode ? "#333333" : "#E0E0E0",
                  borderTopWidth: 1,
                },
              ]}
            >
              {routes.map((route, routeIndex) => {
                const isActive = index === routeIndex;
                const iconName = isActive
                  ? route.focusedIcon
                  : route.unfocusedIcon;

                return (
                  <TouchableOpacity
                    key={route.key}
                    style={[styles.tabItem, isActive && styles.activeTabItem]}
                    onPress={() => setIndex(routeIndex)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.tabIconContainer,
                        isActive && {
                          backgroundColor: isDarkMode
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(0,0,0,0.1)",
                        },
                      ]}
                    >
                      <IconButton
                        icon={iconName}
                        size={22}
                        iconColor={
                          isActive
                            ? isDarkMode
                              ? "#FFFFFF"
                              : "#000000"
                            : isDarkMode
                            ? "#666666"
                            : "#999999"
                        }
                        style={styles.tabButton}
                      />
                    </View>
                    <Text
                      style={[
                        styles.tabLabel,
                        {
                          color: isActive
                            ? isDarkMode
                              ? "#FFFFFF"
                              : "#000000"
                            : isDarkMode
                            ? "#666666"
                            : "#999999",
                          fontWeight: isActive ? "700" : "500",
                        },
                      ]}
                    >
                      {route.title}
                    </Text>
                    {isActive && (
                      <View
                        style={[
                          styles.activeIndicator,
                          {
                            backgroundColor: isDarkMode ? "#FFFFFF" : "#000000",
                          },
                        ]}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
};

AppContent.displayName = "AppContent";

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
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  logoEmoji: {
    fontSize: 20,
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingBottom: 20,
    marginBottom: 0,
    alignItems: "center",
    justifyContent: "space-around",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: 64,
    maxWidth: 80,
  },
  activeTabItem: {
    transform: [{ scale: 1.05 }],
  },
  tabButton: {
    margin: 0,
    padding: 6,
    backgroundColor: "transparent",
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 6,
    textAlign: "center",
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  tabIconContainer: {
    borderRadius: 12,
    padding: 4,
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    left: "50%",
    marginLeft: -12,
    width: 24,
    height: 3,
    borderRadius: 2,
  },
});
