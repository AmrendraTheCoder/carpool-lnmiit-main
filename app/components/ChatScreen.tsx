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
  Modal,
  StyleSheet,
  Linking,
  Dimensions,
  StatusBar,
  Animated,
  Vibration,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowLeft,
  Phone,
  Video,
  MoreHorizontal,
  Send,
  Check,
  X,
  User,
  Star,
  MapPin,
  Clock,
  Users,
  CheckCheck,
  Info,
  Smile,
  Paperclip,
  Mic,
  Reply,
  Heart,
  ThumbsUp,
  Laugh,
  Camera,
  Plus,
} from "lucide-react-native";
import { socketService, ChatMessage } from "../services/SocketService";

const { width, height } = Dimensions.get("window");

interface ChatScreenProps {
  rideId: string;
  currentUserId: string;
  currentUserName: string;
  onBack: () => void;
  rideTitle: string;
  isDarkMode?: boolean;
  rideDetails?: {
    from: string;
    to: string;
    departureTime: string;
    date: string;
    driverName: string;
    driverPhone: string;
    driverRating: number;
    driverPhoto: string;
    pricePerSeat: number;
    availableSeats: number;
  };
}

interface InvitationRequest {
  id: string;
  senderName: string;
  senderPhoto: string;
  rideDetails: string;
  timestamp: Date;
}

interface MessageReaction {
  emoji: string;
  count: number;
  users: string[];
}

interface EnhancedChatMessage extends ChatMessage {
  reactions?: MessageReaction[];
  isEdited?: boolean;
  replyTo?: string;
  messageType?: "text" | "image" | "location" | "system";
}

