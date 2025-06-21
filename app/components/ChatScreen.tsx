import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { socketService, ChatMessage } from "../services/SocketService";

interface ChatScreenProps {
  rideId: string;
  currentUserId: string;
  currentUserName: string;
  onBack: () => void;
  rideTitle: string;
}

export default function ChatScreen({
  rideId,
  currentUserId,
  currentUserName,
  onBack,
  rideTitle,
}: ChatScreenProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Connect to socket and join ride chat
    socketService.connect(currentUserId);
    socketService.joinRideChat(rideId);
    setIsConnected(true);

    // Listen for new messages
    socketService.onNewMessage((message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    // Load existing messages (mock data for now)
    loadExistingMessages();

    return () => {
      socketService.offNewMessage();
      socketService.leaveRideChat(rideId);
    };
  }, [rideId, currentUserId]);

  const loadExistingMessages = () => {
    // Mock existing messages
    const mockMessages: ChatMessage[] = [
      {
        id: "1",
        senderId: "driver123",
        senderName: "Rahul Kumar",
        message: "Hey everyone! I'll be starting from LNMIIT at 2 PM sharp.",
        timestamp: new Date(Date.now() - 3600000),
        rideId,
        senderPhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=rahul",
      },
      {
        id: "2",
        senderId: "user456",
        senderName: "Priya Sharma",
        message: "Perfect! I'll be ready at the main gate.",
        timestamp: new Date(Date.now() - 3000000),
        rideId,
        senderPhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
      },
      {
        id: "3",
        senderId: "driver123",
        senderName: "Rahul Kumar",
        message: "Great! Don't forget to bring your ID cards.",
        timestamp: new Date(Date.now() - 2400000),
        rideId,
        senderPhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=rahul",
      },
    ];
    setMessages(mockMessages);
  };

  const sendMessage = () => {
    if (!inputText.trim() || !isConnected) return;

    const messageData = {
      senderId: currentUserId,
      senderName: currentUserName,
      message: inputText.trim(),
      rideId,
    };

    socketService.sendMessage(messageData);
    setInputText("");
  };

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isOwnMessage = item.senderId === currentUserId;

    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: isOwnMessage ? "flex-end" : "flex-start",
          marginVertical: 4,
          marginHorizontal: 16,
        }}
      >
        {!isOwnMessage && (
          <Image
            source={{
              uri:
                item.senderPhoto ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.senderId}`,
            }}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              marginRight: 8,
              alignSelf: "flex-end",
            }}
          />
        )}
        <View
          style={{
            maxWidth: "75%",
            backgroundColor: isOwnMessage ? "#000" : "#F5F5F5",
            borderRadius: 16,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderBottomRightRadius: isOwnMessage ? 4 : 16,
            borderBottomLeftRadius: isOwnMessage ? 16 : 4,
          }}
        >
          {!isOwnMessage && (
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: "#666",
                marginBottom: 2,
              }}
            >
              {item.senderName}
            </Text>
          )}
          <Text
            style={{
              fontSize: 16,
              color: isOwnMessage ? "#FFF" : "#000",
              lineHeight: 20,
            }}
          >
            {item.message}
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: isOwnMessage ? "#CCC" : "#888",
              marginTop: 4,
              textAlign: "right",
            }}
          >
            {formatTime(item.timestamp)}
          </Text>
        </View>
        {isOwnMessage && (
          <Image
            source={{
              uri: `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUserId}`,
            }}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              marginLeft: 8,
              alignSelf: "flex-end",
            }}
          />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 12,
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
            marginRight: 12,
          }}
        >
          <Ionicons name="arrow-back" size={20} color="#FFF" />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: "#FFF",
            }}
          >
            {rideTitle}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#CCC",
              marginTop: 2,
            }}
          >
            {isConnected ? "Connected" : "Connecting..."}
          </Text>
        </View>

        <TouchableOpacity
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "rgba(255,255,255,0.1)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="call" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={{ flex: 1, backgroundColor: "#FFF" }}
        contentContainerStyle={{ paddingVertical: 8 }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }}
      />

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          backgroundColor: "#FFF",
          borderTopWidth: 1,
          borderTopColor: "#E0E0E0",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 12,
            paddingBottom: Platform.OS === "ios" ? 34 : 12,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#F5F5F5",
              borderRadius: 24,
              paddingHorizontal: 16,
              paddingVertical: 12,
              marginRight: 12,
            }}
          >
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              placeholderTextColor="#888"
              style={{
                flex: 1,
                fontSize: 16,
                color: "#000",
                maxHeight: 100,
              }}
              multiline
              textAlignVertical="center"
            />
          </View>

          <TouchableOpacity
            onPress={sendMessage}
            disabled={!inputText.trim() || !isConnected}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor:
                inputText.trim() && isConnected ? "#000" : "#CCC",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="send" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
