// src/provider.tsx
import { createContext, useEffect, useMemo } from "react";

// src/context.tsx
import { EventEmitter } from "@atm0s-media-sdk/core";
import {
  mediaDevices
} from "react-native-webrtc";
var Context = class extends EventEmitter {
  streams = /* @__PURE__ */ new Map();
  streams_history = /* @__PURE__ */ new Map();
  async requestDevice(source_name, kind, deviceId) {
    const old_stream = this.streams.get(source_name);
    if (old_stream) {
      old_stream.getTracks().map((t) => t.stop());
      this.streams.delete(source_name);
      this.emit("device.changed." /* DeviceChanged */ + source_name, null);
    }
    let deviceId2 = deviceId || this.streams_history.get(source_name);
    console.warn("request device", source_name, kind, deviceId, deviceId2);
    switch (kind) {
      case "audio": {
        let stream2 = await mediaDevices.getUserMedia({
          audio: deviceId2 ? { deviceId: deviceId2 } : true
        });
        this.streams.set(source_name, stream2);
        break;
      }
      case "video": {
        let stream2 = await mediaDevices.getUserMedia({
          video: deviceId2 ? { deviceId: deviceId2 } : true
        });
        this.streams.set(source_name, stream2);
        break;
      }
    }
    if (deviceId2) {
      this.streams_history.set(source_name, deviceId2);
    }
    let stream = this.streams.get(source_name);
    this.emit("device.changed." /* DeviceChanged */ + source_name, stream);
    return stream;
  }
  turnOffDevice(source_name) {
    const old_stream = this.streams.get(source_name);
    if (old_stream) {
      old_stream.getTracks().map((t) => t.stop());
      this.streams.delete(source_name);
      this.emit("device.changed." /* DeviceChanged */ + source_name, null);
    }
  }
};

// src/provider.tsx
import { jsx } from "react/jsx-runtime";
var Atm0sMediaUIContext = createContext({});
function Atm0sMediaUIProvider({ children }) {
  const context = useMemo(() => new Context(), []);
  useEffect(() => {
    return () => {
    };
  }, [context]);
  return /* @__PURE__ */ jsx(Atm0sMediaUIContext.Provider, { value: context, children });
}

// src/components/previews/camera.tsx
import { useCallback, useContext as useContext2, useEffect as useEffect3, useState as useState2 } from "react";
import { usePublisher } from "@atm0s-media-sdk/react-hooks";

// src/hooks.tsx
import { useContext, useEffect as useEffect2, useState } from "react";
var useDeviceStream = (source_name) => {
  const ctx = useContext(Atm0sMediaUIContext);
  const [stream, setStream] = useState(() => ctx.streams.get(source_name));
  useEffect2(() => {
    const handler = (stream2) => {
      setStream(stream2);
    };
    if (ctx.streams.get(source_name) != stream) {
      setStream(ctx.streams.get(source_name));
    }
    ctx.on("device.changed." /* DeviceChanged */ + source_name, handler);
    return () => {
      ctx.off("device.changed." /* DeviceChanged */ + source_name, handler);
    };
  }, [source_name]);
  return stream;
};