export default function ChatScreen({
  rideId,
  currentUserId,
  currentUserName,
  onBack,
  rideTitle,
  isDarkMode = false,
  rideDetails = {
    from: "LNMIIT Campus",
    to: "Jaipur Railway Station",
    departureTime: "2:30 PM",
    date: "Today",
    driverName: "Ride Creator",
    driverPhone: "+91 98765 43210",
    driverRating: 4.8,
    driverPhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=rahul",
    pricePerSeat: 120,
    availableSeats: 2,
  },
}: ChatScreenProps) {
  const [messages, setMessages] = useState<EnhancedChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [showInvitation, setShowInvitation] = useState(true);
  const [invitationAccepted, setInvitationAccepted] = useState(false);
  const [showRideInfo, setShowRideInfo] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<EnhancedChatMessage | null>(
    null
  );
  const [showAttachments, setShowAttachments] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Connect to socket and join ride chat
    socketService.connect(currentUserId);
    socketService.joinRideChat(rideId);
    setIsConnected(true);

    // Listen for new messages
    socketService.onNewMessage((message: ChatMessage) => {
      setMessages((prev) => [...prev, message as EnhancedChatMessage]);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    // Load existing messages
    loadExistingMessages();

    // Simulate typing users for demo
    setTimeout(() => {
      setTypingUsers(["Priya Sharma"]);
      setTimeout(() => setTypingUsers([]), 3000);
    }, 5000);

    return () => {
      socketService.offNewMessage();
      socketService.leaveRideChat(rideId);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [rideId, currentUserId]);

  const loadExistingMessages = () => {
    const mockMessages: EnhancedChatMessage[] = [
      {
        id: "1",
        senderId: "driver123",
        senderName: rideDetails.driverName,
        message: `Hey! Welcome to the ride from ${rideDetails.from} to ${rideDetails.to}. I'll pick you up at ${rideDetails.departureTime}.`,
        timestamp: new Date(Date.now() - 3600000),
        rideId,
        senderPhoto: rideDetails.driverPhoto,
        reactions: [{ emoji: "👍", count: 2, users: ["user456", "user789"] }],
        messageType: "text",
      },
      {
        id: "2",
        senderId: "user456",
        senderName: "Priya Sharma",
        message: "Perfect! I'll be ready at the main gate.",
        timestamp: new Date(Date.now() - 3000000),
        rideId,
        senderPhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
        reactions: [{ emoji: "❤️", count: 1, users: ["driver123"] }],
        messageType: "text",
      },
      {
        id: "3",
        senderId: "driver123",
        senderName: rideDetails.driverName,
        message: "Great! Don't forget to bring your ID cards for verification.",
        timestamp: new Date(Date.now() - 2400000),
        rideId,
        senderPhoto: rideDetails.driverPhoto,
        messageType: "text",
      },
      {
        id: "4",
        senderId: "system",
        senderName: "System",
        message: "Priya Sharma joined the ride",
        timestamp: new Date(Date.now() - 1800000),
        rideId,
        senderPhoto: "",
        messageType: "system",
      },
    ];
    setMessages(mockMessages);
  };

  const handleAcceptInvitation = () => {
    setInvitationAccepted(true);
    setShowInvitation(false);

    // Send acceptance message
    const acceptanceMessage = {
      senderId: currentUserId,
      senderName: currentUserName,
      message:
        "✅ I've accepted the ride invitation! Looking forward to the trip.",
      rideId,
    };

    socketService.sendMessage(acceptanceMessage);

    Alert.alert(
      "Ride Accepted!",
      `You've successfully joined the ride from ${rideDetails.from} to ${rideDetails.to}. The driver will contact you soon.`,
      [{ text: "OK" }]
    );
  };

  const handleDeclineInvitation = () => {
    setShowInvitation(false);
    Alert.alert(
      "Invitation Declined",
      "You've declined this ride invitation.",
      [{ text: "Go Back", onPress: onBack }, { text: "Stay in Chat" }]
    );
  };

  const handleCall = () => {
    Alert.alert("Call Driver", `Call ${rideDetails.driverName}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Call",
        onPress: () => {
          const phoneNumber = `tel:${rideDetails.driverPhone}`;
          Linking.openURL(phoneNumber).catch(() => {
            Alert.alert("Error", "Unable to make phone call");
          });
        },
      },
    ]);
  };

  const sendMessage = () => {
    if (!inputText.trim() || !isConnected) return;

    const messageData: EnhancedChatMessage = {
      id: Date.now().toString(),
      senderId: currentUserId,
      senderName: currentUserName,
      message: inputText.trim(),
      rideId,
      timestamp: new Date(),
      senderPhoto: `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUserId}`,
      messageType: "text",
      replyTo: replyingTo?.id,
    };

    // Add message locally first for immediate feedback
    setMessages((prev) => [...prev, messageData]);

    // Send to socket
    socketService.sendMessage(messageData);

    // Clear input and reply
    setInputText("");
    setReplyingTo(null);

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      socketService.sendTyping(rideId, currentUserId, true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socketService.sendTyping(rideId, currentUserId, false);
    }, 1000);
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const reactions = msg.reactions || [];
          const existingReaction = reactions.find((r) => r.emoji === emoji);

          if (existingReaction) {
            if (existingReaction.users.includes(currentUserId)) {
              // Remove reaction
              existingReaction.count--;
              existingReaction.users = existingReaction.users.filter(
                (u) => u !== currentUserId
              );
              if (existingReaction.count === 0) {
                return {
                  ...msg,
                  reactions: reactions.filter((r) => r.emoji !== emoji),
                };
              }
            } else {
              // Add reaction
              existingReaction.count++;
              existingReaction.users.push(currentUserId);
            }
          } else {
            // New reaction
            reactions.push({ emoji, count: 1, users: [currentUserId] });
          }

          return { ...msg, reactions };
        }
        return msg;
      })
    );

    Vibration.vibrate(50); // Haptic feedback
  };

  const handleReply = (message: EnhancedChatMessage) => {
    setReplyingTo(message);
    inputRef.current?.focus();
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 24) {
      return new Intl.DateTimeFormat("en", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(timestamp);
    } else {
      return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(timestamp);
    }
  };

  const renderReactions = (reactions: MessageReaction[]) => {
    if (!reactions || reactions.length === 0) return null;

    return (
      <View style={styles.reactionsContainer}>
        {reactions.map((reaction, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.reactionBubble,
              {
                backgroundColor: reaction.users.includes(currentUserId)
                  ? isDarkMode
                    ? "#0084FF"
                    : "#007AFF"
                  : isDarkMode
                  ? "#2A2A2A"
                  : "#F0F0F0",
              },
            ]}
            onPress={() => addReaction(selectedMessage || "", reaction.emoji)}
          >
            <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
            <Text
              style={[
                styles.reactionCount,
                {
                  color: reaction.users.includes(currentUserId)
                    ? "#FFFFFF"
                    : isDarkMode
                    ? "#FFFFFF"
                    : "#000000",
                },
              ]}
            >
              {reaction.count}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderMessage = ({
    item,
    index,
  }: {
    item: EnhancedChatMessage;
    index: number;
  }) => {
    const isOwnMessage = item.senderId === currentUserId;
    const isSystemMessage = item.messageType === "system";
    const showAvatar = !isOwnMessage && !isSystemMessage;
    const prevMessage = index > 0 ? messages[index - 1] : null;
    const nextMessage =
      index < messages.length - 1 ? messages[index + 1] : null;
    const showSenderName =
      !isOwnMessage && (!prevMessage || prevMessage.senderId !== item.senderId);
    const isConsecutive = nextMessage && nextMessage.senderId === item.senderId;

    if (isSystemMessage) {
      return (
        <View style={styles.systemMessageContainer}>
          <View
            style={[
              styles.systemMessageBubble,
              { backgroundColor: isDarkMode ? "#2A2A2A" : "#E8E8E8" },
            ]}
          >
            <Text
              style={[
                styles.systemMessageText,
                { color: isDarkMode ? "#CCCCCC" : "#666666" },
              ]}
            >
              {item.message}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.messageContainer,
          isOwnMessage
            ? styles.ownMessageContainer
            : styles.otherMessageContainer,
          { marginBottom: isConsecutive ? 2 : 12 },
        ]}
      >
        {showAvatar && (
          <Image
            source={{ uri: item.senderPhoto }}
            style={[styles.messageAvatar, { opacity: isConsecutive ? 0 : 1 }]}
          />
        )}

        <TouchableOpacity
          style={[
            styles.messageBubble,
            isOwnMessage ? styles.ownMessageBubble : styles.otherMessageBubble,
            {
              backgroundColor: isOwnMessage
                ? isDarkMode
                  ? "#0084FF"
                  : "#007AFF"
                : isDarkMode
                ? "#2A2A2A"
                : "#F0F0F0",
              marginLeft: !isOwnMessage && !showAvatar ? 52 : 0,
              borderTopLeftRadius: !isOwnMessage && isConsecutive ? 8 : 20,
              borderTopRightRadius: isOwnMessage && isConsecutive ? 8 : 20,
              borderBottomLeftRadius: !isOwnMessage && !isConsecutive ? 20 : 8,
              borderBottomRightRadius: isOwnMessage && !isConsecutive ? 20 : 8,
            },
          ]}
          onLongPress={() => {
            setSelectedMessage(item.id);
            Vibration.vibrate(50);
            // Show action menu
          }}
          delayLongPress={500}
        >
          {showSenderName && (
            <Text
              style={[
                styles.senderName,
                { color: isDarkMode ? "#4CAF50" : "#007AFF" },
              ]}
            >
              {item.senderName}
            </Text>
          )}

          {item.replyTo && (
            <View
              style={[
                styles.replyContainer,
                {
                  backgroundColor: isOwnMessage
                    ? "rgba(255,255,255,0.2)"
                    : "rgba(0,0,0,0.1)",
                },
              ]}
            >
              <View
                style={[
                  styles.replyLine,
                  { backgroundColor: isOwnMessage ? "#FFFFFF" : "#007AFF" },
                ]}
              />
              <Text
                style={[
                  styles.replyText,
                  {
                    color: isOwnMessage
                      ? "rgba(255,255,255,0.8)"
                      : "rgba(0,0,0,0.6)",
                  },
                ]}
              >
                Original message...
              </Text>
            </View>
          )}

          <Text
            style={[
              styles.messageText,
              {
                color: isOwnMessage
                  ? "#FFFFFF"
                  : isDarkMode
                  ? "#FFFFFF"
                  : "#000000",
                fontSize: 16,
                lineHeight: 22,
              },
            ]}
          >
            {item.message}
          </Text>

          <View style={styles.messageFooter}>
            <Text
              style={[
                styles.timeText,
                {
                  color: isOwnMessage
                    ? "rgba(255,255,255,0.7)"
                    : isDarkMode
                    ? "rgba(255,255,255,0.5)"
                    : "rgba(0,0,0,0.5)",
                },
              ]}
            >
              {formatTime(item.timestamp)}
            </Text>
            {item.isEdited && (
              <Text
                style={[
                  styles.editedText,
                  {
                    color: isOwnMessage
                      ? "rgba(255,255,255,0.5)"
                      : isDarkMode
                      ? "rgba(255,255,255,0.3)"
                      : "rgba(0,0,0,0.3)",
                  },
                ]}
              >
                edited
              </Text>
            )}
            {isOwnMessage && (
              <CheckCheck
                size={14}
                color="rgba(255,255,255,0.7)"
                style={{ marginLeft: 4 }}
              />
            )}
          </View>
        </TouchableOpacity>

        {/* Quick Reaction Buttons */}
        <View style={styles.quickReactions}>
          {["❤️", "👍", "😂"].map((emoji) => (
            <TouchableOpacity
              key={emoji}
              style={[
                styles.quickReactionButton,
                { backgroundColor: isDarkMode ? "#2A2A2A" : "#F0F0F0" },
              ]}
              onPress={() => addReaction(item.id, emoji)}
            >
              <Text style={styles.quickReactionEmoji}>{emoji}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[
              styles.quickReactionButton,
              { backgroundColor: isDarkMode ? "#2A2A2A" : "#F0F0F0" },
            ]}
            onPress={() => handleReply(item)}
          >
            <Reply size={12} color={isDarkMode ? "#FFFFFF" : "#000000"} />
          </TouchableOpacity>
        </View>

        {renderReactions(item.reactions || [])}
      </View>
    );
  };

  const RideInfoModal = () => (
    <Modal
      visible={showRideInfo}
      animationType="slide"
      transparent
      onRequestClose={() => setShowRideInfo(false)}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.rideInfoModal,
            { backgroundColor: isDarkMode ? "#1A1A1A" : "#FFFFFF" },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text
              style={[
                styles.modalTitle,
                { color: isDarkMode ? "#FFFFFF" : "#000000" },
              ]}
            >
              Ride Details
            </Text>
            <TouchableOpacity onPress={() => setShowRideInfo(false)}>
              <X size={24} color={isDarkMode ? "#FFFFFF" : "#000000"} />
            </TouchableOpacity>
          </View>

          <View style={styles.driverInfo}>
            <Image
              source={{ uri: rideDetails.driverPhoto }}
              style={styles.driverAvatar}
            />
            <View style={styles.driverDetails}>
              <Text
                style={[
                  styles.driverName,
                  { color: isDarkMode ? "#FFFFFF" : "#000000" },
                ]}
              >
                {rideDetails.driverName}
              </Text>
              <View style={styles.ratingContainer}>
                <Star size={16} color="#FFD700" fill="#FFD700" />
                <Text
                  style={[
                    styles.rating,
                    { color: isDarkMode ? "#CCCCCC" : "#666666" },
                  ]}
                >
                  {rideDetails.driverRating}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.callButton} onPress={handleCall}>
              <Phone size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.rideDetailsContainer}>
            <View style={styles.routeInfo}>
              <MapPin size={20} color={isDarkMode ? "#CCCCCC" : "#666666"} />
              <Text
                style={[
                  styles.routeText,
                  { color: isDarkMode ? "#FFFFFF" : "#000000" },
                ]}
              >
                {rideDetails.from} → {rideDetails.to}
              </Text>
            </View>

            <View style={styles.timeInfo}>
              <Clock size={20} color={isDarkMode ? "#CCCCCC" : "#666666"} />
              <Text
                style={[
                  styles.timeText,
                  { color: isDarkMode ? "#CCCCCC" : "#666666" },
                ]}
              >
                {rideDetails.date} at {rideDetails.departureTime}
              </Text>
            </View>

            <View style={styles.seatsInfo}>
              <Users size={20} color={isDarkMode ? "#CCCCCC" : "#666666"} />
              <Text
                style={[
                  styles.seatsText,
                  { color: isDarkMode ? "#CCCCCC" : "#666666" },
                ]}
              >
                {rideDetails.availableSeats} seats available
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.priceInfo,
              { borderTopColor: isDarkMode ? "#2A2A2A" : "#E0E0E0" },
            ]}
          >
            <Text
              style={[
                styles.priceLabel,
                { color: isDarkMode ? "#CCCCCC" : "#666666" },
              ]}
            >
              Price per seat
            </Text>
            <Text
              style={[
                styles.price,
                { color: isDarkMode ? "#FFFFFF" : "#000000" },
              ]}
            >
              ₹{rideDetails.pricePerSeat}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <Modal visible={true} animationType="slide" presentationStyle="fullScreen">
      <View
        style={[
          styles.container,
          { backgroundColor: isDarkMode ? "#000000" : "#F8F9FA" },
        ]}
      >
        <StatusBar
          barStyle={isDarkMode ? "light-content" : "dark-content"}
          backgroundColor={isDarkMode ? "#000000" : "#FFFFFF"}
        />
        <SafeAreaView style={styles.safeArea}>
          {/* Modern Header */}
          <View
            style={[
              styles.header,
              {
                backgroundColor: isDarkMode ? "#000000" : "#FFFFFF",
                borderBottomColor: isDarkMode ? "#2A2A2A" : "#E0E0E0",
              },
            ]}
          >
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <ArrowLeft size={24} color={isDarkMode ? "#FFFFFF" : "#000000"} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.headerInfo}
              onPress={() => setShowRideInfo(true)}
            >
              <Image
                source={{ uri: rideDetails.driverPhoto }}
                style={styles.headerAvatar}
              />
              <View style={styles.headerText}>
                <Text
                  style={[
                    styles.headerTitle,
                    { color: isDarkMode ? "#FFFFFF" : "#000000" },
                  ]}
                >
                  {rideDetails.driverName}
                </Text>
                <View style={styles.statusContainer}>
                  <View
                    style={[
                      styles.onlineIndicator,
                      { backgroundColor: isConnected ? "#4CAF50" : "#FFA726" },
                    ]}
                  />
                  <Text
                    style={[
                      styles.headerSubtitle,
                      { color: isDarkMode ? "#CCCCCC" : "#666666" },
                    ]}
                  >
                    {isConnected ? "Online" : "Connecting..."}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleCall}
              >
                <Phone size={20} color={isDarkMode ? "#FFFFFF" : "#000000"} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setShowRideInfo(true)}
              >
                <Info size={20} color={isDarkMode ? "#FFFFFF" : "#000000"} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Enhanced Invitation Card */}
          {showInvitation && !invitationAccepted && (
            <View
              style={[
                styles.invitationCard,
                { backgroundColor: isDarkMode ? "#1A1A1A" : "#FFFFFF" },
              ]}
            >
              <LinearGradient
                colors={
                  isDarkMode ? ["#2A2A2A", "#1A1A1A"] : ["#F8F9FA", "#FFFFFF"]
                }
                style={styles.invitationGradient}
              >
                <View style={styles.invitationIcon}>
                  <User size={24} color={isDarkMode ? "#4CAF50" : "#007AFF"} />
                </View>

                <Text
                  style={[
                    styles.invitationTitle,
                    { color: isDarkMode ? "#FFFFFF" : "#000000" },
                  ]}
                >
                  Ride Invitation
                </Text>

                <Text
                  style={[
                    styles.invitationText,
                    { color: isDarkMode ? "#CCCCCC" : "#666666" },
                  ]}
                >
                  {rideDetails.driverName} has invited you to join this ride
                </Text>

                <View style={styles.invitationDetails}>
                  <View style={styles.detailRow}>
                    <MapPin
                      size={16}
                      color={isDarkMode ? "#CCCCCC" : "#666666"}
                    />
                    <Text
                      style={[
                        styles.detailText,
                        { color: isDarkMode ? "#FFFFFF" : "#000000" },
                      ]}
                    >
                      {rideDetails.from} → {rideDetails.to}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Clock
                      size={16}
                      color={isDarkMode ? "#CCCCCC" : "#666666"}
                    />
                    <Text
                      style={[
                        styles.detailText,
                        { color: isDarkMode ? "#FFFFFF" : "#000000" },
                      ]}
                    >
                      {rideDetails.date} • {rideDetails.departureTime}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text
                      style={[
                        styles.priceHighlight,
                        { color: isDarkMode ? "#4CAF50" : "#007AFF" },
                      ]}
                    >
                      ₹{rideDetails.pricePerSeat}
                    </Text>
                    <Text
                      style={[
                        styles.priceLabel,
                        { color: isDarkMode ? "#CCCCCC" : "#666666" },
                      ]}
                    >
                      per seat
                    </Text>
                  </View>
                </View>

                <View style={styles.invitationActions}>
                  <TouchableOpacity
                    style={[
                      styles.declineButton,
                      { borderColor: isDarkMode ? "#666666" : "#CCCCCC" },
                    ]}
                    onPress={handleDeclineInvitation}
                  >
                    <X size={16} color={isDarkMode ? "#666666" : "#CCCCCC"} />
                    <Text
                      style={[
                        styles.declineText,
                        { color: isDarkMode ? "#666666" : "#CCCCCC" },
                      ]}
                    >
                      Decline
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.acceptButton,
                      { backgroundColor: isDarkMode ? "#4CAF50" : "#007AFF" },
                    ]}
                    onPress={handleAcceptInvitation}
                  >
                    <Check size={16} color="#FFFFFF" />
                    <Text style={styles.acceptText}>Accept & Join</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          )}

          {/* Messages */}
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={({ item, index }) => renderMessage({ item, index })}
            keyExtractor={(item) => item.id}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => {
              flatListRef.current?.scrollToEnd({ animated: true });
            }}
            inverted={false}
            maintainVisibleContentPosition={{
              minIndexForVisible: 0,
            }}
          />

          {/* Typing Indicator */}
          {typingUsers.length > 0 && (
            <View
              style={[
                styles.typingIndicator,
                { backgroundColor: isDarkMode ? "#1A1A1A" : "#F8F9FA" },
              ]}
            >
              <View style={styles.typingDots}>
                <Animated.View
                  style={[
                    styles.typingDot,
                    { backgroundColor: isDarkMode ? "#666" : "#999" },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.typingDot,
                    { backgroundColor: isDarkMode ? "#666" : "#999" },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.typingDot,
                    { backgroundColor: isDarkMode ? "#666" : "#999" },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.typingText,
                  { color: isDarkMode ? "#CCCCCC" : "#666666" },
                ]}
              >
                {typingUsers.join(", ")}{" "}
                {typingUsers.length === 1 ? "is" : "are"} typing...
              </Text>
            </View>
          )}

          {/* Reply Preview */}
          {replyingTo && (
            <View
              style={[
                styles.replyPreview,
                {
                  backgroundColor: isDarkMode ? "#1A1A1A" : "#F8F9FA",
                  borderTopColor: isDarkMode ? "#2A2A2A" : "#E0E0E0",
                },
              ]}
            >
              <View style={styles.replyPreviewContent}>
                <View
                  style={[
                    styles.replyPreviewLine,
                    { backgroundColor: isDarkMode ? "#4CAF50" : "#007AFF" },
                  ]}
                />
                <View style={styles.replyPreviewText}>
                  <Text
                    style={[
                      styles.replyPreviewSender,
                      { color: isDarkMode ? "#4CAF50" : "#007AFF" },
                    ]}
                  >
                    {replyingTo.senderName}
                  </Text>
                  <Text
                    style={[
                      styles.replyPreviewMessage,
                      { color: isDarkMode ? "#CCCCCC" : "#666666" },
                    ]}
                    numberOfLines={1}
                  >
                    {replyingTo.message}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.replyPreviewClose}
                onPress={() => setReplyingTo(null)}
              >
                <X size={16} color={isDarkMode ? "#666666" : "#999999"} />
              </TouchableOpacity>
            </View>
          )}

          {/* Attachment Options */}
          {showAttachments && (
            <View
              style={[
                styles.attachmentOptions,
                { backgroundColor: isDarkMode ? "#1A1A1A" : "#F8F9FA" },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.attachmentOption,
                  { backgroundColor: isDarkMode ? "#2A2A2A" : "#FFFFFF" },
                ]}
              >
                <Camera size={24} color={isDarkMode ? "#4CAF50" : "#007AFF"} />
                <Text
                  style={[
                    styles.attachmentOptionText,
                    { color: isDarkMode ? "#FFFFFF" : "#000000" },
                  ]}
                >
                  Camera
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.attachmentOption,
                  { backgroundColor: isDarkMode ? "#2A2A2A" : "#FFFFFF" },
                ]}
              >
                <MapPin size={24} color={isDarkMode ? "#4CAF50" : "#007AFF"} />
                <Text
                  style={[
                    styles.attachmentOptionText,
                    { color: isDarkMode ? "#FFFFFF" : "#000000" },
                  ]}
                >
                  Location
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.attachmentOption,
                  { backgroundColor: isDarkMode ? "#2A2A2A" : "#FFFFFF" },
                ]}
              >
                <Paperclip
                  size={24}
                  color={isDarkMode ? "#4CAF50" : "#007AFF"}
                />
                <Text
                  style={[
                    styles.attachmentOptionText,
                    { color: isDarkMode ? "#FFFFFF" : "#000000" },
                  ]}
                >
                  File
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Enhanced Input */}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={[
              styles.inputContainer,
              {
                backgroundColor: isDarkMode ? "#000000" : "#FFFFFF",
                borderTopColor: isDarkMode ? "#2A2A2A" : "#E0E0E0",
                paddingHorizontal: 16,
                paddingVertical: 12,
              },
            ]}
          >
            <View style={styles.inputRow}>
              {/* Attachment Button */}
              <TouchableOpacity
                style={[
                  styles.attachmentButton,
                  { backgroundColor: isDarkMode ? "#2A2A2A" : "#F5F5F5" },
                ]}
                onPress={() => setShowAttachments(!showAttachments)}
              >
                <Plus
                  size={20}
                  color={isDarkMode ? "#FFFFFF" : "#666666"}
                  style={{
                    transform: [{ rotate: showAttachments ? "45deg" : "0deg" }],
                  }}
                />
              </TouchableOpacity>

              <View
                style={[
                  styles.textInputContainer,
                  {
                    backgroundColor: isDarkMode ? "#2A2A2A" : "#F5F5F5",
                    flex: 1,
                    marginHorizontal: 8,
                    borderRadius: 24,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    maxHeight: 120,
                  },
                ]}
              >
                <TextInput
                  ref={inputRef}
                  value={inputText}
                  onChangeText={(text) => {
                    setInputText(text);
                    handleTyping();
                  }}
                  placeholder="Message..."
                  placeholderTextColor={isDarkMode ? "#666666" : "#888888"}
                  style={[
                    styles.textInput,
                    {
                      color: isDarkMode ? "#FFFFFF" : "#000000",
                      fontSize: 16,
                      lineHeight: 20,
                      minHeight: 20,
                    },
                  ]}
                  multiline
                  maxLength={1000}
                  textAlignVertical="center"
                />
              </View>

              {/* Emoji Button */}
              <TouchableOpacity
                style={[
                  styles.emojiButton,
                  { backgroundColor: isDarkMode ? "#2A2A2A" : "#F5F5F5" },
                ]}
                onPress={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile size={20} color={isDarkMode ? "#FFFFFF" : "#666666"} />
              </TouchableOpacity>

              {/* Send/Voice Button */}
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  {
                    backgroundColor: inputText.trim()
                      ? isDarkMode
                        ? "#4CAF50"
                        : "#007AFF"
                      : isDarkMode
                      ? "#2A2A2A"
                      : "#E0E0E0",
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    marginLeft: 8,
                  },
                ]}
                onPress={inputText.trim() ? sendMessage : undefined}
                disabled={!inputText.trim()}
              >
                {inputText.trim() ? (
                  <Send size={20} color="#FFFFFF" />
                ) : (
                  <Mic size={20} color={isDarkMode ? "#666666" : "#CCCCCC"} />
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>

        <RideInfoModal />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 2,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  onlineIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  headerSubtitle: {
    fontSize: 13,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 10,
    borderRadius: 20,
  },

  // Enhanced Invitation Card Styles
  invitationCard: {
    margin: 16,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  invitationGradient: {
    padding: 24,
    alignItems: "center",
  },
  invitationIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  invitationTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  invitationText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  invitationDetails: {
    width: "100%",
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  detailText: {
    fontSize: 15,
    marginLeft: 12,
    flex: 1,
  },
  priceHighlight: {
    fontSize: 20,
    fontWeight: "700",
  },
  priceLabel: {
    fontSize: 14,
    marginLeft: 8,
  },
  invitationActions: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  declineButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  declineText: {
    fontSize: 16,
    fontWeight: "600",
  },
  acceptButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  acceptText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  // Enhanced Message Styles
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 8,
  },
  messageContainer: {
    marginVertical: 2,
    marginHorizontal: 16,
  },
  ownMessageContainer: {
    alignItems: "flex-end",
  },
  otherMessageContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 4,
  },
  messageBubble: {
    maxWidth: "75%",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  ownMessageBubble: {
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    borderBottomLeftRadius: 4,
  },
  senderName: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  messageFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  timeText: {
    fontSize: 11,
  },

  // Enhanced Input Styles
  inputContainer: {
    borderTopWidth: 1,
    paddingBottom: Platform.OS === "ios" ? 20 : 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
  },
  textInputContainer: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 120,
  },
  textInput: {
    fontSize: 16,
    lineHeight: 22,
    minHeight: 22,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  rideInfoModal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: height * 0.7,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  driverInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  driverAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rating: {
    fontSize: 16,
    fontWeight: "600",
  },
  callButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
  },
  rideDetailsContainer: {
    gap: 16,
    marginBottom: 20,
  },
  routeInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  routeText: {
    fontSize: 16,
    fontWeight: "600",
  },
  timeInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  seatsInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  seatsText: {
    fontSize: 16,
  },
  priceInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 20,
    borderTopWidth: 1,
  },
  price: {
    fontSize: 24,
    fontWeight: "700",
  },

  // New styles for the enhanced message rendering
  systemMessageContainer: {
    marginVertical: 2,
    marginHorizontal: 16,
  },
  systemMessageBubble: {
    maxWidth: "75%",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  systemMessageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  replyContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
  },
  replyLine: {
    width: 2,
    height: 16,
    backgroundColor: "#FFFFFF",
    marginRight: 8,
  },
  replyText: {
    fontSize: 16,
    lineHeight: 22,
  },
  reactionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reactionBubble: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: "#2A2A2A",
  },
  reactionEmoji: {
    fontSize: 16,
    fontWeight: "700",
  },
  reactionCount: {
    fontSize: 12,
    fontWeight: "600",
  },
  quickReactions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  quickReactionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  quickReactionEmoji: {
    fontSize: 16,
    fontWeight: "700",
  },
  editedText: {
    fontSize: 12,
    fontWeight: "600",
  },

  // Enhanced input and interaction styles
  typingIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  typingDots: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 2,
  },
  typingText: {
    fontSize: 13,
    fontStyle: "italic",
  },

  replyPreview: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  replyPreviewContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  replyPreviewLine: {
    width: 3,
    height: 32,
    borderRadius: 2,
    marginRight: 12,
  },
  replyPreviewText: {
    flex: 1,
  },
  replyPreviewSender: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  replyPreviewMessage: {
    fontSize: 14,
  },
  replyPreviewClose: {
    padding: 8,
  },

  attachmentOptions: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  attachmentOption: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  attachmentOptionText: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 8,
  },

  attachmentButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  emojiButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  // Updated message styles for better spacing
  messageContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginVertical: 2,
  },
  ownMessageContainer: {
    justifyContent: "flex-end",
  },
  otherMessageContainer: {
    justifyContent: "flex-start",
  },
  messageAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
    marginTop: 4,
  },
  messageBubble: {
    maxWidth: "75%",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  ownMessageBubble: {
    backgroundColor: "#007AFF",
  },
  otherMessageBubble: {
    backgroundColor: "#F0F0F0",
  },
  senderName: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  messageFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 4,
  },
  timeText: {
    fontSize: 11,
    fontWeight: "500",
  },

  // Updated input styles
  inputContainer: {
    borderTopWidth: 1,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  textInputContainer: {
    minHeight: 44,
    justifyContent: "center",
  },
  textInput: {
    fontSize: 16,
    lineHeight: 20,
    textAlignVertical: "center",
  },
  sendButton: {
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  // Messages list styles
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 8,
    paddingBottom: 16,
  },
});
