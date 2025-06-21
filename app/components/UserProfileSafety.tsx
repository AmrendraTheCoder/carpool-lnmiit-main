import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Avatar } from "react-native-paper";
import {
  Star,
  Edit2,
  Phone,
  Shield,
  AlertTriangle,
  LogOut,
  ChevronRight,
  MapPin,
  Clock,
  Car,
  User,
  Settings,
  Bell,
} from "lucide-react-native";

interface UserProfileSafetyProps {
  user?: {
    name: string;
    email: string;
    profilePicture?: string;
    role: "driver" | "passenger";
    rating: number;
    branch: string;
    year: string;
    phone: string;
    ridesCompleted: number;
  };
  emergencyContacts?: Array<{
    id: string;
    name: string;
    phone: string;
    relation: string;
  }>;
  rideHistory?: Array<{
    id: string;
    date: string;
    from: string;
    to: string;
    driver: string;
    driverRating?: number;
    status: "completed" | "cancelled" | "upcoming";
  }>;
  isDarkMode?: boolean;
  onLogout?: () => void;
}

const { width } = Dimensions.get("window");

const UserProfileSafety = ({
  user = {
    name: "Demo User",
    email: "demo@lnmiit.ac.in",
    profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
    role: "passenger",
    rating: 4.7,
    branch: "Computer Science",
    year: "3rd Year",
    phone: "+91 99999 00000",
    ridesCompleted: 25,
  },
  emergencyContacts = [
    { id: "1", name: "Parent", phone: "+91 99887 76655", relation: "Father" },
    {
      id: "2",
      name: "Emergency",
      phone: "+91 88776 65544",
      relation: "Mother",
    },
  ],
  rideHistory = [
    {
      id: "1",
      date: "2023-10-15 14:30",
      from: "LNMIIT Campus",
      to: "Jaipur Railway Station",
      driver: "Amit Kumar",
      driverRating: 4.8,
      status: "completed",
    },
    {
      id: "2",
      date: "2023-10-10 09:15",
      from: "Jaipur City Mall",
      to: "LNMIIT Campus",
      driver: "Priya Singh",
      driverRating: 4.5,
      status: "completed",
    },
  ],
  isDarkMode = false,
  onLogout = () => {},
}: UserProfileSafetyProps) => {
  const [activeTab, setActiveTab] = useState<"profile" | "safety">("profile");
  const [locationSharing, setLocationSharing] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSOS = () => {
    Alert.alert(
      "Emergency SOS",
      "Are you sure you want to send an SOS alert to your emergency contacts?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send SOS",
          style: "destructive",
          onPress: () =>
            Alert.alert(
              "SOS Alert Sent",
              "Your emergency contacts have been notified of your location."
            ),
        },
      ]
    );
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={14}
          fill={i <= rating ? "#FFD700" : "none"}
          color={i <= rating ? "#FFD700" : isDarkMode ? "#666666" : "#CCCCCC"}
        />
      );
    }
    return stars;
  };

  const tabs = [
    { key: "profile", title: "Profile", icon: User },
    { key: "safety", title: "Safety", icon: Shield },
  ];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#000000" : "#FFFFFF" },
      ]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: isDarkMode ? "#000000" : "#FFFFFF",
            borderBottomColor: isDarkMode ? "#333333" : "#E0E0E0",
          },
        ]}
      >
        <Text
          style={[
            styles.headerTitle,
            { color: isDarkMode ? "#FFFFFF" : "#000000" },
          ]}
        >
          Profile
        </Text>

        {/* Tab Selector */}
        <View
          style={[
            styles.tabContainer,
            { backgroundColor: isDarkMode ? "#1A1A1A" : "#F5F5F5" },
          ]}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                activeTab === tab.key && [
                  styles.activeTab,
                  { backgroundColor: isDarkMode ? "#FFFFFF" : "#000000" },
                ],
              ]}
              onPress={() => setActiveTab(tab.key as "profile" | "safety")}
            >
              <tab.icon
                size={16}
                color={
                  activeTab === tab.key
                    ? isDarkMode
                      ? "#000000"
                      : "#FFFFFF"
                    : isDarkMode
                    ? "#CCCCCC"
                    : "#666666"
                }
              />
              <Text
                style={[
                  styles.tabText,
                  {
                    color:
                      activeTab === tab.key
                        ? isDarkMode
                          ? "#000000"
                          : "#FFFFFF"
                        : isDarkMode
                        ? "#CCCCCC"
                        : "#666666",
                  },
                ]}
              >
                {tab.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "profile" ? (
          <View style={styles.content}>
            {/* User Info Card */}
            <View
              style={[
                styles.card,
                {
                  backgroundColor: isDarkMode ? "#1A1A1A" : "#FFFFFF",
                  borderColor: isDarkMode ? "#333333" : "#E0E0E0",
                },
              ]}
            >
              <View style={styles.userHeader}>
                <Avatar.Image
                  size={80}
                  source={{
                    uri:
                      user.profilePicture ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
                  }}
                />
                <View style={styles.userInfo}>
                  <Text
                    style={[
                      styles.userName,
                      { color: isDarkMode ? "#FFFFFF" : "#000000" },
                    ]}
                  >
                    {user.name}
                  </Text>
                  <Text
                    style={[
                      styles.userEmail,
                      { color: isDarkMode ? "#CCCCCC" : "#666666" },
                    ]}
                  >
                    {user.email}
                  </Text>
                  <View style={styles.ratingContainer}>
                    <View style={styles.stars}>{renderStars(user.rating)}</View>
                    <Text
                      style={[
                        styles.ratingText,
                        { color: isDarkMode ? "#CCCCCC" : "#666666" },
                      ]}
                    >
                      {user.rating} ({user.ridesCompleted} rides)
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={[
                    styles.editButton,
                    { backgroundColor: isDarkMode ? "#333333" : "#F5F5F5" },
                  ]}
                  onPress={() =>
                    Alert.alert(
                      "Edit Profile",
                      "Edit profile functionality coming soon!"
                    )
                  }
                >
                  <Edit2 size={18} color={isDarkMode ? "#FFFFFF" : "#000000"} />
                </TouchableOpacity>
              </View>

              <View style={styles.userDetails}>
                <View style={styles.detailRow}>
                  <Text
                    style={[
                      styles.detailLabel,
                      { color: isDarkMode ? "#CCCCCC" : "#666666" },
                    ]}
                  >
                    Role
                  </Text>
                  <Text
                    style={[
                      styles.detailValue,
                      { color: isDarkMode ? "#FFFFFF" : "#000000" },
                    ]}
                  >
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text
                    style={[
                      styles.detailLabel,
                      { color: isDarkMode ? "#CCCCCC" : "#666666" },
                    ]}
                  >
                    Branch
                  </Text>
                  <Text
                    style={[
                      styles.detailValue,
                      { color: isDarkMode ? "#FFFFFF" : "#000000" },
                    ]}
                  >
                    {user.branch}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text
                    style={[
                      styles.detailLabel,
                      { color: isDarkMode ? "#CCCCCC" : "#666666" },
                    ]}
                  >
                    Year
                  </Text>
                  <Text
                    style={[
                      styles.detailValue,
                      { color: isDarkMode ? "#FFFFFF" : "#000000" },
                    ]}
                  >
                    {user.year}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text
                    style={[
                      styles.detailLabel,
                      { color: isDarkMode ? "#CCCCCC" : "#666666" },
                    ]}
                  >
                    Phone
                  </Text>
                  <Text
                    style={[
                      styles.detailValue,
                      { color: isDarkMode ? "#FFFFFF" : "#000000" },
                    ]}
                  >
                    {user.phone}
                  </Text>
                </View>
              </View>
            </View>

            {/* Settings */}
            <View
              style={[
                styles.card,
                {
                  backgroundColor: isDarkMode ? "#1A1A1A" : "#FFFFFF",
                  borderColor: isDarkMode ? "#333333" : "#E0E0E0",
                },
              ]}
            >
              <Text
                style={[
                  styles.cardTitle,
                  { color: isDarkMode ? "#FFFFFF" : "#000000" },
                ]}
              >
                Settings
              </Text>

              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Bell size={20} color={isDarkMode ? "#CCCCCC" : "#666666"} />
                  <Text
                    style={[
                      styles.settingText,
                      { color: isDarkMode ? "#FFFFFF" : "#000000" },
                    ]}
                  >
                    Notifications
                  </Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{
                    false: isDarkMode ? "#333333" : "#E0E0E0",
                    true: isDarkMode ? "#666666" : "#000000",
                  }}
                  thumbColor={
                    notificationsEnabled
                      ? isDarkMode
                        ? "#FFFFFF"
                        : "#FFFFFF"
                      : isDarkMode
                      ? "#CCCCCC"
                      : "#CCCCCC"
                  }
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Settings
                    size={20}
                    color={isDarkMode ? "#CCCCCC" : "#666666"}
                  />
                  <Text
                    style={[
                      styles.settingText,
                      { color: isDarkMode ? "#FFFFFF" : "#000000" },
                    ]}
                  >
                    App Settings
                  </Text>
                </View>
                <ChevronRight
                  size={20}
                  color={isDarkMode ? "#CCCCCC" : "#666666"}
                />
              </TouchableOpacity>
            </View>

            {/* Recent Rides */}
            <View
              style={[
                styles.card,
                {
                  backgroundColor: isDarkMode ? "#1A1A1A" : "#FFFFFF",
                  borderColor: isDarkMode ? "#333333" : "#E0E0E0",
                },
              ]}
            >
              <Text
                style={[
                  styles.cardTitle,
                  { color: isDarkMode ? "#FFFFFF" : "#000000" },
                ]}
              >
                Recent Rides
              </Text>

              {rideHistory.slice(0, 3).map((ride) => (
                <View key={ride.id} style={styles.rideItem}>
                  <View
                    style={[
                      styles.rideIcon,
                      { backgroundColor: isDarkMode ? "#333333" : "#F5F5F5" },
                    ]}
                  >
                    <Car size={16} color={isDarkMode ? "#FFFFFF" : "#000000"} />
                  </View>
                  <View style={styles.rideDetails}>
                    <Text
                      style={[
                        styles.rideRoute,
                        { color: isDarkMode ? "#FFFFFF" : "#000000" },
                      ]}
                    >
                      {ride.from} → {ride.to}
                    </Text>
                    <View style={styles.rideInfo}>
                      <Text
                        style={[
                          styles.rideDate,
                          { color: isDarkMode ? "#CCCCCC" : "#666666" },
                        ]}
                      >
                        {new Date(ride.date).toLocaleDateString()}
                      </Text>
                      <Text
                        style={[
                          styles.rideDriver,
                          { color: isDarkMode ? "#CCCCCC" : "#666666" },
                        ]}
                      >
                        with {ride.driver}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          ride.status === "completed" ? "#00AA00" : "#FF6B6B",
                      },
                    ]}
                  >
                    <Text style={styles.statusText}>{ride.status}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Logout */}
            <TouchableOpacity
              style={[
                styles.logoutButton,
                { backgroundColor: isDarkMode ? "#FF6B6B" : "#FF0000" },
              ]}
              onPress={() => {
                Alert.alert("Logout", "Are you sure you want to logout?", [
                  { text: "Cancel", style: "cancel" },
                  { text: "Logout", style: "destructive", onPress: onLogout },
                ]);
              }}
            >
              <LogOut size={20} color="#FFFFFF" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Safety Tab
          <View style={styles.content}>
            {/* Emergency SOS */}
            <View
              style={[
                styles.card,
                {
                  backgroundColor: isDarkMode ? "#1A1A1A" : "#FFFFFF",
                  borderColor: isDarkMode ? "#333333" : "#E0E0E0",
                },
              ]}
            >
              <Text
                style={[
                  styles.cardTitle,
                  { color: isDarkMode ? "#FFFFFF" : "#000000" },
                ]}
              >
                Emergency SOS
              </Text>
              <Text
                style={[
                  styles.cardDescription,
                  { color: isDarkMode ? "#CCCCCC" : "#666666" },
                ]}
              >
                Press the button below to send an emergency alert to your
                contacts
              </Text>

              <TouchableOpacity style={styles.sosButton} onPress={handleSOS}>
                <AlertTriangle size={24} color="#FFFFFF" />
                <Text style={styles.sosText}>Send SOS Alert</Text>
              </TouchableOpacity>
            </View>

            {/* Emergency Contacts */}
            <View
              style={[
                styles.card,
                {
                  backgroundColor: isDarkMode ? "#1A1A1A" : "#FFFFFF",
                  borderColor: isDarkMode ? "#333333" : "#E0E0E0",
                },
              ]}
            >
              <Text
                style={[
                  styles.cardTitle,
                  { color: isDarkMode ? "#FFFFFF" : "#000000" },
                ]}
              >
                Emergency Contacts
              </Text>

              {emergencyContacts.map((contact) => (
                <View key={contact.id} style={styles.contactItem}>
                  <View
                    style={[
                      styles.contactIcon,
                      { backgroundColor: isDarkMode ? "#333333" : "#F5F5F5" },
                    ]}
                  >
                    <Phone
                      size={16}
                      color={isDarkMode ? "#FFFFFF" : "#000000"}
                    />
                  </View>
                  <View style={styles.contactDetails}>
                    <Text
                      style={[
                        styles.contactName,
                        { color: isDarkMode ? "#FFFFFF" : "#000000" },
                      ]}
                    >
                      {contact.name}
                    </Text>
                    <Text
                      style={[
                        styles.contactRelation,
                        { color: isDarkMode ? "#CCCCCC" : "#666666" },
                      ]}
                    >
                      {contact.relation} • {contact.phone}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.callButton,
                      { backgroundColor: isDarkMode ? "#00AA00" : "#00AA00" },
                    ]}
                    onPress={() =>
                      Alert.alert("Call", `Calling ${contact.name}...`)
                    }
                  >
                    <Phone size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity
                style={[
                  styles.addContactButton,
                  { borderColor: isDarkMode ? "#333333" : "#E0E0E0" },
                ]}
                onPress={() =>
                  Alert.alert(
                    "Add Contact",
                    "Add emergency contact functionality coming soon!"
                  )
                }
              >
                <Text
                  style={[
                    styles.addContactText,
                    { color: isDarkMode ? "#CCCCCC" : "#666666" },
                  ]}
                >
                  + Add Emergency Contact
                </Text>
              </TouchableOpacity>
            </View>

            {/* Safety Settings */}
            <View
              style={[
                styles.card,
                {
                  backgroundColor: isDarkMode ? "#1A1A1A" : "#FFFFFF",
                  borderColor: isDarkMode ? "#333333" : "#E0E0E0",
                },
              ]}
            >
              <Text
                style={[
                  styles.cardTitle,
                  { color: isDarkMode ? "#FFFFFF" : "#000000" },
                ]}
              >
                Safety Settings
              </Text>

              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <MapPin
                    size={20}
                    color={isDarkMode ? "#CCCCCC" : "#666666"}
                  />
                  <View>
                    <Text
                      style={[
                        styles.settingText,
                        { color: isDarkMode ? "#FFFFFF" : "#000000" },
                      ]}
                    >
                      Location Sharing
                    </Text>
                    <Text
                      style={[
                        styles.settingDescription,
                        { color: isDarkMode ? "#CCCCCC" : "#666666" },
                      ]}
                    >
                      Share your location during rides
                    </Text>
                  </View>
                </View>
                <Switch
                  value={locationSharing}
                  onValueChange={setLocationSharing}
                  trackColor={{
                    false: isDarkMode ? "#333333" : "#E0E0E0",
                    true: isDarkMode ? "#666666" : "#000000",
                  }}
                  thumbColor={
                    locationSharing
                      ? isDarkMode
                        ? "#FFFFFF"
                        : "#FFFFFF"
                      : isDarkMode
                      ? "#CCCCCC"
                      : "#CCCCCC"
                  }
                />
              </View>
            </View>
          </View>
        )}

        {/* Bottom spacing */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  activeTab: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 20,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  cardDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stars: {
    flexDirection: "row",
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  userDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    fontWeight: "500",
  },
  settingDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  rideItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  rideIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  rideDetails: {
    flex: 1,
  },
  rideRoute: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  rideInfo: {
    flexDirection: "row",
    gap: 8,
  },
  rideDate: {
    fontSize: 12,
  },
  rideDriver: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FFFFFF",
    textTransform: "capitalize",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  sosButton: {
    backgroundColor: "#FF0000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  sosText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  contactIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  contactRelation: {
    fontSize: 12,
  },
  callButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  addContactButton: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  addContactText: {
    fontSize: 14,
    fontWeight: "500",
  },
});

export default UserProfileSafety;
