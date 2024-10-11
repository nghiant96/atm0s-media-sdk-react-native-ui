"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/lib.ts
var lib_exports = {};
__export(lib_exports, {
  Atm0sMediaUIProvider: () => Atm0sMediaUIProvider,
  AudioMixerPlayer: () => AudioMixerPlayer,
  AudioMixerSpeaking: () => AudioMixerSpeaking,
  CameraPreview: () => CameraPreview,
  CameraSelection: () => CameraSelection,
  ChatPanel: () => ChatPanel,
  ControlsPanel: () => ControlsPanel,
  DevicesSelection: () => DevicesSelection,
  MicrophonePreview: () => MicrophonePreview,
  MicrophoneSelection: () => MicrophoneSelection,
  PeersPanel: () => PeersPanel
});
module.exports = __toCommonJS(lib_exports);

// src/provider.tsx
var import_react = require("react");

// src/context.tsx
var import_core = require("@atm0s-media-sdk/core");
var import_react_native_webrtc = require("react-native-webrtc");
var Context = class extends import_core.EventEmitter {
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
        let stream2 = await import_react_native_webrtc.mediaDevices.getUserMedia({
          audio: deviceId2 ? { deviceId: deviceId2 } : true
        });
        this.streams.set(source_name, stream2);
        break;
      }
      case "video": {
        let stream2 = await import_react_native_webrtc.mediaDevices.getUserMedia({
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
var import_jsx_runtime = require("react/jsx-runtime");
var Atm0sMediaUIContext = (0, import_react.createContext)({});
function Atm0sMediaUIProvider({ children }) {
  const context = (0, import_react.useMemo)(() => new Context(), []);
  (0, import_react.useEffect)(() => {
    return () => {
    };
  }, [context]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Atm0sMediaUIContext.Provider, { value: context, children });
}

// src/components/previews/camera.tsx
var import_react3 = require("react");
var import_react_hooks = require("@atm0s-media-sdk/react-hooks");

// src/hooks.tsx
var import_react2 = require("react");
var useDeviceStream = (source_name) => {
  const ctx = (0, import_react2.useContext)(Atm0sMediaUIContext);
  const [stream, setStream] = (0, import_react2.useState)(() => ctx.streams.get(source_name));
  (0, import_react2.useEffect)(() => {
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
var import_core2 = require("@atm0s-media-sdk/core");
var import_react_native_webrtc2 = require("react-native-webrtc");
var import_react_native = require("react-native");
var import_picker = require("@react-native-picker/picker");
var import_Feather = __toESM(require("react-native-vector-icons/Feather"));
var import_jsx_runtime2 = require("react/jsx-runtime");
function CameraPreview({ source_name }) {
  const stream = useDeviceStream(source_name);
  const [localStream, setLocalStream] = (0, import_react3.useState)(void 0);
  (0, import_react3.useEffect)(() => {
    if (stream) {
      setLocalStream(stream);
    }
  }, [stream]);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react_native.View, { style: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000"
  }, children: localStream && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    import_react_native_webrtc2.RTCView,
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
  bitrate: import_core2.BitrateControlMode.DYNAMIC_CONSUMERS
};
function CameraSelection({
  source_name,
  first_page
}) {
  const publisher = (0, import_react_hooks.usePublisher)(source_name, import_core2.Kind.VIDEO, PublisherConfig);
  const [devices, setDevices] = (0, import_react3.useState)([]);
  const ctx = (0, import_react3.useContext)(Atm0sMediaUIContext);
  const stream = useDeviceStream(source_name);
  (0, import_react3.useEffect)(() => {
    const init = async () => {
      if (first_page) {
        await ctx.requestDevice(source_name, "video");
      }
      const devices2 = await import_react_native_webrtc2.mediaDevices.enumerateDevices();
      console.log(devices2);
      setDevices(
        devices2.filter((d) => d.kind == "videoinput").map((d) => {
          return { id: d.deviceId, label: d.label };
        })
      );
    };
    init();
  }, [ctx, source_name, setDevices, first_page]);
  (0, import_react3.useEffect)(() => {
    let track = stream?.getVideoTracks()[0];
    if (track && !publisher.attached) {
      publisher.attach(track);
    } else if (!track && publisher.attached) {
      publisher.detach();
    }
  }, [publisher, stream]);
  const onToggle = (0, import_react3.useCallback)(() => {
    if (stream) {
      ctx.turnOffDevice(source_name);
    } else {
      ctx.requestDevice(source_name, "video").then(console.log).catch(console.error);
    }
  }, [ctx, stream]);
  const onChange = (0, import_react3.useCallback)((event) => {
    let selected = event.target.options[event.target.selectedIndex].value;
    ctx.requestDevice(source_name, "video", selected).then(console.log).catch(console.error);
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_react_native.View, { style: { flexDirection: "row", height: 40 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react_native.TouchableOpacity, { onPress: onToggle, children: stream ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_Feather.default, { name: "camera", size: 24 }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_Feather.default, { name: "camera-off", size: 24 }) }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_react_native.View, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react_native.Text, { children: "Select a Device:" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        import_picker.Picker,
        {
          selectedValue: stream?.getTracks()[0]?.id,
          onValueChange: (itemValue) => onChange(itemValue),
          children: devices.map((d) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_picker.Picker.Item, { label: d.label, value: d.id }, d.id))
        }
      )
    ] })
  ] });
}

// src/components/consumers/audio_mixer.tsx
var import_react_native2 = require("react-native");
var import_jsx_runtime3 = require("react/jsx-runtime");
function AudioMixerPlayer() {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_react_native2.View, {});
}

// src/components/previews/microphone.tsx
var import_react4 = require("react");
var import_react_hooks2 = require("@atm0s-media-sdk/react-hooks");
var import_core3 = require("@atm0s-media-sdk/core");
var import_react_native_webrtc3 = require("react-native-webrtc");
var import_react_native3 = require("react-native");
var import_picker2 = require("@react-native-picker/picker");
var import_Ionicons = __toESM(require("react-native-vector-icons/Ionicons"));
var import_jsx_runtime4 = require("react/jsx-runtime");
function MicrophonePreview({ source_name }) {
  const stream = useDeviceStream(source_name);
  const [localStream, setLocalStream] = (0, import_react4.useState)(void 0);
  (0, import_react4.useEffect)(() => {
    if (stream) {
      setLocalStream(stream);
    }
  }, [stream]);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_react_native3.View, { style: { width: "100%", height: "100%" }, children: localStream && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    import_react_native_webrtc3.RTCView,
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
  const publisher = (0, import_react_hooks2.usePublisher)(source_name, import_core3.Kind.AUDIO);
  const [devices, setDevices] = (0, import_react4.useState)([]);
  const ctx = (0, import_react4.useContext)(Atm0sMediaUIContext);
  const stream = useDeviceStream(source_name);
  (0, import_react4.useEffect)(() => {
    const init = async () => {
      if (first_page) {
        await ctx.requestDevice(source_name, "audio");
      }
      const devices2 = await import_react_native_webrtc3.mediaDevices.enumerateDevices();
      console.log(devices2);
      setDevices(
        devices2.filter((d) => d.kind == "audioinput").map((d) => {
          return { id: d.deviceId, label: d.label };
        })
      );
    };
    init();
  }, [ctx, source_name, setDevices, first_page]);
  (0, import_react4.useEffect)(() => {
    let track = stream?.getAudioTracks()[0];
    if (track && !publisher.attached) {
      publisher.attach(track);
    } else if (!track && publisher.attached) {
      publisher.detach();
    }
  }, [publisher, stream]);
  const onToggle = (0, import_react4.useCallback)(() => {
    if (stream) {
      ctx.turnOffDevice(source_name);
    } else {
      ctx.requestDevice(source_name, "audio").then(console.log).catch(console.error);
    }
  }, [ctx, stream]);
  const onChange = (0, import_react4.useCallback)((event) => {
    let selected = event.target.options[event.target.selectedIndex].value;
    ctx.requestDevice(source_name, "audio", selected).then(console.log).catch(console.error);
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_react_native3.View, { style: { flexDirection: "row", height: 40 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_react_native3.TouchableOpacity, { onPress: onToggle, children: stream ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_Ionicons.default, { name: "mic-outline", size: 24 }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_Ionicons.default, { name: "mic-off-outline", size: 24 }) }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_react_native3.View, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_react_native3.Text, { children: "Select a Device:" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        import_picker2.Picker,
        {
          selectedValue: stream?.getTracks()[0]?.id,
          onValueChange: (itemValue) => onChange(itemValue),
          children: devices.map((d) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_picker2.Picker.Item, { label: d.label, value: d.id }, d.id))
        }
      )
    ] })
  ] });
}