// src/components/previews/camera.tsx
import { BitrateControlMode, Kind } from "@atm0s-media-sdk/core";
import { mediaDevices as mediaDevices2, RTCView } from "react-native-webrtc";
import { Text, TouchableOpacity, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/Feather";
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
function CameraPreview({ source_name }) {
  const stream = useDeviceStream(source_name);
  const [localStream, setLocalStream] = useState2(void 0);
  useEffect3(() => {
    if (stream) {
      setLocalStream(stream);
    }
  }, [stream]);
  return /* @__PURE__ */ jsx2(View, { style: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000"
  }, children: localStream && /* @__PURE__ */ jsx2(
    RTCView,
    {
      mirror: true,
      objectFit: "cover",
      streamURL: localStream.toURL(),
      zOrder: 0,
      style: {
        width: "100%",
        height: "100%"
      }
    }
  ) });
}
var PublisherConfig = {
  simulcast: true,
  priority: 1,
  bitrate: BitrateControlMode.DYNAMIC_CONSUMERS
};
function CameraSelection({
  source_name,
  first_page
}) {
  const publisher = usePublisher(source_name, Kind.VIDEO, PublisherConfig);
  const [devices, setDevices] = useState2([]);
  const ctx = useContext2(Atm0sMediaUIContext);
  const stream = useDeviceStream(source_name);
  useEffect3(() => {
    const init = async () => {
      if (first_page) {
        await ctx.requestDevice(source_name, "video");
      }
      const devices2 = await mediaDevices2.enumerateDevices();
      console.log(devices2);
      setDevices(
        devices2.filter((d) => d.kind == "videoinput").map((d) => {
          return { id: d.deviceId, label: d.label };
        })
      );
    };
    init();
  }, [ctx, source_name, setDevices, first_page]);
  useEffect3(() => {
    let track = stream?.getVideoTracks()[0];
    if (track && !publisher.attached) {
      publisher.attach(track);
    } else if (!track && publisher.attached) {
      publisher.detach();
    }
  }, [publisher, stream]);
  const onToggle = useCallback(() => {
    if (stream) {
      ctx.turnOffDevice(source_name);
    } else {
      ctx.requestDevice(source_name, "video").then(console.log).catch(console.error);
    }
  }, [ctx, stream]);
  const onChange = useCallback((event) => {
    let selected = event.target.options[event.target.selectedIndex].value;
    ctx.requestDevice(source_name, "video", selected).then(console.log).catch(console.error);
  }, []);
  return /* @__PURE__ */ jsxs(View, { style: { flexDirection: "row", height: 40 }, children: [
    /* @__PURE__ */ jsx2(TouchableOpacity, { onPress: onToggle, children: stream ? /* @__PURE__ */ jsx2(Icon, { name: "camera", size: 24 }) : /* @__PURE__ */ jsx2(Icon, { name: "camera-off", size: 24 }) }),
    /* @__PURE__ */ jsxs(View, { children: [
      /* @__PURE__ */ jsx2(Text, { children: "Select a Device:" }),
      /* @__PURE__ */ jsx2(
        Picker,
        {
          selectedValue: stream?.getTracks()[0]?.id,
          onValueChange: (itemValue) => onChange(itemValue),
          children: devices.map((d) => /* @__PURE__ */ jsx2(Picker.Item, { label: d.label, value: d.id }, d.id))
        }
      )
    ] })
  ] });
}

// src/components/consumers/audio_mixer.tsx
import { View as View2 } from "react-native";
import { jsx as jsx3 } from "react/jsx-runtime";
function AudioMixerPlayer() {
  return /* @__PURE__ */ jsx3(View2, {});
}

