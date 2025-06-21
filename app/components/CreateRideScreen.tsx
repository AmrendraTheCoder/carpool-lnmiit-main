import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Platform,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

interface CreateRideScreenProps {
  onBack: () => void;
  onRideCreated: (rideData: any) => void;
}

export default function CreateRideScreen({
  onBack,
  onRideCreated,
}: CreateRideScreenProps) {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: new Date(),
    time: new Date(),
    availableSeats: "3",
    pricePerSeat: "",
    carModel: "",
    carNumber: "",
    description: "",
    preferences: {
      smoking: false,
      pets: false,
      music: true,
      airConditioning: true,
    },
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateRide = async () => {
    // Validation
    if (
      !formData.from ||
      !formData.to ||
      !formData.pricePerSeat ||
      !formData.carModel ||
      !formData.carNumber
    ) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      // Create ride data
      const rideData = {
        id: Date.now().toString(),
        from: formData.from,
        to: formData.to,
        date: formData.date,
        time: formData.time,
        availableSeats: parseInt(formData.availableSeats),
        totalSeats: parseInt(formData.availableSeats),
        pricePerSeat: parseFloat(formData.pricePerSeat),
        carModel: formData.carModel,
        carNumber: formData.carNumber,
        description: formData.description,
        preferences: formData.preferences,
        driver: {
          id: "current_user",
          name: "You",
          rating: 4.8,
          phone: "+91 9876543210",
          photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=currentuser",
          verified: true,
        },
        passengers: [],
        status: "active",
        createdAt: new Date(),
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      onRideCreated(rideData);
      Alert.alert("Success", "Your ride has been created successfully!");
      onBack();
    } catch (error) {
      Alert.alert("Error", "Failed to create ride. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData((prev) => ({ ...prev, date: selectedDate }));
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setFormData((prev) => ({ ...prev, time: selectedTime }));
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Modal visible={true} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingVertical: 16,
            backgroundColor: "#1A1A1A",
            borderBottomWidth: 1,
            borderBottomColor: "#E0E0E0",
          }}
        >
          <TouchableOpacity
            onPress={onBack}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "rgba(255,255,255,0.1)",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 16,
            }}
          >
            <Ionicons name="arrow-back" size={20} color="#FFF" />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              color: "#FFF",
              flex: 1,
            }}
          >
            Create New Ride
          </Text>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Route Section */}
          <View style={{ padding: 20 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#000",
                marginBottom: 16,
              }}
            >
              Route Details
            </Text>

            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: "#666",
                  marginBottom: 8,
                }}
              >
                From *
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#F5F5F5",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                }}
              >
                <Ionicons
                  name="location"
                  size={20}
                  color="#666"
                  style={{ marginRight: 12 }}
                />
                <TextInput
                  value={formData.from}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, from: text }))
                  }
                  placeholder="Pickup location"
                  placeholderTextColor="#999"
                  style={{ flex: 1, fontSize: 16, color: "#000" }}
                />
              </View>
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: "#666",
                  marginBottom: 8,
                }}
              >
                To *
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#F5F5F5",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                }}
              >
                <Ionicons
                  name="flag"
                  size={20}
                  color="#666"
                  style={{ marginRight: 12 }}
                />
                <TextInput
                  value={formData.to}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, to: text }))
                  }
                  placeholder="Destination"
                  placeholderTextColor="#999"
                  style={{ flex: 1, fontSize: 16, color: "#000" }}
                />
              </View>
            </View>

            {/* Date and Time */}
            <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    color: "#666",
                    marginBottom: 8,
                  }}
                >
                  Date *
                </Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#F5F5F5",
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                  }}
                >
                  <Ionicons
                    name="calendar"
                    size={20}
                    color="#666"
                    style={{ marginRight: 12 }}
                  />
                  <Text style={{ fontSize: 16, color: "#000" }}>
                    {formatDate(formData.date)}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    color: "#666",
                    marginBottom: 8,
                  }}
                >
                  Time *
                </Text>
                <TouchableOpacity
                  onPress={() => setShowTimePicker(true)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#F5F5F5",
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                  }}
                >
                  <Ionicons
                    name="time"
                    size={20}
                    color="#666"
                    style={{ marginRight: 12 }}
                  />
                  <Text style={{ fontSize: 16, color: "#000" }}>
                    {formatTime(formData.time)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Ride Details */}
          <View style={{ padding: 20, paddingTop: 0 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#000",
                marginBottom: 16,
              }}
            >
              Ride Details
            </Text>

            <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    color: "#666",
                    marginBottom: 8,
                  }}
                >
                  Available Seats *
                </Text>
                <View
                  style={{
                    backgroundColor: "#F5F5F5",
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                  }}
                >
                  <TextInput
                    value={formData.availableSeats}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, availableSeats: text }))
                    }
                    placeholder="3"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    style={{ fontSize: 16, color: "#000", textAlign: "center" }}
                  />
                </View>
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    color: "#666",
                    marginBottom: 8,
                  }}
                >
                  Price per Seat *
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#F5F5F5",
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                  }}
                >
                  <Text style={{ fontSize: 16, color: "#666", marginRight: 8 }}>
                    ₹
                  </Text>
                  <TextInput
                    value={formData.pricePerSeat}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, pricePerSeat: text }))
                    }
                    placeholder="150"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    style={{ flex: 1, fontSize: 16, color: "#000" }}
                  />
                </View>
              </View>
            </View>

            {/* Car Details */}
            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: "#666",
                  marginBottom: 8,
                }}
              >
                Car Model *
              </Text>
              <TextInput
                value={formData.carModel}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, carModel: text }))
                }
                placeholder="e.g., Maruti Swift"
                placeholderTextColor="#999"
                style={{
                  backgroundColor: "#F5F5F5",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 16,
                  color: "#000",
                }}
              />
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: "#666",
                  marginBottom: 8,
                }}
              >
                Car Number *
              </Text>
              <TextInput
                value={formData.carNumber}
                onChangeText={(text) =>
                  setFormData((prev) => ({
                    ...prev,
                    carNumber: text.toUpperCase(),
                  }))
                }
                placeholder="RJ14 AB 1234"
                placeholderTextColor="#999"
                autoCapitalize="characters"
                style={{
                  backgroundColor: "#F5F5F5",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 16,
                  color: "#000",
                }}
              />
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: "#666",
                  marginBottom: 8,
                }}
              >
                Additional Notes
              </Text>
              <TextInput
                value={formData.description}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, description: text }))
                }
                placeholder="Any additional information for passengers..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
                style={{
                  backgroundColor: "#F5F5F5",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 16,
                  color: "#000",
                  textAlignVertical: "top",
                }}
              />
            </View>
          </View>

          {/* Preferences */}
          <View style={{ padding: 20, paddingTop: 0 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#000",
                marginBottom: 16,
              }}
            >
              Ride Preferences
            </Text>

            {[
              { key: "music", label: "Music allowed", icon: "musical-notes" },
              { key: "smoking", label: "Smoking allowed", icon: "ban" },
              { key: "pets", label: "Pets allowed", icon: "paw" },
              {
                key: "airConditioning",
                label: "Air conditioning",
                icon: "snow",
              },
            ].map((pref) => (
              <TouchableOpacity
                key={pref.key}
                onPress={() =>
                  setFormData((prev) => ({
                    ...prev,
                    preferences: {
                      ...prev.preferences,
                      [pref.key]:
                        !prev.preferences[
                          pref.key as keyof typeof prev.preferences
                        ],
                    },
                  }))
                }
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  backgroundColor: "#F5F5F5",
                  borderRadius: 12,
                  marginBottom: 8,
                }}
              >
                <Ionicons
                  name={pref.icon as any}
                  size={20}
                  color="#666"
                  style={{ marginRight: 12 }}
                />
                <Text style={{ flex: 1, fontSize: 16, color: "#000" }}>
                  {pref.label}
                </Text>
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: formData.preferences[
                      pref.key as keyof typeof formData.preferences
                    ]
                      ? "#000"
                      : "#DDD",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {formData.preferences[
                    pref.key as keyof typeof formData.preferences
                  ] && <Ionicons name="checkmark" size={16} color="#FFF" />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Create Button */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#FFF",
            paddingHorizontal: 20,
            paddingVertical: 16,
            paddingBottom: Platform.OS === "ios" ? 34 : 16,
            borderTopWidth: 1,
            borderTopColor: "#E0E0E0",
          }}
        >
          <TouchableOpacity
            onPress={handleCreateRide}
            disabled={isLoading}
            style={{
              backgroundColor: isLoading ? "#CCC" : "#000",
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#FFF",
              }}
            >
              {isLoading ? "Creating Ride..." : "Create Ride"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date/Time Pickers */}
        {showDatePicker && (
          <DateTimePicker
            value={formData.date}
            mode="date"
            display="default"
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={formData.time}
            mode="time"
            display="default"
            onChange={onTimeChange}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
}