// src/components/uis/audio_mixer_speaking.tsx
var import_react_hooks3 = require("@atm0s-media-sdk/react-hooks");
var import_react5 = require("react");
var import_jsx_runtime5 = require("react/jsx-runtime");
function AudioMixerSpeaking({ peer, children }) {
  const [speaking, setSpeaking] = (0, import_react5.useState)(false);
  const voiceActivity = (0, import_react_hooks3.useMixerPeerVoiceActivity)(peer);
  (0, import_react5.useEffect)(() => {
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
  return speaking ? children : /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_jsx_runtime5.Fragment, {});
}

// src/panels/peers_panel.tsx
var import_react_hooks7 = require("@atm0s-media-sdk/react-hooks");

// src/components/consumers/peer_remote.tsx
var import_react_hooks6 = require("@atm0s-media-sdk/react-hooks");

// src/components/consumers/audio_remote.tsx
var import_react_hooks4 = require("@atm0s-media-sdk/react-hooks");
var import_react6 = require("react");
var import_react_native_webrtc4 = require("react-native-webrtc");
var import_react_native4 = require("react-native");
var import_jsx_runtime6 = require("react/jsx-runtime");
function AudioRemote({ track }) {
  const consumer = (0, import_react_hooks4.useConsumer)(track);
  const _audioActivity = (0, import_react_hooks4.useConsumerVoiceActivity)(consumer);
  (0, import_react6.useEffect)(() => {
    consumer.attach({
      priority: 10,
      maxSpatial: 2,
      maxTemporal: 2
    });
    return () => {
      consumer.detach();
    };
  }, [consumer]);
  const [localStream, setLocalStream] = (0, import_react6.useState)(void 0);
  (0, import_react6.useEffect)(() => {
    if (consumer) {
      setLocalStream(consumer.stream);
    }
  }, [consumer]);
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_react_native4.View, { style: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000"
  }, children: localStream && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
    import_react_native_webrtc4.RTCView,
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
var import_react_hooks5 = require("@atm0s-media-sdk/react-hooks");
var import_react7 = require("react");
var import_react_native5 = require("react-native");
var import_react_native_webrtc5 = require("react-native-webrtc");
var import_jsx_runtime7 = require("react/jsx-runtime");
function VideoRemote({ track }) {
  const consumer = (0, import_react_hooks5.useConsumer)(track);
  (0, import_react7.useEffect)(() => {
    consumer.attach({
      priority: 10,
      maxSpatial: 2,
      maxTemporal: 2
    });
    return () => {
      consumer.detach();
    };
  }, [consumer]);
  const [localStream, setLocalStream] = (0, import_react7.useState)(void 0);
  (0, import_react7.useEffect)(() => {
    if (consumer) {
      setLocalStream(consumer.stream);
    }
  }, [consumer]);
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_react_native5.View, { style: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000"
  }, children: localStream && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
    import_react_native_webrtc5.RTCView,
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
var import_react_native6 = require("react-native");
var import_Ionicons2 = __toESM(require("react-native-vector-icons/Ionicons"));
var import_jsx_runtime8 = require("react/jsx-runtime");
function PeerRemoteDirectAudio({ peer }) {
  const remote_audios = (0, import_react_hooks6.useRemoteAudioTracks)(peer.peer);
  const remote_videos = (0, import_react_hooks6.useRemoteVideoTracks)(peer.peer);
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(import_react_native6.View, { style: {
    width: "50%",
    height: 200,
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(import_react_native6.Text, { children: peer.peer }),
    remote_videos.map((t) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(VideoRemote, { track: t }, t.track)),
    remote_audios.map((t) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(AudioRemote, { track: t }, t.track))
  ] });
}
function PeerRemoteMixerAudio({ peer }) {
  const remote_videos = (0, import_react_hooks6.useRemoteVideoTracks)(peer.peer);
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(import_react_native6.View, { style: {
    width: "50%",
    height: 200,
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(import_react_native6.View, { style: { flexDirection: "row" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(import_react_native6.Text, { children: peer.peer }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(AudioMixerSpeaking, { peer: peer.peer, children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(import_Ionicons2.default, { name: "text-to-speech", size: 24 }) })
    ] }),
    remote_videos.map((t) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(VideoRemote, { track: t }, t.track))
  ] });
}

// src/components/consumers/peer_local.tsx
var import_react_native7 = require("react-native");
var import_react8 = require("react");
var import_react_native_webrtc6 = require("react-native-webrtc");
var import_jsx_runtime9 = require("react/jsx-runtime");
function PeerLocal({ video }) {
  const [localStream, setLocalStream] = (0, import_react8.useState)(void 0);
  const stream = useDeviceStream(video);
  (0, import_react8.useEffect)(() => {
    if (stream) {
      setLocalStream(stream);
    }
  }, [stream]);
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(import_react_native7.View, { style: {
    flex: 1,
    width: "50%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000"
  }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_react_native7.Text, { children: "Me" }),
    localStream && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
      import_react_native_webrtc6.RTCView,
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
var import_react_native8 = require("react-native");
var import_jsx_runtime10 = require("react/jsx-runtime");
function PeersPanel({ audio_direct, my_video }) {
  const room = (0, import_react_hooks7.useRoom)();
  const remote_peers = (0, import_react_hooks7.useRemotePeers)();
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(import_react_native8.View, { style: { flexDirection: "row", flexWrap: "wrap", flex: 1, width: "100%" }, children: [
    my_video && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(PeerLocal, { video: my_video }),
    remote_peers.filter((p) => p.peer != room?.peer).map(
      (p) => audio_direct ? /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(PeerRemoteDirectAudio, { peer: p }, p.peer) : /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(PeerRemoteMixerAudio, { peer: p }, p.peer)
    )
  ] });
}

// src/panels/devices_selection.tsx
var import_react_native9 = require("react-native");
var import_jsx_runtime11 = require("react/jsx-runtime");
function DevicesSelection({ audio_name, video_name }) {
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(import_react_native9.View, { style: { flex: 1 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(import_react_native9.View, { style: { width: 200, height: 200, backgroundColor: "red" }, children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(CameraPreview, { source_name: video_name }) }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(import_react_native9.View, { style: { flexDirection: "row", justifyContent: "space-between" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(CameraSelection, { source_name: video_name, first_page: true }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(MicrophoneSelection, { source_name: audio_name, first_page: true })
    ] })
  ] });
}

// src/panels/controls_panel.tsx
var import_react_native10 = require("react-native");
var import_jsx_runtime12 = require("react/jsx-runtime");
function ControlsPanel({ audio_name, video_name }) {
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_react_native10.View, {});
}

// src/panels/chat_panel.tsx
var import_react_hooks8 = require("@atm0s-media-sdk/react-hooks");
var import_react9 = require("react");
var import_react_native11 = require("react-native");
var import_jsx_runtime13 = require("react/jsx-runtime");
function ChatPanel({ channel }) {
  const chatInputRef = (0, import_react9.useRef)(null);
  const [chats, setChats] = (0, import_react9.useState)([]);
  const msgChannel = (0, import_react_hooks8.useMessageChannel)(channel, (e) => {
    setChats((chats2) => [
      ...chats2,
      { peer: e.peer, message: e.message }
    ]);
  });
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(import_react_native11.View, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_react_native11.View, { id: "chat-container", children: chats.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(import_react_native11.View, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("b", { children: [
        c.peer,
        ":"
      ] }),
      " ",
      c.message
    ] }, i)) }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_react_native11.View, {})
  ] });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