// src/components/previews/microphone.tsx
import { useCallback as useCallback2, useContext as useContext3, useEffect as useEffect4, useState as useState3 } from "react";
import { usePublisher as usePublisher2 } from "@atm0s-media-sdk/react-hooks";
import { Kind as Kind2 } from "@atm0s-media-sdk/core";
import { mediaDevices as mediaDevices3, RTCView as RTCView2 } from "react-native-webrtc";
import { Text as Text2, TouchableOpacity as TouchableOpacity2, View as View3 } from "react-native";
import { Picker as Picker2 } from "@react-native-picker/picker";
import Icon2 from "react-native-vector-icons/Ionicons";
import { jsx as jsx4, jsxs as jsxs2 } from "react/jsx-runtime";
function MicrophonePreview({ source_name }) {
  const stream = useDeviceStream(source_name);
  const [localStream, setLocalStream] = useState3(void 0);
  useEffect4(() => {
    if (stream) {
      setLocalStream(stream);
    }
  }, [stream]);
  return /* @__PURE__ */ jsx4(View3, { style: { width: "100%", height: "100%" }, children: localStream && /* @__PURE__ */ jsx4(
    RTCView2,
    {
      mirror: true,
      objectFit: "cover",
      streamURL: localStream.toURL(),
      zOrder: 0,
      style: {
        width: "100%",
        height: "100%"
      }
    }
  ) });
}
function MicrophoneSelection({
  source_name,
  first_page
}) {
  const publisher = usePublisher2(source_name, Kind2.AUDIO);
  const [devices, setDevices] = useState3([]);
  const ctx = useContext3(Atm0sMediaUIContext);
  const stream = useDeviceStream(source_name);
  useEffect4(() => {
    const init = async () => {
      if (first_page) {
        await ctx.requestDevice(source_name, "audio");
      }
      const devices2 = await mediaDevices3.enumerateDevices();
      console.log(devices2);
      setDevices(
        devices2.filter((d) => d.kind == "audioinput").map((d) => {
          return { id: d.deviceId, label: d.label };
        })
      );
    };
    init();
  }, [ctx, source_name, setDevices, first_page]);
  useEffect4(() => {
    let track = stream?.getAudioTracks()[0];
    if (track && !publisher.attached) {
      publisher.attach(track);
    } else if (!track && publisher.attached) {
      publisher.detach();
    }
  }, [publisher, stream]);
  const onToggle = useCallback2(() => {
    if (stream) {
      ctx.turnOffDevice(source_name);
    } else {
      ctx.requestDevice(source_name, "audio").then(console.log).catch(console.error);
    }
  }, [ctx, stream]);
  const onChange = useCallback2((event) => {
    let selected = event.target.options[event.target.selectedIndex].value;
    ctx.requestDevice(source_name, "audio", selected).then(console.log).catch(console.error);
  }, []);
  return /* @__PURE__ */ jsxs2(View3, { style: { flexDirection: "row", height: 40 }, children: [
    /* @__PURE__ */ jsx4(TouchableOpacity2, { onPress: onToggle, children: stream ? /* @__PURE__ */ jsx4(Icon2, { name: "mic-outline", size: 24 }) : /* @__PURE__ */ jsx4(Icon2, { name: "mic-off-outline", size: 24 }) }),
    /* @__PURE__ */ jsxs2(View3, { children: [
      /* @__PURE__ */ jsx4(Text2, { children: "Select a Device:" }),
      /* @__PURE__ */ jsx4(
        Picker2,
        {
          selectedValue: stream?.getTracks()[0]?.id,
          onValueChange: (itemValue) => onChange(itemValue),
          children: devices.map((d) => /* @__PURE__ */ jsx4(Picker2.Item, { label: d.label, value: d.id }, d.id))
        }
      )
    ] })
  ] });
}

