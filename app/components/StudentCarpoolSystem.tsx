import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { Avatar, Chip, Searchbar } from "react-native-paper";
import {
  MapPin,
  Clock,
  Users,
  DollarSign,
  Filter,
  Star,
  Phone,
  MessageCircle,
  Calendar,
  Navigation,
  User,
  Car,
  ArrowRight,
  Plus,
} from "lucide-react-native";
import Button from "./ui/Button";
import RideDetailsScreen from "./RideDetailsScreen";
import CreateRideScreen from "./CreateRideScreen";
import ChatScreen from "./ChatScreen";
import { socketService } from "../services/SocketService";

interface CarpoolRide {
  id: string;
  driverId: string;
  driverName: string;
  driverRating: number;
  driverPhoto: string;
  driverBranch: string;
  driverYear: string;
  from: string;
  to: string;
  departureTime: string;
  date: string;
  availableSeats: number;
  totalSeats: number;
  pricePerSeat: number;
  vehicleInfo: {
    make: string;
    model: string;
    color: string;
    isAC: boolean;
  };
  route: string[];
  preferences: {
    gender?: "male" | "female" | "any";
    smokingAllowed: boolean;
    musicAllowed: boolean;
    petsAllowed: boolean;
  };
  status: "active" | "full" | "completed" | "cancelled";
  passengers: Array<{
    id: string;
    name: string;
    photo: string;
    joinedAt: string;
  }>;
  createdAt: string;
}

interface StudentCarpoolSystemProps {
  isDarkMode?: boolean;
  currentUser?: {
    id: string;
    name: string;
    email: string;
    branch: string;
    year: string;
    rating: number;
    photo: string;
  };
  onCreateRide?: () => void;
  onJoinRide?: (rideId: string) => void;
}

