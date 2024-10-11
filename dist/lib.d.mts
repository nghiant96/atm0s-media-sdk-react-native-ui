import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';

interface Props$5 {
    children: ReactNode;
}
declare function Atm0sMediaUIProvider({ children }: Props$5): react_jsx_runtime.JSX.Element;

interface CameraPreviewProps {
    source_name: string;
}
declare function CameraPreview({ source_name }: CameraPreviewProps): react_jsx_runtime.JSX.Element;
interface CameraSelectionProps {
    source_name: string;
    first_page?: boolean;
}
declare function CameraSelection({ source_name, first_page, }: CameraSelectionProps): react_jsx_runtime.JSX.Element;

declare function AudioMixerPlayer(): react_jsx_runtime.JSX.Element;

interface MicrophonePreviewProps {
    source_name: string;
}
declare function MicrophonePreview({ source_name }: MicrophonePreviewProps): react_jsx_runtime.JSX.Element;
interface MicrophoneSelectionProps {
    source_name: string;
    first_page?: boolean;
}
declare function MicrophoneSelection({ source_name, first_page, }: MicrophoneSelectionProps): react_jsx_runtime.JSX.Element;

interface Props$4 {
    peer: string;
    children: ReactNode;
}
declare function AudioMixerSpeaking({ peer, children }: Props$4): string | number | boolean | Iterable<ReactNode> | react_jsx_runtime.JSX.Element | null | undefined;

interface Props$3 {
    audio_direct?: boolean;
    my_video?: string;
}
declare function PeersPanel({ audio_direct, my_video }: Props$3): react_jsx_runtime.JSX.Element;

interface Props$2 {
    audio_name: string;
    video_name: string;
}
declare function DevicesSelection({ audio_name, video_name }: Props$2): react_jsx_runtime.JSX.Element;

interface Props$1 {
    audio_name: string;
    video_name: string;
}
declare function ControlsPanel({ audio_name, video_name }: Props$1): react_jsx_runtime.JSX.Element;

interface Props {
    channel: string;
}
declare function ChatPanel({ channel }: Props): react_jsx_runtime.JSX.Element;

export { Atm0sMediaUIProvider, AudioMixerPlayer, AudioMixerSpeaking, CameraPreview, CameraSelection, ChatPanel, ControlsPanel, DevicesSelection, MicrophonePreview, MicrophoneSelection, PeersPanel };