// src/components/uis/audio_mixer_speaking.tsx
import { useMixerPeerVoiceActivity } from "@atm0s-media-sdk/react-hooks";
import { useState as useState4, useEffect as useEffect5 } from "react";
import { Fragment, jsx as jsx5 } from "react/jsx-runtime";
function AudioMixerSpeaking({ peer, children }) {
  const [speaking, setSpeaking] = useState4(false);
  const voiceActivity = useMixerPeerVoiceActivity(peer);
  useEffect5(() => {
    let timeout;
    if (voiceActivity?.active) {
      setSpeaking(true);
      timeout = setTimeout(() => {
        setSpeaking(false);
      }, 1e3);
    } else {
      setSpeaking(false);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [setSpeaking, voiceActivity]);
  return speaking ? children : /* @__PURE__ */ jsx5(Fragment, {});
}

// src/panels/peers_panel.tsx
import { useRemotePeers, useRoom } from "@atm0s-media-sdk/react-hooks";

// src/components/consumers/peer_remote.tsx
import {
  useRemoteAudioTracks,
  useRemoteVideoTracks
} from "@atm0s-media-sdk/react-hooks";

// src/components/consumers/audio_remote.tsx
import {
  useConsumer,
  useConsumerVoiceActivity
} from "@atm0s-media-sdk/react-hooks";
import { useEffect as useEffect6, useState as useState5 } from "react";
import { RTCView as RTCView3 } from "react-native-webrtc";
import { View as View4 } from "react-native";
import { jsx as jsx6 } from "react/jsx-runtime";
function AudioRemote({ track }) {
  const consumer = useConsumer(track);
  const _audioActivity = useConsumerVoiceActivity(consumer);
  useEffect6(() => {
    consumer.attach({
      priority: 10,
      maxSpatial: 2,
      maxTemporal: 2
    });
    return () => {
      consumer.detach();
    };
  }, [consumer]);
  const [localStream, setLocalStream] = useState5(void 0);
  useEffect6(() => {
    if (consumer) {
      setLocalStream(consumer.stream);
    }
  }, [consumer]);
  return /* @__PURE__ */ jsx6(View4, { style: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000"
  }, children: localStream && /* @__PURE__ */ jsx6(
    RTCView3,
    {
      mirror: true,
      objectFit: "cover",
      streamURL: localStream.toURL(),
      zOrder: 1,
      style: {
        width: "100%",
        height: "100%"
      }
    }
  ) });
}

// src/components/consumers/video_remote.tsx
import { useConsumer as useConsumer2 } from "@atm0s-media-sdk/react-hooks";
import { useEffect as useEffect7, useState as useState6 } from "react";
import { View as View5 } from "react-native";
import { RTCView as RTCView4 } from "react-native-webrtc";
import { jsx as jsx7 } from "react/jsx-runtime";
function VideoRemote({ track }) {
  const consumer = useConsumer2(track);
  useEffect7(() => {
    consumer.attach({
      priority: 10,
      maxSpatial: 2,
      maxTemporal: 2
    });
    return () => {
      consumer.detach();
    };
  }, [consumer]);
  const [localStream, setLocalStream] = useState6(void 0);
  useEffect7(() => {
    if (consumer) {
      setLocalStream(consumer.stream);
    }
  }, [consumer]);
  return /* @__PURE__ */ jsx7(View5, { style: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000"
  }, children: localStream && /* @__PURE__ */ jsx7(
    RTCView4,
    {
      mirror: true,
      objectFit: "cover",
      streamURL: localStream.toURL(),
      zOrder: 1,
      style: {
        width: "100%",
        height: "100%"
      }
    }
  ) });
}

// src/components/consumers/peer_remote.tsx
import { Text as Text5, View as View6 } from "react-native";
import Icon3 from "react-native-vector-icons/Ionicons";
import { jsx as jsx8, jsxs as jsxs3 } from "react/jsx-runtime";
function PeerRemoteDirectAudio({ peer }) {
  const remote_audios = useRemoteAudioTracks(peer.peer);
  const remote_videos = useRemoteVideoTracks(peer.peer);
  return /* @__PURE__ */ jsxs3(View6, { style: {
    width: "50%",
    height: 200,
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }, children: [
    /* @__PURE__ */ jsx8(Text5, { children: peer.peer }),
    remote_videos.map((t) => /* @__PURE__ */ jsx8(VideoRemote, { track: t }, t.track)),
    remote_audios.map((t) => /* @__PURE__ */ jsx8(AudioRemote, { track: t }, t.track))
  ] });
}
function PeerRemoteMixerAudio({ peer }) {
  const remote_videos = useRemoteVideoTracks(peer.peer);
  return /* @__PURE__ */ jsxs3(View6, { style: {
    width: "50%",
    height: 200,
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }, children: [
    /* @__PURE__ */ jsxs3(View6, { style: { flexDirection: "row" }, children: [
      /* @__PURE__ */ jsx8(Text5, { children: peer.peer }),
      /* @__PURE__ */ jsx8(AudioMixerSpeaking, { peer: peer.peer, children: /* @__PURE__ */ jsx8(Icon3, { name: "text-to-speech", size: 24 }) })
    ] }),
    remote_videos.map((t) => /* @__PURE__ */ jsx8(VideoRemote, { track: t }, t.track))
  ] });
}