const StudentCarpoolSystem = ({
  isDarkMode = false,
  currentUser = {
    id: "user_001",
    name: "Arjun Sharma",
    email: "21UCS045@lnmiit.ac.in",
    branch: "Computer Science",
    year: "3rd Year",
    rating: 4.7,
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=arjun",
  },
  onCreateRide = () => {},
  onJoinRide = () => {},
}: StudentCarpoolSystemProps) => {
  const [rides, setRides] = useState<CarpoolRide[]>([]);
  const [filteredRides, setFilteredRides] = useState<CarpoolRide[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "today" | "tomorrow" | "this_week"
  >("all");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRide, setSelectedRide] = useState<CarpoolRide | null>(null);
  const [showRideDetails, setShowRideDetails] = useState(false);
  const [showCreateRide, setShowCreateRide] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatRideId, setChatRideId] = useState<string>("");
  const [chatRideTitle, setChatRideTitle] = useState<string>("");

  // Mock data for demonstration
  const mockRides: CarpoolRide[] = [
    {
      id: "ride_001",
      driverId: "driver_001",
      driverName: "Priya Gupta",
      driverRating: 4.8,
      driverPhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
      driverBranch: "Mechanical Engineering",
      driverYear: "4th Year",
      from: "LNMIIT Campus",
      to: "Jaipur Railway Station",
      departureTime: "14:30",
      date: "2024-01-15",
      availableSeats: 2,
      totalSeats: 4,
      pricePerSeat: 80,
      vehicleInfo: {
        make: "Maruti",
        model: "Swift",
        color: "White",
        isAC: true,
      },
      route: ["LNMIIT Campus", "Mahindra SEZ", "Jaipur Railway Station"],
      preferences: {
        gender: "any",
        smokingAllowed: false,
        musicAllowed: true,
        petsAllowed: false,
      },
      status: "active",
      passengers: [
        {
          id: "pass_001",
          name: "Rahul Singh",
          photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=rahul",
          joinedAt: "2024-01-14T10:30:00Z",
        },
      ],
      createdAt: "2024-01-14T09:00:00Z",
    },
    {
      id: "ride_002",
      driverId: "driver_002",
      driverName: "Amit Kumar",
      driverRating: 4.6,
      driverPhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=amit",
      driverBranch: "Electronics & Communication",
      driverYear: "3rd Year",
      from: "Jaipur City Mall",
      to: "LNMIIT Campus",
      departureTime: "09:00",
      date: "2024-01-16",
      availableSeats: 3,
      totalSeats: 4,
      pricePerSeat: 60,
      vehicleInfo: {
        make: "Honda",
        model: "City",
        color: "Silver",
        isAC: true,
      },
      route: ["Jaipur City Mall", "C-Scheme", "Mahindra SEZ", "LNMIIT Campus"],
      preferences: {
        gender: "any",
        smokingAllowed: false,
        musicAllowed: true,
        petsAllowed: false,
      },
      status: "active",
      passengers: [],
      createdAt: "2024-01-14T15:20:00Z",
    },
    {
      id: "ride_003",
      driverId: "driver_003",
      driverName: "Sneha Patel",
      driverRating: 4.9,
      driverPhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=sneha",
      driverBranch: "Computer Science",
      driverYear: "2nd Year",
      from: "LNMIIT Campus",
      to: "Pink City Metro Station",
      departureTime: "18:00",
      date: "2024-01-15",
      availableSeats: 1,
      totalSeats: 4,
      pricePerSeat: 70,
      vehicleInfo: {
        make: "Hyundai",
        model: "i20",
        color: "Red",
        isAC: true,
      },
      route: ["LNMIIT Campus", "Mahindra SEZ", "Jagatpura", "Pink City Metro"],
      preferences: {
        gender: "female",
        smokingAllowed: false,
        musicAllowed: true,
        petsAllowed: false,
      },
      status: "active",
      passengers: [
        {
          id: "pass_002",
          name: "Ananya Sharma",
          photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=ananya",
          joinedAt: "2024-01-14T12:15:00Z",
        },
        {
          id: "pass_003",
          name: "Kavya Singh",
          photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=kavya",
          joinedAt: "2024-01-14T13:45:00Z",
        },
      ],
      createdAt: "2024-01-14T11:30:00Z",
    },
  ];

  useEffect(() => {
    setRides(mockRides);
    setFilteredRides(mockRides);
    // Connect to Socket.IO when component mounts
    socketService.connect(currentUser.id);

    return () => {
      socketService.disconnect();
    };
  }, []);

  useEffect(() => {
    let filtered = rides;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (ride) =>
          ride.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ride.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ride.driverName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Date filter
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    switch (selectedFilter) {
      case "today":
        filtered = filtered.filter(
          (ride) => new Date(ride.date).toDateString() === today.toDateString()
        );
        break;
      case "tomorrow":
        filtered = filtered.filter(
          (ride) =>
            new Date(ride.date).toDateString() === tomorrow.toDateString()
        );
        break;
      case "this_week":
        filtered = filtered.filter((ride) => new Date(ride.date) <= nextWeek);
        break;
    }

    setFilteredRides(filtered);
  }, [searchQuery, selectedFilter, rides]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleFilterSelect = (filterKey: string, filterLabel: string) => {
    setSelectedFilter(filterKey as any);
    console.log(`Filter applied: ${filterLabel}`);
  };

  const handleJoinRide = (rideId: string) => {
    console.log(`Joining ride: ${rideId}`);
    onJoinRide(rideId);
  };

  const handleStartChat = (rideId: string, rideTitle: string) => {
    setChatRideId(rideId);
    setChatRideTitle(rideTitle);
    setShowChat(true);
    setShowRideDetails(false);
  };

  const handleCreateRide = () => {
    setShowCreateRide(true);
  };

  const handleRideCreated = (rideData: any) => {
    setRides((prev) => [rideData, ...prev]);
    setShowCreateRide(false);
  };

  const handleRideCardPress = (ride: CarpoolRide) => {
    setSelectedRide(ride);
    setShowRideDetails(true);
  };

  const handleBackFromDetails = () => {
    setShowRideDetails(false);
    setSelectedRide(null);
  };

  const renderRideCard = (ride: CarpoolRide) => {
    const isDriverCurrentUser = ride.driverId === currentUser.id;
    const hasJoined = ride.passengers.some((p) => p.id === currentUser.id);

    return (
      <TouchableOpacity
        key={ride.id}
        style={[
          styles.rideCard,
          { backgroundColor: isDarkMode ? "#1A1A1A" : "#FFFFFF" },
        ]}
        onPress={() => handleRideCardPress(ride)}
      >
        {/* Driver Info */}
        <View style={styles.driverSection}>
          <Avatar.Image size={50} source={{ uri: ride.driverPhoto }} />
          <View style={styles.driverInfo}>
            <View style={styles.driverHeader}>
              <Text
                style={[
                  styles.driverName,
                  { color: isDarkMode ? "#FFFFFF" : "#000000" },
                ]}
              >
                {ride.driverName}
              </Text>
              <View style={styles.ratingContainer}>
                <Star size={14} color="#F59E0B" fill="#F59E0B" />
                <Text
                  style={[
                    styles.rating,
                    { color: isDarkMode ? "#CCCCCC" : "#666666" },
                  ]}
                >
                  {ride.driverRating}
                </Text>
              </View>
            </View>
            <Text
              style={[
                styles.driverDetails,
                { color: isDarkMode ? "#CCCCCC" : "#666666" },
              ]}
            >
              {ride.driverBranch} • {ride.driverYear}
            </Text>
            <Text
              style={[
                styles.vehicleInfo,
                { color: isDarkMode ? "#CCCCCC" : "#666666" },
              ]}
            >
              {ride.vehicleInfo.make} {ride.vehicleInfo.model} •{" "}
              {ride.vehicleInfo.color} •{" "}
              {ride.vehicleInfo.isAC ? "AC" : "Non-AC"}
            </Text>
          </View>
        </View>

        {/* Route Info */}
        <View style={styles.routeSection}>
          <View style={styles.routePoint}>
            <MapPin size={16} color="#10B981" />
            <Text
              style={[
                styles.locationText,
                { color: isDarkMode ? "#FFFFFF" : "#000000" },
              ]}
            >
              {ride.from}
            </Text>
          </View>
          <View style={styles.routeLine}>
            <ArrowRight size={16} color={isDarkMode ? "#666666" : "#CCCCCC"} />
          </View>
          <View style={styles.routePoint}>
            <MapPin size={16} color="#EF4444" />
            <Text
              style={[
                styles.locationText,
                { color: isDarkMode ? "#FFFFFF" : "#000000" },
              ]}
            >
              {ride.to}
            </Text>
          </View>
        </View>

        {/* Ride Details */}
        <View style={styles.rideDetails}>
          <View style={styles.detailItem}>
            <Calendar size={16} color={isDarkMode ? "#CCCCCC" : "#666666"} />
            <Text
              style={[
                styles.detailText,
                { color: isDarkMode ? "#CCCCCC" : "#666666" },
              ]}
            >
              {new Date(ride.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Clock size={16} color={isDarkMode ? "#CCCCCC" : "#666666"} />
            <Text
              style={[
                styles.detailText,
                { color: isDarkMode ? "#CCCCCC" : "#666666" },
              ]}
            >
              {ride.departureTime}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Users size={16} color={isDarkMode ? "#CCCCCC" : "#666666"} />
            <Text
              style={[
                styles.detailText,
                { color: isDarkMode ? "#CCCCCC" : "#666666" },
              ]}
            >
              {ride.availableSeats}/{ride.totalSeats} seats
            </Text>
          </View>
          <View style={styles.detailItem}>
            <DollarSign size={16} color={isDarkMode ? "#CCCCCC" : "#666666"} />
            <Text
              style={[
                styles.priceText,
                { color: isDarkMode ? "#FFFFFF" : "#000000" },
              ]}
            >
              ₹{ride.pricePerSeat}
            </Text>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.preferencesSection}>
          {ride.preferences.gender && ride.preferences.gender !== "any" && (
            <Chip
              compact
              textStyle={{ fontSize: 10 }}
              style={[
                styles.preferenceChip,
                { backgroundColor: isDarkMode ? "#333333" : "#F5F5F5" },
              ]}
            >
              {ride.preferences.gender === "female"
                ? "👩 Women only"
                : "👨 Men only"}
            </Chip>
          )}
          {!ride.preferences.smokingAllowed && (
            <Chip
              compact
              textStyle={{ fontSize: 10 }}
              style={[
                styles.preferenceChip,
                { backgroundColor: isDarkMode ? "#333333" : "#F5F5F5" },
              ]}
            >
              🚭 No smoking
            </Chip>
          )}
          {ride.preferences.musicAllowed && (
            <Chip
              compact
              textStyle={{ fontSize: 10 }}
              style={[
                styles.preferenceChip,
                { backgroundColor: isDarkMode ? "#333333" : "#F5F5F5" },
              ]}
            >
              🎵 Music OK
            </Chip>
          )}
        </View>

        {/* Passengers */}
        {ride.passengers.length > 0 && (
          <View style={styles.passengersSection}>
            <Text
              style={[
                styles.passengersTitle,
                { color: isDarkMode ? "#CCCCCC" : "#666666" },
              ]}
            >
              Passengers:
            </Text>
            <View style={styles.passengersList}>
              {ride.passengers.map((passenger) => (
                <View key={passenger.id} style={styles.passengerItem}>
                  <Avatar.Image size={24} source={{ uri: passenger.photo }} />
                  <Text
                    style={[
                      styles.passengerName,
                      { color: isDarkMode ? "#CCCCCC" : "#666666" },
                    ]}
                  >
                    {passenger.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {!isDriverCurrentUser && !hasJoined && ride.availableSeats > 0 && (
            <>
              <Button
                title="Contact"
                onPress={() => console.log(`Contact ${ride.driverName}`)}
                variant="outline"
                size="small"
                style={styles.actionButton}
              />
              <Button
                title="Join Ride"
                onPress={() => handleJoinRide(ride.id)}
                variant="primary"
                size="small"
                style={styles.actionButton}
              />
            </>
          )}
          {hasJoined && (
            <Button
              title="Already Joined"
              onPress={() => {}}
              variant="outline"
              size="small"
              disabled
              style={styles.actionButton}
            />
          )}
          {isDriverCurrentUser && (
            <Button
              title="Manage Ride"
              onPress={() => {
                console.log(`Managing ride: ${ride.id}`);
                // TODO: Implement ride management
              }}
              variant="outline"
              size="small"
              style={styles.actionButton}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#000000" : "#F5F5F5" },
      ]}
    >
      {/* Search and Filters */}
      <View style={styles.searchSection}>
        <Searchbar
          placeholder="Search by location or driver..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[
            styles.searchBar,
            { backgroundColor: isDarkMode ? "#1A1A1A" : "#FFFFFF" },
          ]}
          inputStyle={{ color: isDarkMode ? "#FFFFFF" : "#000000" }}
          iconColor={isDarkMode ? "#CCCCCC" : "#666666"}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
        >
          {[
            { key: "all", label: "All Rides" },
            { key: "today", label: "Today" },
            { key: "tomorrow", label: "Tomorrow" },
            { key: "this_week", label: "This Week" },
          ].map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterChip,
                {
                  backgroundColor:
                    selectedFilter === filter.key
                      ? "#000000"
                      : isDarkMode
                      ? "#1A1A1A"
                      : "#FFFFFF",
                },
              ]}
              onPress={() => handleFilterSelect(filter.key, filter.label)}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color:
                      selectedFilter === filter.key
                        ? "#FFFFFF"
                        : isDarkMode
                        ? "#CCCCCC"
                        : "#666666",
                  },
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Rides List */}
      <ScrollView
        style={styles.ridesList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#000000"]}
            tintColor={isDarkMode ? "#FFFFFF" : "#000000"}
          />
        }
      >
        {filteredRides.length > 0 ? (
          filteredRides.map(renderRideCard)
        ) : (
          <View style={styles.emptyState}>
            <Car size={50} color={isDarkMode ? "#666666" : "#CCCCCC"} />
            <Text
              style={[
                styles.emptyTitle,
                { color: isDarkMode ? "#FFFFFF" : "#000000" },
              ]}
            >
              No rides found
            </Text>
            <Text
              style={[
                styles.emptySubtitle,
                { color: isDarkMode ? "#CCCCCC" : "#666666" },
              ]}
            >
              Try adjusting your search or create a new ride
            </Text>
          </View>
        )}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Floating Create Ride Button */}
      <TouchableOpacity
        style={[
          styles.floatingButton,
          {
            backgroundColor: isDarkMode ? "#FFFFFF" : "#000000",
            shadowColor: isDarkMode ? "#FFFFFF" : "#000000",
          },
        ]}
        onPress={handleCreateRide}
      >
        <Plus size={24} color={isDarkMode ? "#000000" : "#FFFFFF"} />
      </TouchableOpacity>

      {/* Ride Details Modal */}
      {showRideDetails && selectedRide && (
        <RideDetailsScreen
          ride={selectedRide}
          currentUser={currentUser}
          visible={showRideDetails}
          onBack={handleBackFromDetails}
          onJoinRide={handleJoinRide}
          onStartChat={handleStartChat}
        />
      )}

      {/* Create Ride Modal */}
      {showCreateRide && (
        <CreateRideScreen
          onBack={() => setShowCreateRide(false)}
          onRideCreated={handleRideCreated}
        />
      )}

      {/* Chat Modal */}
      {showChat && (
        <ChatScreen
          rideId={chatRideId}
          currentUserId={currentUser.id}
          currentUserName={currentUser.name}
          rideTitle={chatRideTitle}
          onBack={() => setShowChat(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  searchBar: {
    elevation: 2,
    borderRadius: 12,
    marginBottom: 12,
  },
  filtersContainer: {
    flexDirection: "row",
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  filterText: {
    fontSize: 12,
    fontWeight: "500",
  },
  ridesList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  rideCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  driverSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  driverInfo: {
    flex: 1,
    marginLeft: 12,
  },
  driverHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  driverName: {
    fontSize: 16,
    fontWeight: "600",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 12,
    marginLeft: 4,
  },
  driverDetails: {
    fontSize: 12,
    marginTop: 2,
  },
  vehicleInfo: {
    fontSize: 11,
    marginTop: 1,
  },
  routeSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 8,
  },
  routePoint: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  locationText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
  routeLine: {
    paddingHorizontal: 12,
  },
  rideDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontSize: 12,
    marginLeft: 4,
  },
  priceText: {
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 4,
  },
  preferencesSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  preferenceChip: {
    marginRight: 8,
    marginBottom: 4,
  },
  passengersSection: {
    marginBottom: 12,
  },
  passengersTitle: {
    fontSize: 12,
    marginBottom: 8,
  },
  passengersList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  passengerItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    marginBottom: 4,
  },
  passengerName: {
    fontSize: 11,
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  actionButton: {
    minWidth: 80,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
  },
  floatingButton: {
    position: "absolute",
    bottom: 90,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

StudentCarpoolSystem.displayName = "StudentCarpoolSystem";

export default StudentCarpoolSystem;
