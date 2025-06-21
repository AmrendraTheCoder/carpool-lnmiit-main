import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
  Dimensions,
} from "react-native";
import {
  MapPin,
  Calendar,
  Clock,
  Search,
  ChevronRight,
  Bus,
  Users,
  ArrowRight,
  CheckCircle,
} from "lucide-react-native";

interface BusSchedule {
  id: string;
  routeName: string;
  departureTime: string;
  arrivalTime: string;
  origin: string;
  destination: string;
  availableSeats: number;
  totalSeats: number;
  price: number;
}

interface Seat {
  id: number;
  number: string;
  isAvailable: boolean;
  isSelected: boolean;
}

interface BusBookingSystemProps {
  schedules?: BusSchedule[];
  onBookBus?: (busId: string, seatIds: number[]) => void;
  isDarkMode?: boolean;
}

const { width } = Dimensions.get("window");

const BusBookingSystem: React.FC<BusBookingSystemProps> = ({
  schedules = [
    {
      id: "1",
      routeName: "Campus to City Center",
      departureTime: "08:00 AM",
      arrivalTime: "08:45 AM",
      origin: "LNMIIT Campus",
      destination: "Jaipur City Center",
      availableSeats: 28,
      totalSeats: 40,
      price: 50,
    },
    {
      id: "2",
      routeName: "Campus to Railway Station",
      departureTime: "09:30 AM",
      arrivalTime: "10:15 AM",
      origin: "LNMIIT Campus",
      destination: "Jaipur Railway Station",
      availableSeats: 15,
      totalSeats: 40,
      price: 60,
    },
    {
      id: "3",
      routeName: "City Center to Campus",
      departureTime: "05:00 PM",
      arrivalTime: "05:45 PM",
      origin: "Jaipur City Center",
      destination: "LNMIIT Campus",
      availableSeats: 22,
      totalSeats: 40,
      price: 50,
    },
    {
      id: "4",
      routeName: "Railway Station to Campus",
      departureTime: "06:30 PM",
      arrivalTime: "07:15 PM",
      origin: "Jaipur Railway Station",
      destination: "LNMIIT Campus",
      availableSeats: 18,
      totalSeats: 40,
      price: 60,
    },
  ],
  onBookBus = () => {},
  isDarkMode = false,
}) => {
  const [activeTab, setActiveTab] = useState<
    "schedules" | "selection" | "ticket"
  >("schedules");
  const [selectedBus, setSelectedBus] = useState<BusSchedule | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Generate mock seats data
  const generateSeats = (): Seat[] => {
    const seats: Seat[] = [];
    for (let i = 1; i <= 40; i++) {
      const seatNumber = i < 10 ? `0${i}` : `${i}`;
      const isAvailable = Math.random() > 0.3;
      seats.push({
        id: i,
        number: seatNumber,
        isAvailable,
        isSelected: false,
      });
    }
    return seats;
  };

  const [seats, setSeats] = useState<Seat[]>(generateSeats());

  const handleBusSelect = (bus: BusSchedule) => {
    setSelectedBus(bus);
    setActiveTab("selection");
    setSelectedSeats([]);
    setSeats(generateSeats());
  };

  const handleSeatSelect = (seatId: number) => {
    const updatedSeats = seats.map((seat) => {
      if (seat.id === seatId && seat.isAvailable) {
        return { ...seat, isSelected: !seat.isSelected };
      }
      return seat;
    });

    setSeats(updatedSeats);

    const newSelectedSeats = updatedSeats
      .filter((seat) => seat.isSelected)
      .map((seat) => seat.id);

    setSelectedSeats(newSelectedSeats);
  };

  const handleBooking = () => {
    if (selectedBus && selectedSeats.length > 0) {
      onBookBus(selectedBus.id, selectedSeats);
      setActiveTab("ticket");
    }
  };

  const filteredSchedules = schedules.filter(
    (schedule) =>
      schedule.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generateSeatLayout = () => {
    const seatLayout = [];
    const rows = 12; // Typical bus rows
    const seatsPerRow = 4; // 2+2 configuration

    for (let row = 1; row <= rows; row++) {
      const rowSeats = [];
      for (let seat = 1; seat <= seatsPerRow; seat++) {
        const seatNumber = `${row}${String.fromCharCode(64 + seat)}`; // 1A, 1B, 1C, 1D
        const isBooked = Math.random() > 0.7; // Random booking status
        const isSelected = selectedSeats.includes(seatNumber);

        rowSeats.push({
          id: seatNumber,
          row,
          position: seat,
          isBooked,
          isSelected,
          isAisle: seat === 2, // Aisle after second seat
        });
      }
      seatLayout.push(rowSeats);
    }
    return seatLayout;
  };

  const seatLayout = generateSeatLayout();

  const renderSeat = (seat: any) => {
    const getSeatColor = () => {
      if (seat.isSelected) return "#4CAF50"; // Green for selected
      if (seat.isBooked) return "#FF5722"; // Red for booked
      return isDarkMode ? "#2A2A2A" : "#F0F0F0"; // Available
    };

    const getSeatBorderColor = () => {
      if (seat.isSelected) return "#388E3C";
      if (seat.isBooked) return "#D32F2F";
      return isDarkMode ? "#404040" : "#D0D0D0";
    };

    return (
      <View key={seat.id} style={styles.seatContainer}>
        <TouchableOpacity
          style={[
            styles.seat,
            {
              backgroundColor: getSeatColor(),
              borderColor: getSeatBorderColor(),
            },
          ]}
          onPress={() => !seat.isBooked && handleSeatSelect(seat.id)}
          disabled={seat.isBooked}
        >
          <Text
            style={[
              styles.seatText,
              {
                color:
                  seat.isSelected || seat.isBooked
                    ? "#FFFFFF"
                    : isDarkMode
                    ? "#FFFFFF"
                    : "#333333",
                fontSize: 10,
                fontWeight: seat.isSelected ? "700" : "500",
              },
            ]}
          >
            {seat.id}
          </Text>
        </TouchableOpacity>
        {seat.isAisle && <View style={styles.aisle} />}
      </View>
    );
  };

  const renderSchedulesList = () => (
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
          Bus Schedules
        </Text>
        <Text
          style={[
            styles.headerSubtitle,
            { color: isDarkMode ? "#CCCCCC" : "#666666" },
          ]}
        >
          Choose your preferred route
        </Text>

        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: isDarkMode ? "#1A1A1A" : "#F5F5F5",
              borderColor: isDarkMode ? "#333333" : "#E0E0E0",
            },
          ]}
        >
          <Search size={20} color={isDarkMode ? "#CCCCCC" : "#666666"} />
          <TextInput
            style={[
              styles.searchInput,
              { color: isDarkMode ? "#FFFFFF" : "#000000" },
            ]}
            placeholder="Search routes, destinations..."
            placeholderTextColor={isDarkMode ? "#CCCCCC" : "#666666"}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.schedulesContainer}>
          {filteredSchedules.length > 0 ? (
            filteredSchedules.map((bus) => (
              <TouchableOpacity
                key={bus.id}
                style={[
                  styles.scheduleCard,
                  {
                    backgroundColor: isDarkMode ? "#1A1A1A" : "#FFFFFF",
                    borderColor: isDarkMode ? "#333333" : "#E0E0E0",
                  },
                ]}
                onPress={() => handleBusSelect(bus)}
              >
                <View style={styles.scheduleHeader}>
                  <View
                    style={[
                      styles.busIcon,
                      { backgroundColor: isDarkMode ? "#333333" : "#F5F5F5" },
                    ]}
                  >
                    <Bus size={20} color={isDarkMode ? "#FFFFFF" : "#000000"} />
                  </View>
                  <View style={styles.routeInfo}>
                    <Text
                      style={[
                        styles.routeName,
                        { color: isDarkMode ? "#FFFFFF" : "#000000" },
                      ]}
                    >
                      {bus.routeName}
                    </Text>
                    <View style={styles.routeDetails}>
                      <MapPin
                        size={14}
                        color={isDarkMode ? "#CCCCCC" : "#666666"}
                      />
                      <Text
                        style={[
                          styles.routeText,
                          { color: isDarkMode ? "#CCCCCC" : "#666666" },
                        ]}
                      >
                        {bus.origin} → {bus.destination}
                      </Text>
                    </View>
                  </View>
                  <ChevronRight
                    size={20}
                    color={isDarkMode ? "#CCCCCC" : "#666666"}
                  />
                </View>

                <View style={styles.scheduleDetails}>
                  <View style={styles.timeContainer}>
                    <View style={styles.timeItem}>
                      <Text
                        style={[
                          styles.timeLabel,
                          { color: isDarkMode ? "#CCCCCC" : "#666666" },
                        ]}
                      >
                        Departure
                      </Text>
                      <Text
                        style={[
                          styles.timeValue,
                          { color: isDarkMode ? "#FFFFFF" : "#000000" },
                        ]}
                      >
                        {bus.departureTime}
                      </Text>
                    </View>
                    <ArrowRight
                      size={16}
                      color={isDarkMode ? "#CCCCCC" : "#666666"}
                    />
                    <View style={styles.timeItem}>
                      <Text
                        style={[
                          styles.timeLabel,
                          { color: isDarkMode ? "#CCCCCC" : "#666666" },
                        ]}
                      >
                        Arrival
                      </Text>
                      <Text
                        style={[
                          styles.timeValue,
                          { color: isDarkMode ? "#FFFFFF" : "#000000" },
                        ]}
                      >
                        {bus.arrivalTime}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.bottomInfo}>
                    <View style={styles.seatsInfo}>
                      <Users
                        size={14}
                        color={isDarkMode ? "#CCCCCC" : "#666666"}
                      />
                      <Text
                        style={[
                          styles.seatsText,
                          { color: isDarkMode ? "#CCCCCC" : "#666666" },
                        ]}
                      >
                        {bus.availableSeats}/{bus.totalSeats} seats
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.price,
                        { color: isDarkMode ? "#FFFFFF" : "#000000" },
                      ]}
                    >
                      ₹{bus.price}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Bus size={48} color={isDarkMode ? "#666666" : "#CCCCCC"} />
              <Text
                style={[
                  styles.emptyText,
                  { color: isDarkMode ? "#CCCCCC" : "#666666" },
                ]}
              >
                No routes found
              </Text>
            </View>
          )}
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );

  const renderSeatSelection = () => (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#000000" : "#FFFFFF" },
      ]}
    >
      <View
        style={[
          styles.header,
          {
            backgroundColor: isDarkMode ? "#000000" : "#FFFFFF",
            borderBottomColor: isDarkMode ? "#333333" : "#E0E0E0",
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => setActiveTab("schedules")}
          style={styles.backButton}
        >
          <Text
            style={[
              styles.backText,
              { color: isDarkMode ? "#FFFFFF" : "#000000" },
            ]}
          >
            ← Back
          </Text>
        </TouchableOpacity>
        <Text
          style={[
            styles.headerTitle,
            { color: isDarkMode ? "#FFFFFF" : "#000000" },
          ]}
        >
          Select Seats
        </Text>
        <Text
          style={[
            styles.headerSubtitle,
            { color: isDarkMode ? "#CCCCCC" : "#666666" },
          ]}
        >
          {selectedBus?.routeName}
        </Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.seatMapContainer}>
          <View style={styles.seatLegend}>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendSeat,
                  { backgroundColor: isDarkMode ? "#1A1A1A" : "#F5F5F5" },
                ]}
              />
              <Text
                style={[
                  styles.legendText,
                  { color: isDarkMode ? "#CCCCCC" : "#666666" },
                ]}
              >
                Available
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendSeat,
                  { backgroundColor: isDarkMode ? "#FFFFFF" : "#000000" },
                ]}
              />
              <Text
                style={[
                  styles.legendText,
                  { color: isDarkMode ? "#CCCCCC" : "#666666" },
                ]}
              >
                Selected
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendSeat, { backgroundColor: "#666666" }]}
              />
              <Text
                style={[
                  styles.legendText,
                  { color: isDarkMode ? "#CCCCCC" : "#666666" },
                ]}
              >
                Occupied
              </Text>
            </View>
          </View>

          <View style={styles.seatGrid}>
            {seatLayout.map((row, rowIndex) => (
              <View key={`row-${rowIndex}`} style={styles.row}>
                {row.map((seat) => renderSeat(seat))}
              </View>
            ))}
          </View>

          {/* Seat Legend */}
          <View
            style={[
              styles.seatLegend,
              { borderTopColor: isDarkMode ? "#333333" : "#E0E0E0" },
            ]}
          >
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendSeat,
                  {
                    backgroundColor: "#F0F0F0",
                    borderColor: "#D0D0D0",
                    borderWidth: 1,
                  },
                ]}
              />
              <Text
                style={[
                  styles.legendText,
                  { color: isDarkMode ? "#FFFFFF" : "#000000" },
                ]}
              >
                Available
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendSeat, { backgroundColor: "#4CAF50" }]}
              />
              <Text
                style={[
                  styles.legendText,
                  { color: isDarkMode ? "#FFFFFF" : "#000000" },
                ]}
              >
                Selected
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendSeat, { backgroundColor: "#FF5722" }]}
              />
              <Text
                style={[
                  styles.legendText,
                  { color: isDarkMode ? "#FFFFFF" : "#000000" },
                ]}
              >
                Booked
              </Text>
            </View>
          </View>
        </View>

        {selectedSeats.length > 0 && (
          <View
            style={[
              styles.bookingFooter,
              { backgroundColor: isDarkMode ? "#1A1A1A" : "#F5F5F5" },
            ]}
          >
            <View style={styles.bookingInfo}>
              <Text
                style={[
                  styles.selectedSeatsText,
                  { color: isDarkMode ? "#FFFFFF" : "#000000" },
                ]}
              >
                {selectedSeats.length} seat{selectedSeats.length > 1 ? "s" : ""}{" "}
                selected
              </Text>
              <Text
                style={[
                  styles.totalPrice,
                  { color: isDarkMode ? "#FFFFFF" : "#000000" },
                ]}
              >
                Total: ₹{(selectedBus?.price || 0) * selectedSeats.length}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.bookButton,
                { backgroundColor: isDarkMode ? "#FFFFFF" : "#000000" },
              ]}
              onPress={handleBooking}
            >
              <Text
                style={[
                  styles.bookButtonText,
                  { color: isDarkMode ? "#000000" : "#FFFFFF" },
                ]}
              >
                Book Now
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );

  const renderTicket = () => (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#000000" : "#FFFFFF" },
      ]}
    >
      <View style={styles.ticketContainer}>
        <View
          style={[
            styles.ticketCard,
            {
              backgroundColor: isDarkMode ? "#1A1A1A" : "#FFFFFF",
              borderColor: isDarkMode ? "#333333" : "#E0E0E0",
            },
          ]}
        >
          <View style={styles.ticketHeader}>
            <CheckCircle size={48} color="#00AA00" />
            <Text
              style={[
                styles.ticketTitle,
                { color: isDarkMode ? "#FFFFFF" : "#000000" },
              ]}
            >
              Booking Confirmed!
            </Text>
          </View>

          <View style={styles.ticketDetails}>
            <Text
              style={[
                styles.ticketRoute,
                { color: isDarkMode ? "#FFFFFF" : "#000000" },
              ]}
            >
              {selectedBus?.routeName}
            </Text>
            <Text
              style={[
                styles.ticketTime,
                { color: isDarkMode ? "#CCCCCC" : "#666666" },
              ]}
            >
              {selectedBus?.departureTime} - {selectedBus?.arrivalTime}
            </Text>
            <Text
              style={[
                styles.ticketSeats,
                { color: isDarkMode ? "#CCCCCC" : "#666666" },
              ]}
            >
              Seats: {selectedSeats.join(", ")}
            </Text>
            <Text
              style={[
                styles.ticketPrice,
                { color: isDarkMode ? "#FFFFFF" : "#000000" },
              ]}
            >
              Total: ₹{(selectedBus?.price || 0) * selectedSeats.length}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.newBookingButton,
              { backgroundColor: isDarkMode ? "#FFFFFF" : "#000000" },
            ]}
            onPress={() => {
              setActiveTab("schedules");
              setSelectedBus(null);
              setSelectedSeats([]);
            }}
          >
            <Text
              style={[
                styles.newBookingText,
                { color: isDarkMode ? "#000000" : "#FFFFFF" },
              ]}
            >
              Book Another Ride
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  switch (activeTab) {
    case "selection":
      return renderSeatSelection();
    case "ticket":
      return renderTicket();
    default:
      return renderSchedulesList();
  }
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
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  schedulesContainer: {
    padding: 20,
    gap: 16,
  },
  scheduleCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
  scheduleHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  busIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  routeDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  routeText: {
    marginLeft: 4,
    fontSize: 14,
  },
  scheduleDetails: {
    gap: 16,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeItem: {
    alignItems: "center",
  },
  timeLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  bottomInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  seatsInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  seatsText: {
    marginLeft: 4,
    fontSize: 14,
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
  },
  backButton: {
    marginBottom: 10,
  },
  backText: {
    fontSize: 16,
    fontWeight: "600",
  },
  seatMapContainer: {
    padding: 20,
  },
  seatLegend: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
  },
  legendItem: {
    alignItems: "center",
  },
  legendSeat: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginBottom: 4,
  },
  legendText: {
    fontSize: 12,
  },
  seatGrid: {
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  seat: {
    width: (width - 80) / 4,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  seatLegend: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    marginTop: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendSeat: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    fontWeight: "500",
  },
  bookingFooter: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bookingInfo: {
    flex: 1,
  },
  selectedSeatsText: {
    fontSize: 14,
    marginBottom: 4,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "700",
  },
  bookButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  ticketContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  ticketCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 30,
    alignItems: "center",
  },
  ticketHeader: {
    alignItems: "center",
    marginBottom: 30,
  },
  ticketTitle: {
    fontSize: 24,
    fontWeight: "800",
    marginTop: 16,
  },
  ticketDetails: {
    alignItems: "center",
    marginBottom: 30,
    gap: 8,
  },
  ticketRoute: {
    fontSize: 20,
    fontWeight: "700",
  },
  ticketTime: {
    fontSize: 16,
  },
  ticketSeats: {
    fontSize: 16,
  },
  ticketPrice: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 8,
  },
  newBookingButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  newBookingText: {
    fontSize: 16,
    fontWeight: "600",
  },
  seatContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  seat: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2,
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  seatText: {
    fontSize: 10,
    fontWeight: "500",
  },
  aisle: {
    width: 20,
    height: 36,
    marginHorizontal: 4,
  },
});

export default BusBookingSystem;