// src/components/consumers/peer_local.tsx
import { Text as Text6, View as View7 } from "react-native";
import { useEffect as useEffect8, useState as useState7 } from "react";
import { RTCView as RTCView5 } from "react-native-webrtc";
import { jsx as jsx9, jsxs as jsxs4 } from "react/jsx-runtime";
function PeerLocal({ video }) {
  const [localStream, setLocalStream] = useState7(void 0);
  const stream = useDeviceStream(video);
  useEffect8(() => {
    if (stream) {
      setLocalStream(stream);
    }
  }, [stream]);
  return /* @__PURE__ */ jsxs4(View7, { style: {
    flex: 1,
    width: "50%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000"
  }, children: [
    /* @__PURE__ */ jsx9(Text6, { children: "Me" }),
    localStream && /* @__PURE__ */ jsx9(
      RTCView5,
      {
        mirror: true,
        objectFit: "cover",
        streamURL: localStream.toURL(),
        zOrder: 1,
        style: {
          width: "100%",
          height: "100%"
        }
      }
    )
  ] });
}

// src/panels/peers_panel.tsx
import { View as View8 } from "react-native";
import { jsx as jsx10, jsxs as jsxs5 } from "react/jsx-runtime";
function PeersPanel({ audio_direct, my_video }) {
  const room = useRoom();
  const remote_peers = useRemotePeers();
  return /* @__PURE__ */ jsxs5(View8, { style: { flexDirection: "row", flexWrap: "wrap", flex: 1, width: "100%" }, children: [
    my_video && /* @__PURE__ */ jsx10(PeerLocal, { video: my_video }),
    remote_peers.filter((p) => p.peer != room?.peer).map(
      (p) => audio_direct ? /* @__PURE__ */ jsx10(PeerRemoteDirectAudio, { peer: p }, p.peer) : /* @__PURE__ */ jsx10(PeerRemoteMixerAudio, { peer: p }, p.peer)
    )
  ] });
}

// src/panels/devices_selection.tsx
import { View as View9 } from "react-native";
import { jsx as jsx11, jsxs as jsxs6 } from "react/jsx-runtime";
function DevicesSelection({ audio_name, video_name }) {
  return /* @__PURE__ */ jsxs6(View9, { style: { flex: 1 }, children: [
    /* @__PURE__ */ jsx11(View9, { style: { width: 200, height: 200, backgroundColor: "red" }, children: /* @__PURE__ */ jsx11(CameraPreview, { source_name: video_name }) }),
    /* @__PURE__ */ jsxs6(View9, { style: { flexDirection: "row", justifyContent: "space-between" }, children: [
      /* @__PURE__ */ jsx11(CameraSelection, { source_name: video_name, first_page: true }),
      /* @__PURE__ */ jsx11(MicrophoneSelection, { source_name: audio_name, first_page: true })
    ] })
  ] });
}

// src/panels/controls_panel.tsx
import { View as View10 } from "react-native";
import { jsx as jsx12 } from "react/jsx-runtime";
function ControlsPanel({ audio_name, video_name }) {
  return /* @__PURE__ */ jsx12(View10, {});
}

// src/panels/chat_panel.tsx
import { useMessageChannel } from "@atm0s-media-sdk/react-hooks";
import { useRef as useRef6, useState as useState8 } from "react";
import { View as View11 } from "react-native";
import { jsx as jsx13, jsxs as jsxs7 } from "react/jsx-runtime";
function ChatPanel({ channel }) {
  const chatInputRef = useRef6(null);
  const [chats, setChats] = useState8([]);
  const msgChannel = useMessageChannel(channel, (e) => {
    setChats((chats2) => [
      ...chats2,
      { peer: e.peer, message: e.message }
    ]);
  });
  return /* @__PURE__ */ jsxs7(View11, { children: [
    /* @__PURE__ */ jsx13(View11, { id: "chat-container", children: chats.map((c, i) => /* @__PURE__ */ jsxs7(View11, { children: [
      /* @__PURE__ */ jsxs7("b", { children: [
        c.peer,
        ":"
      ] }),
      " ",
      c.message
    ] }, i)) }),
    /* @__PURE__ */ jsx13(View11, {})
  ] });
}
export {
  Atm0sMediaUIProvider,
  AudioMixerPlayer,
  AudioMixerSpeaking,
  CameraPreview,
  CameraSelection,
  ChatPanel,
  ControlsPanel,
  DevicesSelection,
  MicrophonePreview,
  MicrophoneSelection,
  PeersPanel
};
